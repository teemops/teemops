#!/bin/bash
export $(xargs <.env)
echo $MYSQL_DB
sls offline --stage dev