variable "env" {}
variable "name" {}
variable "iam_profile" {}
variable "iam_profile_name" {}
variable "app_environment" {
  type    = string
  default = "php8"
}
variable "instance_type" {
  type    = string
  default = "t2.micro"
}
variable "vpc_id" {}
variable "sg_name" {}
variable "alb_sg_name" {}
variable "desired_capacity" {}
variable "max_size" {}
variable "min_size" {}
variable "hostname" {}
variable "domain" {}
variable "has_alb" {
  type    = bool
  default = true
} #Has Application Load Balancer
