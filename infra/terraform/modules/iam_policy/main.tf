# Configure the AWS Provider
# provider "aws" {
#   region = var.region
# }

resource "aws_iam_policy" "mypolicy"{
  name        = var.name
  path        = var.path
  description = var.description

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = var.policy_rules
  
  tags={
    Name=var.name
    Environment=var.env
  }
  
}
