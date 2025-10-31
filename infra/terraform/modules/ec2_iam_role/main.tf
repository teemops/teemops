provider "aws" {
  region = "us-east-1"
}

data "aws_iam_policy" "ec2_ssm_policy" {
  name = "AmazonSSMManagedInstanceCore"
}

data "aws_iam_policy" "ec2_s3_policy" {
  name = "AmazonS3FullAccess"
}

resource "aws_iam_role" "ec2_role" {
  name = "${var.stack_name}-iam-role"
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource "aws_iam_policy_attachment" "ec2_policy_role_ssm" {
  name       = "${var.stack_name}-ec2-attachment-ssm"
  roles      = [aws_iam_role.ec2_role.name]
  policy_arn = data.aws_iam_policy.ec2_ssm_policy.arn
}

resource "aws_iam_policy_attachment" "ec2_policy_role_s3" {
  name       = "${var.stack_name}-ec2-attachment-s3"
  roles      = [aws_iam_role.ec2_role.name]
  policy_arn = data.aws_iam_policy.ec2_s3_policy.arn
}

resource "aws_iam_instance_profile" "ec2_iam_profile" {
  name = "${var.stack_name}-iam-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_iam_policy_attachment" "ec2_policy_role_custom" {
  depends_on = [
    aws_iam_role.ec2_role,
  ]
  name       = "${var.stack_name}-ec2-attachment-custom"
  roles      = [aws_iam_role.ec2_role.name]
  policy_arn = var.custom_task_policy_arn
}
