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
ls -la
terraform workspace select $ENV  

#get the region from dev.tfvar file
MAIN_REGION=$(grep region ../../env/$ENV.tfvars | cut -d'=' -f2 | tr -d ' ' | tr -d '"')

#get the kms key arn of the root account query by alias
# ROOT_KMS_KEY_ARN=$(aws kms list-keys --query "Keys[?KeyId=='$(aws kms list-aliases --query "Aliases[?AliasName=='alias/shared-kms'].TargetKeyId" --output text --region $MAIN_REGION --profile billing-admin)'].KeyArn" --output text --region $MAIN_REGION --profile billing-admin)
echo $MAIN_REGION
terraform plan -var-file=../../env/$ENV.tfvars 
#-var="kms_arn=$ROOT_KMS_KEY_ARN"
#TBD: add a check to see if the apply was successful