#generate a random password
resource "random_password" "db_password" {
  length = 16
  special = false
}

#create an ssm parameter for admin password
resource "aws_ssm_parameter" "my_ssm_password" {
  name = "/ops/rds/${var.env}/${var.name}/admin_password"
  type = "SecureString"
  value = random_password.db_password.result
  overwrite = true
  tags = {
    Name = var.name
    Environment = var.env
  }
}

#filter subnets by tag
data "aws_subnets" "my_subnets"{
  filter {
    name="tag:Private"
    values=[var.is_public ? "false" : "true"]
  }
}

#get the security group id for the rds instance
data "aws_security_group" "my_rds_sg" {
  filter {
    name   = "tag:Name"
    values = [var.sg_name]
  }
}

#create an rds db subnet group
resource "aws_db_subnet_group" "my_rds_subnet_group" {
  name        = "${var.env}-${var.name}-subnet-group"
  description = "Subnet group for ${var.name} in ${var.env}"
  subnet_ids  = data.aws_subnets.my_subnets.ids
  tags = {
    Name = "${var.env}-${var.name}-subnet-group"
    Environment = var.env
  }
}

#create a postgresql rds database
resource "aws_db_instance" "my_rds" {
  allocated_storage = var.storage
  storage_type = "gp2"
  #kms_key_id = var.kms_arn
  storage_encrypted = true
  engine = var.engine
  engine_version = var.engine_version
  instance_class = var.instance_type
  db_name = var.name
  identifier = "${var.env}-${var.name}-rds"
  username  = var.username
  password  = aws_ssm_parameter.my_ssm_password.value
  port = "5432"
  vpc_security_group_ids = [data.aws_security_group.my_rds_sg.id]
  db_subnet_group_name = aws_db_subnet_group.my_rds_subnet_group.name
  #parameter_group_name = aws_db_parameter_group.my_rds_parameter_group.name
  publicly_accessible = var.is_public
  skip_final_snapshot = true
  tags = {
    Name = "${var.env}-${var.name}-rds"
    Environment = var.env
  }
}