#!/bin/bash

ENV=$1
#new Account setup
sh init.sh foundation newaccount $ENV
sh deploy.sh foundation newaccount $ENV

#VPC setup
# sh init.sh foundation vpc $ENV
# sh deploy.sh foundation vpc $ENV

#admin app
sh init.sh applications admin-app $ENV
sh deploy.sh applications admin-app $ENV