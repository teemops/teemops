output "rds_endpoint" {
  value = aws_db_instance.my_rds.endpoint
}
output "arn" {
  value=aws_db_instance.my_rds.arn
}

