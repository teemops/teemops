variable "name" {}
variable "env" {}
variable "cidr_blocks" {}
variable "subnets" {}
variable "security_groups" {}
variable "has_nat"  {
  type = bool
  default = false
}