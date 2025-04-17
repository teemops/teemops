#!/bin/bash
# can check on port 8080 that the docker containers are running
#connect via tcp to localhost:8080 using curl and if return OK then we are good
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users)
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