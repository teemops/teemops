# Configure the AWS Provider
provider "aws" {
  region = var.region
}

resource "aws_kms_key" "my_key" {
  description=var.name
  tags={
    Name=var.name
    Environment=var.env
  }
  policy = var.iam_policy
}

resource "aws_kms_alias" "key_alias" {
  name = "alias/${var.name}"
  target_key_id = aws_kms_key.my_key.id
}
