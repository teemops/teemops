#create emmpty security group
resource "aws_security_group" "ec2_sg_main" {
  name   = var.name
  vpc_id = var.vpc_id
  tags = {
    Name        = var.name
    Environment = var.env
  }
}

#security group rule to self
resource "aws_security_group_rule" "ec2_sg_rule_self" {
  security_group_id = aws_security_group.ec2_sg_main.id
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  self              = true
}

#create outbound security group rules
resource "aws_security_group_rule" "ec2_sg_rule_outbound" {
  security_group_id = aws_security_group.ec2_sg_main.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}
#create outbound IPV6 security group rules
resource "aws_security_group_rule" "ec2_sg_rule_outbound_ipv6" {
  security_group_id = aws_security_group.ec2_sg_main.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  ipv6_cidr_blocks  = ["::/0"]
}

#loop through inbound cidr rules
resource "aws_security_group_rule" "ec2_sg_rule_cidr" {
  for_each          = { for i, v in var.inbound_cidr_rules : i => v }
  security_group_id = aws_security_group.ec2_sg_main.id
  type              = "ingress"
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  protocol          = each.value.protocol
  cidr_blocks       = [each.value.cidr_block]
}

