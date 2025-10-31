#!/bin/bash
#example ./infra/docker/apps/api-core/redeploy.sh dev
ENV=${1:-dev}
aws ecs update-service --cluster $ENV-tops-cluster --enable-execute-command --service $ENV-tops-api-ecs-service --force-new-deployment