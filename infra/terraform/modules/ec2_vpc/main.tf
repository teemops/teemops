
# locals {
#   private_subnets=toset([for subnet in var.subnets : subnet.name if subnet.private == true])
#   public_subnets=toset([for subnet in var.subnets : subnet.name if subnet.private != true])
# }

locals {
  has_nat_count = var.has_nat ? 1 : 0
}

resource "aws_vpc" "my_vpc" {
  cidr_block = var.cidr_blocks
  tags = {
    Name = var.name
    Environment = var.env
  }
  #enable dns hostnames
  enable_dns_hostnames = true
  enable_dns_support = true
}

# Create an internet gateway
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "${var.env}-igw"
    Environment = var.env
  }
}



#create subnets
resource "aws_subnet" "my_vpc_subnets" {
  for_each = {for i, v in var.subnets: i=>v}
  vpc_id = aws_vpc.my_vpc.id
  cidr_block = each.value.cidr_blocks
  availability_zone = each.value.az
  tags = {
    Name = "${var.env}-${each.value.name}-subnet"
    Environment = var.env
    Private = each.value.private ? "true" : "false"
  }
}

#get data of subnets
data "aws_subnets" "my_private_subnets" {
  filter {
    name   = "tag:Private"
    values = ["true"]
  }
}

data "aws_subnets" "my_public_subnets" {
  filter {
    name   = "tag:Private"
    values = ["false"]
  }
}

data "aws_subnet" "my_public_subnet_ids" {
  for_each = toset(data.aws_subnets.my_public_subnets.ids)
  id       = each.value
}

#Create an EIP for NAT gateway
resource "aws_eip" "my_eip" {
  count=local.has_nat_count
  vpc = true
  tags = {
    Name = "${var.env}-natgateway-eip"
    Environment = var.env
  }
}

#Create a NAT gateway
resource "aws_nat_gateway" "my_nat" {
  depends_on = [
    aws_subnet.my_vpc_subnets
  ]
  count = local.has_nat_count
  allocation_id = aws_eip.my_eip[0].id
  subnet_id     = data.aws_subnets.my_public_subnets.ids[0]
  tags = {
    Name = "${var.env}-nat"
    Environment = var.env
  }
}


# Create a public route table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "${var.env}-public-rt"
    Environment = var.env
  }
}

#add a tag for default route table
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "${var.env}-private-rt"
    Environment = var.env
  }

}

#associate the private route table with the private subnets
resource "aws_route_table_association" "private_rt_association" {
  for_each = {for i, v in data.aws_subnets.my_private_subnets.ids: i=>v}
  #subnet_id = each.value
  subnet_id = each.value
  route_table_id = aws_route_table.private_rt.id
}

#associate the public route table with the public subnets
resource "aws_route_table_association" "public_rt_association" {
  for_each = {for i, v in data.aws_subnets.my_public_subnets.ids: i=>v}
  subnet_id = each.value
  route_table_id = aws_route_table.public_rt.id
}

# future routes for public route table
# resource "aws_route" "public_rt_ingress" {
#   for_each = {for s in data.aws_subnet.my_public_subnet_ids: s.cidr_block => s}
#   route_table_id = aws_route_table.public_rt.id
#   destination_cidr_block = each.value.cidr_block
#   gateway_id = aws_internet_gateway.my_igw.id
# }

#create egress route to internet gateway for public route table
resource "aws_route" "public_rt_egress" {
  route_table_id = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.my_igw.id
}

#create egress route to NAT gateway for private route table when NAT gateway is used
resource "aws_route" "private_rt_egress_nat" {
  count =  local.has_nat_count
  route_table_id = aws_route_table.private_rt.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id = var.has_nat ? aws_nat_gateway.my_nat[0].id : aws_internet_gateway.my_igw.id
}

#create egress route to IGW gateway for private route table when no NAT gateway is used
resource "aws_route" "private_rt_egress_igw" {
  count =  local.has_nat_count == 0 ? 1 : 0
  route_table_id = aws_route_table.private_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.my_igw.id
}

# Create security groups
resource "aws_security_group" "my_sgs" {
  for_each = {for i, v in var.security_groups: i=>v}
  name = "${var.env}-${each.value.name}-sg"
  description = each.value.description
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "${var.env}-${each.value.name}-sg"
    Environment = var.env
  }
}
