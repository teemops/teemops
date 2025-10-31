output "my_ec2_instance_id" {
  value = aws_instance.ec2_node.host_id
}

output "my_ec2_dns_name" {
  value = aws_instance.ec2_node.private_dns
}

output "id" {
  value = aws_instance.ec2_node.id
}
