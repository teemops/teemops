#get sqs id
data "aws_sqs_queue" "sqs_queue" {
  name = var.sqs_label
}

#create custom iam policy to attach to task role that can access SQS

resource "aws_iam_policy" "sqs_sns_policy" {
  name        = "${var.env}-${var.sqs_label}-sqs-access-policy"
  description = "SQS Access Policy to allow SNS topics to send messages to SQS"
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Action": [
              "SQS:SendMessage",
              "SQS:ReceiveMessage"
          ],
          "Resource": "arn:aws:sqs:${var.region}:${local.aws_caller_identity}:${var.sqs_label}",
          "Effect": "Allow"
      },
      {
          "Action": [
              "iam:PassRole"
          ],
          "Resource": "arn:aws:sqs:${var.region}:${local.aws_caller_identity}:${var.sqs_label}",
          "Effect": "Allow"
      }
    ]
}
EOF
}

resource "sqs_queue_policy" "sqs_policy" {
  queue_url = data.aws_sqs_queue.sqs_queue.id
  policy    = aws_iam_policy.sqs_sns_policy.policy
}

