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
  default = "node16"
}
variable "task_definition" {
  type    = string
  default = ""
}
variable "vpc_id" {}
variable "sg_name" {}
