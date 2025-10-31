#!/bin/bash
#This is to be run from root of the project
#e.g. sh ./infra/utils/deploy/deploy.sh dev
ENV=$1
#zip up api folder and store zip file in this dir
zip -r .topsbuild/api.zip api -x "api/mysql/*"  "api/node_modules/*" "api/.env" "api/.env.*" "api/.git/*" "api/.gitignore"
#copy zip file to s3
aws s3 cp .topsbuild/api.zip s3://$ENV-tops-deploy/.topsbuild/api.zip

ssh topsprod "sudo sh /srv/scripts/update.sh $ENV"

