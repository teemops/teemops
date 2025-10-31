

#create an Amazon Elastic Container Registry repository for containers
resource "aws_ecr_repository" "my_ecr" {
  name = "${var.repo_name}-ecr"
    #set private
    image_tag_mutability = "MUTABLE"
  tags = {
    Name = "${var.repo_name}-ecr"
    Environment = var.env
  }
}

#add a private policy to the repository
resource "aws_ecr_repository_policy" "my_ecr_policy" {
  repository = aws_ecr_repository.my_ecr.name
  policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPushPull",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::${var.account_id}:root"
            },
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload"
            ]
        }
    ]
}
EOF
}
