#Deploys an Autoscaling Group with a Launch Configuration
data "aws_ami" "ubuntu" {

  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}



output "test" {
  value = data.aws_ami.ubuntu
}

#filter subnets by tag
data "aws_subnets" "my_subnets" {
  filter {
    name   = "tag:Private"
    values = ["true"]
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
  public_subnets  = data.aws_subnets.my_subnets_public.ids
  private_subnets = data.aws_subnets.my_subnets.ids
}

#get the security group id for the asg
data "aws_security_group" "my_asg_sg" {
  filter {
    name   = "tag:Name"
    values = [var.sg_name]
  }
}

#get the security group id for the ALB
data "aws_security_group" "my_alb_sg" {
  filter {
    name   = "tag:Name"
    values = [var.alb_sg_name]
  }
}

#get SSL Certificate ARN
data "aws_acm_certificate" "my_cert" {
  domain   = var.domain
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
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"
  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/"
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


#create autoscaling launch template
resource "aws_launch_template" "my_asg_launch_template" {
  name_prefix   = "${var.env}-${var.name}-asg-launch-template"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  #key_name      = var.key_name
  vpc_security_group_ids = [data.aws_security_group.my_asg_sg.id]

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = 100
      volume_type           = "gp2"
      delete_on_termination = true
      # encrypted = true
      # kms_key_id=var.kms_arn
    }
  }

  iam_instance_profile {

    arn = var.iam_profile
  }

  monitoring {
    enabled = true
  }
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "${var.env}-${var.name}-asg"
      Environment = var.env
    }
  }
  user_data = base64encode(<<EOF
#!/bin/bash -xe
export TOPS_DEPLOY_ENV=${var.app_environment} && sh <(curl -s https://s3.amazonaws.com/files.teemops.com/teemdeploy.sh)
EOF
  )
}

#create autoscaling group
resource "aws_autoscaling_group" "my_asg" {
  name             = "${var.env}-${var.name}-asg"
  desired_capacity = var.desired_capacity
  max_size         = var.max_size
  min_size         = var.min_size
  #use latest launch template
  launch_template {
    id      = aws_launch_template.my_asg_launch_template.id
    version = "$Latest"
  }
  vpc_zone_identifier       = [for subnet in data.aws_subnets.my_subnets_public.ids : subnet]
  target_group_arns         = [aws_lb_target_group.my_alb_target_group.arn]
  health_check_type         = "ELB"
  health_check_grace_period = 300
  tags = [
    {
      key                 = "Name"
      value               = var.name
      propagate_at_launch = true
    },
    {
      key                 = "Environment"
      value               = var.app_environment
      propagate_at_launch = true
    }
  ]
}
