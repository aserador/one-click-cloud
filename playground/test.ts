import { TerraformGenerator, Resource, map, fn } from 'terraform-generator';

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

// Generate Terraform configuration as string
const result = tfg.generate();
console.log(result.tf);