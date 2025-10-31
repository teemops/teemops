#!/bin/bash
#usage ./build.sh <env>
#run from root of project
#example ./infra/docker/apps/api-core/build.sh dev
ENV=$1
IMAGE_NAME="teem/$ENV-api"
cd api
#Builds and releases image to ECR
docker build --no-cache -t $IMAGE_NAME:latest .
aws ecr get-login-password --region $(aws configure get region) | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$(aws configure get region).amazonaws.com

docker tag $IMAGE_NAME:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$(aws configure get region).amazonaws.com/$IMAGE_NAME:latest

# #push image $IMAGE_NAME
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$(aws configure get region).amazonaws.com/$IMAGE_NAME:latest
