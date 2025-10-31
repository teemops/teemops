#!/bin/bash
#takes 3 arguments
#1. The section to use e.g. foundation
#2. name of terraform directory e.g. "rootaccount"
#3. env name e.g. "dev" or "root"
echo $1 $2 $3
SECTION=$1
TERRAFORM_NAME=$2
ENV=$3

#set the terraform directory
cd ../terraform/$SECTION/$TERRAFORM_NAME
terraform workspace select $ENV  
ls -la
terraform destroy -var-file=../../env/$ENV.tfvars
