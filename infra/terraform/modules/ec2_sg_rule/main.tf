
#create security group rules for cidr blocks
resource "aws_security_group_rule" "ec2_sg_rule_sg" {
  for_each = {for i, v in var.cidr_rules:i=>v}
  security_group_id = var.sg_id
  type              = var.type
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  protocol          = each.value.protocol
  cidr_blocks = [each.value.cidr_block]
}
#create security group rules for security groups
resource "aws_security_group_rule" "ec2_sg_rule_groups_sg" {
  for_each = {for i, v in var.sg_rules:i=>v}
  security_group_id = var.sg_id
  type              = var.type
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  protocol          = each.value.protocol
  source_security_group_id = each.value.security_group
}
