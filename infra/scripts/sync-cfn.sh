#!/bin/bash
# Sync the CloudFormation templates folder with the S3 bucket
# Usage: sync-cfn.sh <env>

# sync to S3
aws s3 sync cloudformation/ s3://$1-deployment/templates/cloudformation/ --exclude "scripts/vbox/node_modules/*"