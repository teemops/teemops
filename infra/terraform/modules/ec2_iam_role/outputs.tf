output "my_role_arn" {
  value = aws_iam_role.ec2_role.arn
}
output "my_profile_arn" {
  value = aws_iam_instance_profile.ec2_iam_profile.arn
}

output "my_profile_name" {
  value = aws_iam_instance_profile.ec2_iam_profile.name
}
