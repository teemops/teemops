
data "aws_ami" "ubuntu" {

  most_recent = true

  filter {
    name   = "name"
    values = [var.ami_search.search_pattern]
  }

  filter {
    name   = "virtualization-type"
    values = [var.ami_search.virtualization_type]
  }

  owners = var.ami_search.owners
}

output "test" {
  value = data.aws_ami.ubuntu
}

resource "aws_instance" "ec2_node" {
  ami           = data.aws_ami.ubuntu.image_id
  instance_type = var.instance_type
  key_name      = var.key_pair

  tags = {
    Name = var.stack_name
  }
  root_block_device {
    volume_size = 100
    kms_key_id = var.kms_arn
    encrypted = true
  }
  #make eni source dest check false
  source_dest_check = false

  subnet_id            = var.subnet_id
  security_groups      = [var.security_group]
  iam_instance_profile = var.iam_profile
  user_data            = <<EOF
#!/bin/bash -xe
sleep 5
${var.user_data}
EOF

}

#assign public ip if needed
resource "aws_eip" "ec2_eip" {
  instance = aws_instance.ec2_node.id
  vpc      = true
  count    = var.is_public_ip ? 1 : 0
}