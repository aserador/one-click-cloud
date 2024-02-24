import { TerraformGenerator, fn} from 'terraform-generator';

export default function handler(req: any, res: any) {
  const tfg = new TerraformGenerator({
  });

  const folder_name = 'tf_test_folder'

  tfg.provider('aws', {
    region: 'us-east-2'
  });

  tfg.resource('aws_s3_bucket', 's3', {
    bucket_prefix: 'my-tf-test-bucket'
  });

  tfg.resource('aws_s3_object', 'object', {
    for_each : fn('fileset', './' + folder_name, '**'),
    bucket: '${aws_s3_bucket.s3.bucket}',
    key: "${each.value}",
    source : './' + folder_name + '/${each.value}'
    })

  
  tfg.resource('aws_s3_bucket_website_configuration', 'hosting', {
    bucket: '${aws_s3_bucket.s3.bucket}',
    index_document: {
      suffix: 'index.html'
    }
  });

  tfg.resource('aws_s3_bucket_public_access_block', 'public_access_block', {
    bucket: '${aws_s3_bucket.s3.bucket}',
    block_public_acls: false,
    block_public_policy: false,
    ignore_public_acls: false,
    restrict_public_buckets: false
  });

  tfg.resource('aws_s3_bucket_policy', 'bucket_policy', {
    bucket: '${aws_s3_bucket.s3.bucket}',
    policy: JSON.stringify({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "PublicReadGetObject",
          "Effect" : "Allow",
          "Principal" : "*",
          "Action" : "s3:GetObject",
          "Resource" : "arn:aws:s3:::${aws_s3_bucket.s3.bucket}/*"
        }
      ]
    })
  });

  tfg.output('bucket_name', {
    value: '${aws_s3_bucket.s3.bucket}'
  });

  tfg.output('bucket_website_endpoint', {
    value: '${aws_s3_bucket_website_configuration.hosting.website_endpoint}'
  });

  const result = tfg.generate();
  res.status(200).json({ terraformConfig: result.tf });
}