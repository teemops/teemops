terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    sqs = {
      source  = "hashicorp/sqs"
      version = "3.0.0"

    }
  }
  backend "s3" {
    bucket  = "shared-teemops-terraform-state"
    key     = "stacks/sqs_policy/tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.region
  default_tags {
    tags = {
      "Environment" = var.env
    }
  }
}
#get caller identity
data "aws_caller_identity" "current" {}

locals {
  #get caller identity
  aws_caller_identity = data.aws_caller_identity.current.account_id

}
