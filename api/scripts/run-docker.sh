#!/bin/bash

docker run -it --env-file .env -p 8080:8080 -v $HOME/.aws:/root/.aws:ro docker.io/library/tops-api
#get docker container id
docker ps -a | grep tops-api | awk '{print $1}' | xargs -I {} docker exec -it {} bash

