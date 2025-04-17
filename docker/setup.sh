#!/bin/bash

ARGS=("$@")
DOCKER_FILE=${1:-docker-compose.yml}

# generate a random password which will be used for the database
NEW_MYSQL_ROOT_PASSWORD=$(openssl rand -base64 16)
#pass in the password to the docker compose file
MYSQL_ROOT_PASSWORD=$NEW_MYSQL_ROOT_PASSWORD docker compose -f $DOCKER_FILE up -d

#wait until docker is up
echo "Waiting for Docker to start..."
sleep 10
# can check on port 8080 that the docker containers are running
#connect via tcp to localhost:8080 using curl and if return OK then we are good
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users)
COUNTER=0
while [ "$STATUS_CODE" -ne 200 ]; do
    echo "Waiting for Docker containers to start..."
    sleep 5
    COUNTER=$((COUNTER + 1))
    if [ $COUNTER -gt 45 ]; then
        echo "Docker containers failed to start after 2 minutes"
        exit 1
    fi
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users)
done
# Check if the status code is exactly 200
if [ "$STATUS_CODE" -eq 200 ]; then
    echo "Docker containers are running"
else
    echo "There was an error starting the API on port 8080"
    echo "HTTP Status Code: $STATUS_CODE"
    echo "Please check the logs for more information"
    echo "docker-compose logs"
    exit 1
fi