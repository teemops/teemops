#!/bin/bash
#Used for developers to build the docker image and push to docker hub
# This script builds and pushes the Docker image for the TeemOps API.
# It assumes that the Dockerfile is located in the current api directory and that

# Navigate to the docker/stacks directory
THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
STACKS_DIR="$THIS_DIR/docker/stacks"
echo "Current directory: $THIS_DIR"
echo "Stacks directory: $STACKS_DIR"

if [ -d "$STACKS_DIR" ]; then

    # cd "$THIS_DIR/api"
    # # sh "$STACKS_DIR/api/build.sh"
    # sh "$STACKS_DIR/api/push.sh"

    cd "$THIS_DIR/topsless"
    # sh "$STACKS_DIR/topsless/build.sh"
    sh "$STACKS_DIR/topsless/push.sh"

    # cd "$THIS_DIR/ui"
    # # sh "$STACKS_DIR/ui/build.sh"
    # sh "$STACKS_DIR/ui/push.sh"

else
    echo "Directory $STACKS_DIR does not exist."
    exit 1
fi