#!/bin/bash
ENV=$1
# aws s3 cp sync/$ENV.env s3://$ENV-tops-deploy/status/app.env 
aws s3 cp sync/$ENV.env s3://$ENV-tops-deploy/api/app.env 
# aws s3 cp sync/database.$ENV.json s3://$ENV-tops-deploy/api/database.json
# aws s3 cp sync/config.$ENV.json s3://$ENV-tops-deploy/api/config.json

