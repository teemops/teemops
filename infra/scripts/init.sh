#!/bin/bash
#takes 3 arguments
#1. The section to use e.g. foundation
#2. name of terraform directory e.g. "rootaccount"
#3. env name e.g. "dev" or "root"
echo $1 $2 $3
SECTION=$1
TERRAFORM_NAME=$2
ENV=$3

#If env is not prod use a different bucket
if [ $ENV != "prod" ]; then
  export TF_VAR_tfstate_bucket="shared-teemops-tf-$ENV"
else
  export TF_VAR_tfstate_bucket="shared-teemops-terraform-state"
fi
echo "BUCKET FOR STATE: $TF_VAR_tfstate_bucket"
#set the terraform directory
cd ../terraform/$SECTION/$TERRAFORM_NAME
pwd
ls -la
terraform workspace new $ENV
terraform init --migrate-state -var-file=../../env/$ENV.tfvars #-backend-config="bucket=$TF_VAR_tfstate_bucket"
