#!/bin/bash
# ./infra/docker/apps/api-core/connect-ecs.sh dev
aws ecs execute-command --cluster dev-tops-cluster --task $(aws ecs list-tasks --cluster "dev-tops-cluster" --service-name "dev-tops-api-ecs-service" | jq -r '."taskArns" | .[]' | sed 's:.*/::') --container api --interactive --command "/bin/sh"