variable "region" {}
variable "stack_name" {}
variable "subnet_id" {}
variable "security_group" {}
variable "env" {}
variable "iam_profile" {}
variable "key_pair" {}
variable "kms_arn" {}
variable "is_public_ip" {
  type    = bool
  default = false
}
variable "instance_type" {
  type    = string
  default = "t3.micro"
}
variable "app_environment" {
  type    = string
  default = "baseline"
}
variable "user_data" {
  type    = string
  default = ""
}
#disable for tunneling and VPNs
variable "eni_source_dest_check" {
  type    = bool
  default = true
}

#AMI search pattern
variable "ami_search" {
  type = object({
    search_pattern      = string
    owners              = list(string)
    virtualization_type = string
  })
  default = {
    owners              = ["163057906376"]
    search_pattern      = "ops-teemops*"
    virtualization_type = "hvm"
  }
}
