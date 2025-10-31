#!/bin/bash
#sh ./infra/utils/monitor/logs.sh 
ssh topsprod "sudo tail -fn 100 /var/log/tops-*.err*log"
