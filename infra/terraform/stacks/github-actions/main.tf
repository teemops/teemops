#launch github access using IAM role and CFN template

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.region

}

data "aws_caller_identity" "current" {}

locals {
  account_id     = data.aws_caller_identity.current.account_id
  gh_actions_cfn = file("../../../cloudformation/deploy/github-actions-role-ecs.yaml")
}

# launch cloudformation stack module
module "cfn" {
  source   = "../../modules/cfn"
  env      = var.env
  name     = "${var.label}-github-actions"
  template = local.gh_actions_cfn
  parameters = {
    "GitHubOrganization"  = var.gh_org
    "RepositoryName"      = "*"
    "RoleName"            = "${var.env}-tops-actions"
    "UseExistingProvider" = "no"
  }
}
