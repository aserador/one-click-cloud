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
    value: '${aws_s3_bucket_website_configuration.' + bucket_name + '.website_endpoint}'
  });

  return tfg
}

export default function handler(req: any, res: any) {
  const tfg = new TerraformGenerator({});

  const folder_name = 'tf_test_folder'
  const project_name = 'stratus'
  const bucket_name = "s3"

  tfg.provider('aws', {
    region: 'us-east-2'
  });

  var s3_tfg = s3generator(folder_name, project_name, bucket_name)
  var s3hosting_tfg = s3hosting(bucket_name)

  tfg.merge(s3_tfg, s3hosting_tfg)

  const result = tfg.generate();
  res.status(200).json({ terraformConfig: result.tf });
}