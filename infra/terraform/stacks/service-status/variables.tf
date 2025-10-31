variable "env" {
  type    = string
  default = "dev"
}
variable "label" {
  type    = string
  default = "tops"
}
variable "app_name" {
  type    = string
  default = "status"
}
variable "vpc_label" {
  type    = string
  default = ""
}
variable "domain" {
  type    = string
  default = "teemops.com"
}
variable "region" {
  type    = string
  default = "us-west-2"
}
variable "region_name" {
  type    = string
  default = "oregon"
}
variable "app_environment" {
  type    = string
  default = "node16"
}
