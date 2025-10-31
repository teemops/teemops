
#create route53 public hosted zone
resource "aws_route53_zone" "my_zone" {
  name = var.domain
  tags = {
    Name = var.name
    Environment = var.env
  }
}