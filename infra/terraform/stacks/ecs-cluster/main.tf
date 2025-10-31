terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket  = "shared-teemops-terraform-state"
    key     = "stacks/ecs-cluster/tfstate"
    region  = "us-east-1"
    encrypt = true
  }

}

# Configure the AWS Provider
provider "aws" {
  region = var.region
  default_tags {
    tags = {
      "App"         = var.label,
      "Domain"      = var.domain,
      "Environment" = var.env
    }
  }
}

#create ecs cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.env}-${var.label}-cluster"
  tags = {
    "Name" = "${var.env}-${var.label}-cluster"
  }
}

