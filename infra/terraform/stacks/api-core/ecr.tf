#create ecr private registry
resource "aws_ecr_repository" "ecr" {
  name = "${var.env}-${var.app_name}"
}
