#create custom iam policy to attach to task role that can access SQS
resource "aws_iam_policy" "ec2_task_custom_policy" {
  name        = "${var.env}-${var.label}-${var.app_name}-ec2-task-custom-policy"
  description = "Allow EC2 Task to access SQS and other resources on behalf of teemops"
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Action": [
              "sns:*",
              "cloudformation:*",
              "sqs:*",
              "dynamoDb:*",
              "s3:*",
              "events:*",
              "cloudwatch:*",
              "ec2:*",
              "rds:*",
              "ssm:*",
              "kms:*",
              "pricing:*"
          ],
          "Resource": "*",
          "Effect": "Allow"
      },
      {
          "Action": [
              "iam:PassRole"
          ],
          "Resource": "arn:aws:iam::*:role/*",
          "Effect": "Allow"
      }
    ]
}
EOF
}

#ec2 role

module "ec2_iam_role" {
  source                 = "../../modules/ec2_iam_role"
  stack_name             = "${var.env}-${var.label}-${var.app_name}"
  custom_task_policy_arn = aws_iam_policy.ec2_task_custom_policy.arn
}


