import { TerraformGenerator, fn, Argument} from 'terraform-generator';

function s3generator(folder_name:string, project_name:string, bucket_name:string) {
  const tfg = new TerraformGenerator({
  });


  tfg.resource('aws_s3_bucket', bucket_name, {
    bucket_prefix: project_name + '-',
  });

  tfg.resource('aws_s3_object', bucket_name, {
    for_each : fn('fileset', './' + folder_name, '**'),
    bucket: '${aws_s3_bucket.' + bucket_name + '.bucket}',
    key: "${each.value}",
    source : './' + folder_name + '/${each.value}',
    content_type: "${each.value}"
    })

  return tfg
}

function s3hosting(bucket_name:string) {

  const tfg = new TerraformGenerator({});
  
  tfg.resource('aws_s3_bucket_cors_configuration', bucket_name, {
    bucket: '${aws_s3_bucket.'+ bucket_name + '.bucket}',
    cors_rule: [
      {
        allowed_headers: ["*"],
        allowed_methods: ["GET", "HEAD"],
        allowed_origins: ["*"],
        expose_headers: ["ETag"],
        max_age_seconds: 3000
      }
    ]
  });

  const acl_dependencies = [new Argument("aws_s3_bucket_ownership_controls." + bucket_name )];

  tfg.resource('aws_s3_bucket_acl', bucket_name, {
    bucket: '${aws_s3_bucket.'+ bucket_name + '.bucket}',
    acl: "public-read",
    depends_on: acl_dependencies
  });

  
  tfg.resource("aws_s3_bucket_ownership_controls", bucket_name, {
    bucket: '${aws_s3_bucket.'+ bucket_name + '.bucket}',
    rule: {
      object_ownership: "BucketOwnerPreferred"
    }
  });

  tfg.resource("aws_iam_user", bucket_name, {
    name: "prod-" + bucket_name + "-bucket"
  });

  tfg.resource("aws_s3_bucket_public_access_block",  bucket_name, {
    bucket: '${aws_s3_bucket.'+ bucket_name + '.bucket}',
    block_public_acls: false,
    block_public_policy: false,
    ignore_public_acls: false,
    restrict_public_buckets: false
  });

  const policy_dependencies = [new Argument("aws_s3_bucket_public_access_block." + bucket_name )];

  tfg.resource("aws_s3_bucket_policy", bucket_name, {
    bucket: '${aws_s3_bucket.'+ bucket_name + '.bucket}',
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Principal: "*",
          Action: [
            "s3:*",
          ],
          Effect: "Allow",
          Resource: [
            "arn:aws:s3:::${aws_s3_bucket."+ bucket_name + ".bucket}",
            "arn:aws:s3:::${aws_s3_bucket."+ bucket_name + ".bucket}/*"
          ]
        },
        {
          Sid: "PublicReadGetObject",
          Principal: "*",
          Action: [
            "s3:GetObject",
          ],
          Effect: "Allow",
          Resource: [
            "arn:aws:s3:::${aws_s3_bucket." + bucket_name + ".bucket}",
            "arn:aws:s3:::${aws_s3_bucket." + bucket_name + ".bucket}/*"
          ]
        },
      ]
    }),

    depends_on: policy_dependencies
  });


  tfg.resource('aws_s3_bucket_website_configuration', bucket_name, {
    bucket: '${aws_s3_bucket.'+ bucket_name + '.bucket}',
    index_document: {
      suffix: 'index.html'
    }
  });


  tfg.output('bucket_website_endpoint', {
    description: 'The S3 bucket static hosting endpoint.',
    value: '${aws_s3_bucket_website_configuration.' + bucket_name + '.website_endpoint}'
  });

  return tfg
}


function cloudFrontHosting(bucket_name:string, cloudfront_name:string) {

  const tfg = new TerraformGenerator({});

  tfg.resource('aws_cloudfront_distribution', cloudfront_name, {
    enabled: true,
    is_ipv6_enabled: true,
    origin: {
      domain_name: '${aws_s3_bucket_website_configuration.' + bucket_name + '.website_endpoint}',
      origin_id: '${aws_s3_bucket.' + bucket_name + '.bucket_regional_domain_name}',
      custom_origin_config: {
        http_port: 80,
        https_port: 443,
        origin_keepalive_timeout: 5,
        origin_protocol_policy: "http-only",
        origin_read_timeout: 30,
        origin_ssl_protocols: [
          "TLSv1.2",
        ]
      }
    },
    viewer_certificate: {
      cloudfront_default_certificate: true
    },
    restrictions: {
      geo_restriction: {
        restriction_type: "none",
        locations: []
      }
    },
    default_cache_behavior: {
      cache_policy_id: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      viewer_protocol_policy: "redirect-to-https",
      compress: true,
      allowed_methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
      cached_methods: ["GET", "HEAD"],
      target_origin_id: '${aws_s3_bucket.' + bucket_name + '.bucket_regional_domain_name}'
    }
  });

  tfg.output('cloudfront_domain_name', {
    description: 'The domain name of the CloudFront distribution.',
    value: '${aws_cloudfront_distribution.'+cloudfront_name+'.domain_name}'
  });

  return tfg
}

export default function handler(req: any, res: any) {
  const tfg = new TerraformGenerator({});

  const folder_name = 'tf_test_folder'
  const project_name = 'stratus'
  const bucket_name = "s3"
  const cloudfront_name = "cloudfront"

  tfg.provider('aws', {
    region: 'us-east-2'
  });

  var s3_tfg = s3generator(folder_name, project_name, bucket_name)
  var s3hosting_tfg = s3hosting(bucket_name)
  var cloudfront_tfg = cloudFrontHosting(bucket_name, cloudfront_name)

  tfg.merge(s3_tfg, s3hosting_tfg, cloudfront_tfg)

  const result = tfg.generate();
  res.status(200).json({ terraformConfig: result.tf });
}