#!/bin/bash
ENV=${1:-dev}
aws ecs update-service --cluster $ENV-tops-cluster --enable-execute-command --service $ENV-tops-status-ecs-service --force-new-deployment