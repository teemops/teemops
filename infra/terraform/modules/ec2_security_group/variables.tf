variable "name" {}
variable "env" {}
variable "vpc_id" {}
variable "inbound_cidr_rules" {
  type = list(object({
    from_port = number
    to_port   = number
    protocol  = string
    cidr_block=string
  }))
  default=[]
}
variable inbound_sg_rules {
  type = map(object({
    from_port = number
    to_port   = number
    protocol  = string
    security_group=string
  }))
  default = { }
}
