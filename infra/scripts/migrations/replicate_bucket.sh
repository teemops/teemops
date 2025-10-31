#!/bin/bash
# Example:

echo $1 $2 $3 $4
SOURCE_ACCOUNT=$1
DEST_ACCOUNT=$2
SOURCE_BUCKET_NAME=$3
DEST_BUCKET_NAME=$4
CURRENT_DIR=$(pwd)

#SOURCE
#set the terraform directory
#get bucket arn from aws s3 cli
export AWS_PROFILE=$SOURCE_ACCOUNT
export SOURCE_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
cd $CURRENT_DIR/terraform/migrations/s3-replicate-source
terraform workspace select prod
terraform apply -var-file=../../env/migrations/s3.tfvars  -var="source_bucket_name=$SOURCE_BUCKET_NAME" -var "dest_bucket_arn=arn:aws:s3:::$DEST_BUCKET_NAME"  -auto-approve

#DESTINATION
#now switch account to install the replication S3 policy on destination side
export AWS_PROFILE=$DEST_ACCOUNT
cd $CURRENT_DIR/terraform/migrations/s3-replicate-dest
terraform workspace select prod
terraform apply -var-file=../../env/migrations/s3.tfvars  -var="dest_bucket_name=$DEST_BUCKET_NAME" -var="source_account_id=$SOURCE_ACCOUNT_ID" -auto-approve
#TBD: add a check to see if the apply was successful