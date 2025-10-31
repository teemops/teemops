provider "aws" {
  region = "us-east-1"
}

###-------------------------------------------------------------
##DEFINE IAM POLICIES FOR ECS TASK ROLE
###-------------------------------------------------------------
data "aws_iam_policy" "ecs_ssm_policy" {
  name = "AmazonSSMManagedInstanceCore"
}

data "aws_iam_policy" "ecs_s3_policy" {
  name = "AmazonS3FullAccess"
}

#create iam policy for CW Access
resource "aws_iam_policy" "ecs_cloudwatch_policy" {
  name        = "${var.stack_name}-ecs-cloudwatch-policy-main"
  description = "Allow ECS to send logs to CloudWatch"
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:*:*:*",
            "Effect": "Allow"
        }
    ]
}
EOF
}

###-------------------------------------------------------------
##DEFINE IAM ROLE FOR ECS TASKS
###-------------------------------------------------------------
resource "aws_iam_role" "ecs_role" {
  depends_on = [
    aws_iam_policy.ecs_cloudwatch_policy,
  ]
  name = "${var.stack_name}-ecs-iam-role"
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ecs-tasks.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": "AllowECSTaskAssumeRole"
        }
    ]
}
EOF
}

###-------------------------------------------------------------
##ATTACH IAM POLICIES TO ECS ROLE DEFINED ABOVE
###-------------------------------------------------------------
#attach custom iam policy variable to task IAM role
resource "aws_iam_policy_attachment" "ecs_policy_role_custom" {
  depends_on = [
    aws_iam_role.ecs_role,
  ]
  name       = "${var.stack_name}-ecs-attachment-custom"
  roles      = [aws_iam_role.ecs_role.name]
  policy_arn = var.custom_task_policy_arn
}

resource "aws_iam_policy_attachment" "ecs_policy_role_ssm" {
  depends_on = [
    aws_iam_role.ecs_role,
  ]
  name       = "${var.stack_name}-ecs-attachment-ssm"
  roles      = [aws_iam_role.ecs_role.name]
  policy_arn = data.aws_iam_policy.ecs_ssm_policy.arn
}

resource "aws_iam_policy_attachment" "ecs_policy_role_s3" {
  depends_on = [
    aws_iam_role.ecs_role,
  ]
  name       = "${var.stack_name}-ecs-attachment-s3"
  roles      = [aws_iam_role.ecs_role.name]
  policy_arn = data.aws_iam_policy.ecs_s3_policy.arn
}

#attach cloudwatch policy to ecs role
resource "aws_iam_policy_attachment" "ecs_policy_role_cloudwatch" {
  depends_on = [
    aws_iam_role.ecs_role,
  ]
  name       = "${var.stack_name}-ecs-attachment-cloudwatch"
  roles      = [aws_iam_role.ecs_role.name]
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy.arn
}

###-------------------------------------------------------------
##DEFINE IAM POLICIES FOR ECS TASK EXECUTION ROLE
###-------------------------------------------------------------
# create aws iam policy for ecs execution role
data "aws_iam_policy" "ecs_execution_iam_policy" {
  name = "AmazonECSTaskExecutionRolePolicy"
}

#create iam policy for sending logs to cloudwatch via ecs task definition
resource "aws_iam_policy" "ecs_execution_cloudwatch_policy" {
  name        = "${var.stack_name}-ecs-cloudwatch-policy"
  description = "Allow ECS to send logs to CloudWatch"
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:*:*:*",
            "Effect": "Allow"
        }
    ]
}
EOF
}

###-------------------------------------------------------------
##DEFINE IAM ROLE FOR ECS TASK EXECUTION
###-------------------------------------------------------------
resource "aws_iam_role" "ecs_execution_role" {
  depends_on = [
    aws_iam_policy.ecs_execution_cloudwatch_policy
  ]
  name = "${var.stack_name}-ecs-execution-iam-role"
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ecs-tasks.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": "AllowECSTaskExecutionAssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_policy_attachment" "ecs_execution_policy_role" {
  depends_on = [
    aws_iam_role.ecs_execution_role,
  ]
  name       = "${var.stack_name}-ecs-execution-attachment"
  roles      = [aws_iam_role.ecs_execution_role.name]
  policy_arn = data.aws_iam_policy.ecs_execution_iam_policy.arn
}

#attach cloudwatch policy to ecs execution role
resource "aws_iam_policy_attachment" "ecs_execution_policy_role_cloudwatch" {
  depends_on = [
    aws_iam_role.ecs_execution_role,
  ]
  name       = "${var.stack_name}-ecs-execution-attachment-cloudwatch"
  roles      = [aws_iam_role.ecs_execution_role.name]
  policy_arn = aws_iam_policy.ecs_execution_cloudwatch_policy.arn
}

#create iam policy attachment for accessing deployment s3 bucket
resource "aws_iam_policy_attachment" "ecs_execution_policy_role_s3" {
  depends_on = [
    aws_iam_role.ecs_execution_role,
  ]
  name       = "${var.stack_name}-ecs-execution-attachment-s3"
  roles      = [aws_iam_role.ecs_execution_role.name]
  policy_arn = data.aws_iam_policy.ecs_s3_policy.arn
}
