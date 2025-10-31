variable "sg_id" {}
variable "type" {
  type = string
  default = "ingress" #egress
}
#rules for cidr blocks
variable "cidr_rules" {
  type = list(object({
    from_port = number
    to_port   = number
    protocol  = string
    cidr_block=string
  }))
  default=[]
}
#rules from security group to security group
variable sg_rules {
  type = list(object({
    from_port = number
    to_port   = number
    protocol  = string
    security_group=string
  }))
  default=[]
}
