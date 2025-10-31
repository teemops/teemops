variable "env" {}
variable "name" {}
variable "cluster_name" {}
variable "execution_iam_role" {
  type    = string
  default = ""
}
variable "task_iam_role" {
  type    = string
  default = ""
}
variable "app_environment" {
  type    = string
  default = "php8"
}
variable "task_definition" {
  type    = string
  default = ""
}
variable "vpc_id" {}
variable "sg_name" {}
variable "hostname" {}
variable "domain" {}
variable "has_alb" {
  type    = bool
  default = true
} #Has Application Load Balancer
variable "port" {
  type    = number
  default = 80
}
variable "container_name" {
  type    = string
  default = "nginx"
}
variable "target_group_arn" {
  type    = string
  default = ""
}
