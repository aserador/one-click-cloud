import { TerraformGenerator, fn, Argument } from 'terraform-generator';
import type { NextApiRequest, NextApiResponse } from 'next';
import kahnsAlgorithm from '@/lib/kahn';
import { IGraphEdge, IService } from '@/redux/designer/models';

function s3Bucket(schema: IService) {
  // See ./src/schema/aws/schema.ts for available properties (there's definitely a better way to do this)
  const bucket_name = schema.config['bucket_name'].value;
  const folder_name = schema.deploy['build_directory'].value;

  const tfg = new TerraformGenerator({});

  tfg.resource('aws_s3_bucket', bucket_name, {
    bucket_prefix: bucket_name + '-',
  });

  tfg.resource('aws_s3_object', bucket_name, {
    for_each: fn('fileset', './' + folder_name, '**'),
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    key: '${each.value}',
    source: './' + folder_name + '/${each.value}',
    content_type: '${each.value}',
  });

  return tfg;
}


function s3Hosting(schema: IService) {
  // See ./src/schema/aws/schema.ts for available properties (there's definitely a better way to do this)
  const bucket_name = schema.config['bucket_name'].value;

  const tfg = new TerraformGenerator({});

  tfg.resource('aws_s3_bucket_cors_configuration', bucket_name, {
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    cors_rule: [
      {
        allowed_headers: ['*'],
        allowed_methods: ['GET', 'HEAD'],
        allowed_origins: ['*'],
        expose_headers: ['ETag'],
        max_age_seconds: 3000,
      },
    ],
  });

  const acl_dependencies = [
    new Argument('aws_s3_bucket_ownership_controls.' + bucket_name),
  ];

  tfg.resource('aws_s3_bucket_acl', bucket_name, {
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    acl: 'public-read',
    depends_on: acl_dependencies,
  });

  tfg.resource('aws_s3_bucket_ownership_controls', bucket_name, {
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    rule: {
      object_ownership: 'BucketOwnerPreferred',
    },
  });

  tfg.resource('aws_iam_user', bucket_name, {
    name: 'prod-' + bucket_name + '-bucket',
  });

  tfg.resource('aws_s3_bucket_public_access_block', bucket_name, {
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    block_public_acls: false,
    block_public_policy: false,
    ignore_public_acls: false,
    restrict_public_buckets: false,
  });

  const policy_dependencies = [
    new Argument('aws_s3_bucket_public_access_block.' + bucket_name),
  ];

  tfg.resource('aws_s3_bucket_policy', bucket_name, {
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Principal: '*',
          Action: ['s3:*'],
          Effect: 'Allow',
          Resource: [
            'arn:aws:s3:::${aws_s3_bucket.' + bucket_name + '.bucket}',
            'arn:aws:s3:::${aws_s3_bucket.' + bucket_name + '.bucket}/*',
          ],
        },
        {
          Sid: 'PublicReadGetObject',
          Principal: '*',
          Action: ['s3:GetObject'],
          Effect: 'Allow',
          Resource: [
            'arn:aws:s3:::${aws_s3_bucket.' + bucket_name + '.bucket}',
            'arn:aws:s3:::${aws_s3_bucket.' + bucket_name + '.bucket}/*',
          ],
        },
      ],
    }),

    depends_on: policy_dependencies,
  });

  tfg.resource('aws_s3_bucket_website_configuration', bucket_name, {
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    index_document: {
      suffix: 'index.html',
    },
  });

  tfg.output('bucket_website_endpoint', {
    description: 'The S3 bucket static hosting endpoint.',
    value:
      '${aws_s3_bucket_website_configuration.' +
      bucket_name +
      '.website_endpoint}',
  });

  return tfg;
}

function cloudFrontHosting(schema: IService) {
  // See ./src/schema/aws/schema.ts for available properties (there's definitely a better way to do this)
  const cloudfront_name = schema.config['name'].value;
  const bucket_name = schema.config['bucket_name'].value;  

  const tfg = new TerraformGenerator({});

  tfg.resource('aws_cloudfront_distribution', cloudfront_name, {
    enabled: true,
    is_ipv6_enabled: true,
    // TODO: Abstract 'bucket_name' to 'origin' in schema.ts
    origin: {
      domain_name:
        '${aws_s3_bucket_website_configuration.' +
        bucket_name +
        '.website_endpoint}',
      origin_id:
        '${aws_s3_bucket.' + bucket_name + '.bucket_regional_domain_name}',
      custom_origin_config: {
        http_port: 80,
        https_port: 443,
        origin_keepalive_timeout: 5,
        origin_protocol_policy: 'http-only',
        origin_read_timeout: 30,
        origin_ssl_protocols: ['TLSv1.2'],
      },
    },
    viewer_certificate: {
      cloudfront_default_certificate: true,
    },
    restrictions: {
      geo_restriction: {
        restriction_type: 'none',
        locations: [],
      },
    },
    default_cache_behavior: {
      cache_policy_id: '658327ea-f89d-4fab-a63d-7e88639e58f6',
      viewer_protocol_policy: 'redirect-to-https',
      compress: true,
      allowed_methods: [
        'DELETE',
        'GET',
        'HEAD',
        'OPTIONS',
        'PATCH',
        'POST',
        'PUT',
      ],
      cached_methods: ['GET', 'HEAD'],
      target_origin_id:
        '${aws_s3_bucket.' + bucket_name + '.bucket_regional_domain_name}',
    },
  });

  tfg.output('cloudfront_domain_name', {
    description: 'The domain name of the CloudFront distribution.',
    value: '${aws_cloudfront_distribution.' + cloudfront_name + '.domain_name}',
  });

  return tfg;
}

function route53hostedZone(schema: IService) {
  // See ./src/schema/aws/schema.ts for available properties (there's definitely a better way to do this)
  const domain_name = schema.config['domain'].value;
  const new_domain_name = domain_name.replace(/\./g, '-');

  const tfg = new TerraformGenerator({});

  tfg.resource('aws_route53_zone', new_domain_name, {
    name: domain_name,
  });

  tfg.resource('aws_route53_record', 'root_domain', {
    zone_id: '${aws_route53_zone.' + new_domain_name + '.zone_id}',
    name: domain_name,
    type: 'A',
    alias: {
      name: '${aws_cloudfront_distribution.cloudfront.domain_name}',
      zone_id: '${aws_cloudfront_distribution.cloudfront.hosted_zone_id}',
      evaluate_target_health: false,
    },
  });

  return tfg;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const graph = req.body;
  const graphNodes: Record<string, IService> = graph['graphServices'];
  const graphEdges: Record<string, IGraphEdge> = graph['graphEdges'];

  // Validate graph
  const unkownServices: Array<string> = [];
  Object.values(graphEdges).forEach((graphEdge: IGraphEdge) => {
    if (!(graphEdge.source in graphNodes)) {
      unkownServices.push(graphEdge.source);
    }
    if (!(graphEdge.target in graphNodes)) {
      unkownServices.push(graphEdge.target);
    }
  });
  if (unkownServices.length > 0) {
    res.status(400).json({
      error: 'Invalid graph',
      message: `Edges (${unkownServices.join(
        ', '
      )}) do not have a corresponding service`,
    });
    return;
  }

  // Builder Order
  const nodes: Array<string> = Object.keys(graphNodes);
  const edges: Array<[string, string]> = Object.values(graphEdges).map(
    (edge: IGraphEdge) => [edge.source, edge.target]
  );
  const plan: Array<string> = kahnsAlgorithm(nodes, edges);
  console.log(
    'Plan:',
    plan.map((nid: string) => graphNodes[nid]!.id)
  );

  const tfg = new TerraformGenerator({});

  tfg.provider('aws', {
    region: 'us-east-2',
  });

  const tfgs: Array<TerraformGenerator> = [];
  for (const nodeId of plan) {
    // TODO: Maybe each case should be a property of the service in schema.ts?
    const schema = graphNodes[nodeId];
    switch (schema.id) {
      case 'Simple-Storage-Service': {
        tfgs.push(s3Bucket(schema));
        if (true) {
          // TODO: Make this conditional based on the schema
          tfgs.push(s3Hosting(schema));
        }
        break;
      }
      case 'CloudFront': {
        tfgs.push(cloudFrontHosting(schema));
        break;
      }
      case 'Route-53': {
        tfgs.push(route53hostedZone(schema));
        break;
      }
    }
  }
  tfg.merge(...tfgs);
  const result = tfg.generate();
  res.status(200).json({ terraformConfig: result.tf });
}
