import { TerraformGenerator } from 'terraform-generator';

export default function handler(req: any, res: any) {
  const tfg = new TerraformGenerator({
    required_version: '>= 0.12'
  });

  tfg.provider('aws', {
    region: 'us-east-2',
    profile: 'example'
  });

  tfg.resource('aws_s3_bucket', 's3', {
    bucket: 'my-tf-test-bucket-asgjagjsagsjagkajsq'
  });

  const result = tfg.generate();
  res.status(200).json({ terraformConfig: result.tf });
}