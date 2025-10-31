#!/bin/bash
#Generate the require KMS Keys for all accounts
#This needs to be run in the root account so we can STS across to other accounts
SECTION=foundation
TERRAFORM_NAME=kms
declare -a ENVS=("prod" "dev")
declare -a KEY_LABELS=("main")

#set the terraform directory
cd ../terraform/$SECTION/$TERRAFORM_NAME
ls -la
terraform init
for ENV in "${ENVS[@]}"
do
    echo "Generating KMS Keys for $ENV"
    
    for LABEL in "${KEY_LABELS[@]}"
    do
        echo "Generating KMS Key for $LABEL"
        terraform apply -var-file=../../env/kms/$ENV.tfvars -var="key_label=$LABEL" -auto-approve
    done
done
