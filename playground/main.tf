terraform {
}

provider "aws"{
region = "us-east-2"
}

resource "aws_s3_bucket" "s3"{
bucket_prefix = "my-tf-test-bucket"
}

resource "aws_s3_object" "object"{
for_each = fileset("./tf_test_folder", "**")
bucket = "${aws_s3_bucket.s3.bucket}"
key = "${each.value}"
source = "./tf_test_folder/${each.value}"
}

resource "aws_s3_bucket_website_configuration" "hosting"{
bucket = "${aws_s3_bucket.s3.bucket}"
index_document {
suffix = "index.html"
}
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = "${aws_s3_bucket.s3.bucket}"

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket_policy"{
bucket = "${aws_s3_bucket.s3.bucket}"
policy = jsonencode(
    {
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
    }
  )
}

output "bucket_name"{
value = "${aws_s3_bucket.s3.bucket}"
}

output "bucket_website_endpoint"{
value = "${aws_s3_bucket_website_configuration.hosting.website_endpoint}"
}
