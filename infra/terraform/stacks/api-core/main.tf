terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket  = "shared-teemops-terraform-state"
    key     = "stacks/api-core/tfstate"
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
#get caller identity
data "aws_caller_identity" "current" {}

locals {
  #get caller identity
  aws_caller_identity = data.aws_caller_identity.current.account_id
  task_definition = templatefile("./templates/task_definition.json.tpl", {
    container_name    = var.app_name,
    region            = var.region,
    account_id        = local.aws_caller_identity,
    deployment_bucket = "${var.env}-${var.label}-deploy",
    image_name        = "${var.env}-${var.app_name}",
  })
}

module "ecs_app" {
  depends_on         = [module.alb, module.ec2_security_group]
  source             = "../../modules/ecs_app"
  env                = var.env
  name               = "${var.label}-${var.app_name}"
  execution_iam_role = module.ecs_iam_role.execution_role_arn
  task_iam_role      = module.ecs_iam_role.task_role_arn
  app_environment    = var.app_environment
  task_definition    = local.task_definition
  vpc_id             = data.aws_vpc.main_vpc.id
  sg_name            = "${var.env}-Backend-sg"
  # alb_sg_name        = "${var.env}-Frontend-sg"
  hostname         = "${var.app_name}.${var.domain}"
  domain           = var.domain
  has_alb          = true
  cluster_name     = "${var.env}-${var.label}"
  target_group_arn = module.alb.target_group_arn
  port             = 8080
  container_name   = var.app_name
}
