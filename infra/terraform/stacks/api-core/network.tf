data "aws_vpc" "main_vpc" {
  filter {
    name   = "tag:Name"
    values = ["vpc-dev"]
  }
}

#get Database security group
data "aws_security_group" "rds_sg" {
  filter {
    name   = "tag:Name"
    values = ["${var.env}-Database-sg"]
  }
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main_vpc.id]
  }
}

module "ec2_security_group" {
  source = "../../modules/ec2_security_group"
  name   = "${var.env}-${var.label}-${var.app_name}-sg"
  env    = var.env
  vpc_id = data.aws_vpc.main_vpc.id
}

#allow access from above security group to RDS security group
resource "aws_security_group_rule" "rds_sg_rule_ecs" {
  security_group_id        = data.aws_security_group.rds_sg.id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = module.ec2_security_group.my_sg_id
}

#allow access to security group from rds
resource "aws_security_group_rule" "rds_sg_rule_ecs2" {
  security_group_id        = module.ec2_security_group.my_sg_id
  type                     = "ingress"
  from_port                = "0"
  to_port                  = "65535"
  protocol                 = "-1"
  source_security_group_id = data.aws_security_group.rds_sg.id
}

#allow outbound access to all for IPV6
# resource "aws_security_group_rule" "rds_sg_rule_ecs_outbound_ipv6" {
#   security_group_id = data.aws_security_group.rds_sg.id
#   type              = "egress"
#   from_port         = 0
#   to_port           = 0
#   protocol          = "-1"
#   ipv6_cidr_blocks  = ["::/0"]
# }
