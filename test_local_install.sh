#!/bin/bash

CURRENT_DIR=$(pwd)

# Create a temporary directory
TEMP_DIR=$(mktemp -d /tmp/teemops.XXXXXX)

# Copy the teemops folder to the temporary directory
cp -r "$CURRENT_DIR" "$TEMP_DIR"

# Change to the copied directory
cd "$TEMP_DIR/teemops" || exit 1

# Run the install.sh script
if [ -f "install.sh" ]; then
    bash install.sh
else
    echo "install.sh not found in $TEMP_DIR/teemops"
    exit 1
fi