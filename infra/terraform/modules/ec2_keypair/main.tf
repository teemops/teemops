#create tls private key
resource "tls_private_key" "my_key"{
  algorithm = "RSA"
  rsa_bits  = 4096
}

#create an ssm parameter for private key
resource "aws_ssm_parameter" "my_ssm_password" {
  name = "/ops/keys/${var.env}/${var.name}/key"
  type = "SecureString"
  value = tls_private_key.my_key.private_key_pem
  overwrite = true
  tags = {
    Name = var.name
    Environment = var.env
  }
}

#create ec2 keypair
resource "aws_key_pair" "ec2_keypair" {
  key_name   = "${var.env}-${var.name}-key"
  public_key = tls_private_key.my_key.public_key_openssh
}