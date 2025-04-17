#!/bin/bash

# Variables
IMAGE_NAME="teem/tops-api"
TAG="dev"

# Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME:$TAG .

# # Push the Docker image to Docker Hub
# echo "Pushing Docker image to Docker Hub..."
# docker push $IMAGE_NAME:$TAG

# echo "Docker image $IMAGE_NAME:$TAG pushed successfully."