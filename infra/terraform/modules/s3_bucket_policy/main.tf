# Configure the AWS Provider

resource "aws_s3_bucket_policy" "bucket_policy"{
  bucket=var.bucket_name
  policy = var.policy_rules
}
