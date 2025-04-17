#!/bin/bash

#Used to init docker container when running in ECS Environment.
#This script is used to create .env file with DATABASE_URL from environment variable.
#This is required by prisma to connect to database.

echo "DATABASE_URL=$DATABASE_URL" > .env