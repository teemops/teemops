#filter vpcs by tag
data "aws_vpc" "main_vpc" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }
}

#filter public subnets by tag
data "aws_subnets" "my_subnets_public" {
  filter {
    name   = "tag:Private"
    values = ["false"]
  }
}

locals {
  public_subnets = data.aws_subnets.my_subnets_public.ids
}

#get the security group id for the ALB
data "aws_security_group" "my_alb_sg" {
  filter {
    name   = "tag:Name"
    values = [var.sg_name]
  }
}

#get SSL Certificate ARN
data "aws_acm_certificate" "my_cert" {
  domain   = var.hostname
  statuses = ["ISSUED"]
}

#create alb
resource "aws_lb" "my_alb" {
  name               = "${var.env}-${var.name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [data.aws_security_group.my_alb_sg.id]
  subnets            = [for subnet in data.aws_subnets.my_subnets_public.ids : subnet]
  tags = {
    Name        = "${var.env}-${var.name}-alb"
    Environment = var.env
  }
}

#create alb target group
resource "aws_lb_target_group" "my_alb_target_group" {
  name        = "${var.env}-${var.name}-alb-target-group"
  port        = var.port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = var.health_check_path
  }
}

#create alb listener port 80
resource "aws_lb_listener" "my_alb_listener" {
  load_balancer_arn = aws_lb.my_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.my_alb_target_group.arn
    type             = "forward"
  }
}

#create alb listener port 443
resource "aws_lb_listener" "my_alb_listener_https" {
  load_balancer_arn = aws_lb.my_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.my_cert.arn

  default_action {
    target_group_arn = aws_lb_target_group.my_alb_target_group.arn
    type             = "forward"
  }
}

#create route53 record for ALB
module "route53_alias" {
  source       = "../route53_alias"
  domain       = var.domain
  record_name  = var.hostname
  record_value = aws_lb.my_alb.dns_name
  alias_zoneid = aws_lb.my_alb.zone_id
}


