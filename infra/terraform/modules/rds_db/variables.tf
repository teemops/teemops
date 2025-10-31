variable "name" {}
variable "env" {}
variable "storage" {}
variable "kms_arn" {
  type = string
  default = ""
}
variable "instance_type" {}
variable "engine" {
  type    = string
  default = "mysql"
}
variable "engine_version" {
  type    = string
  default = "8.0.23"
}
variable "username" {}
variable "subnet_tags" {
  type = map(string)

  default = {
    name  = "Private"
    value = "true"
  }
}
variable "sg_name" {}
variable "is_public" {
  type    = bool
  default = false
}
