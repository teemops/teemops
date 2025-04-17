#!/bin/bash

# This script is executed when the Docker container starts.
# It initializes the database and runs any necessary migrations.

# Run Prisma commands on first container run
if [ ! -f "/state/.prisma-initialized" ]; then

    #loop until the database is ready
    echo "Waiting for MySQL to be ready..."
    sleep 10
    echo "MySQL is ready. Starting Prisma setup..."

    echo "Running Prisma migrations..."
    npx prisma migrate deploy

    echo "Generating Prisma client..."
    npx prisma generate

    echo "Seeding database..."
    npx prisma db seed

    # Mark as initialized
    touch /state/.prisma-initialized
fi

# Execute the container's main CMD
exec "$@"