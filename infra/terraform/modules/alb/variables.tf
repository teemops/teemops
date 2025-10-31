variable "env" {}
variable "name" {}
variable "vpc_id" {}
variable "sg_name" {}
variable "hostname" {}
variable "domain" {}
variable "port" {
  type    = number
  default = 80
}
variable "health_check_path" {
  type    = string
  default = "/"
}
