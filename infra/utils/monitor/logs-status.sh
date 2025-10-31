#!/bin/bash
#sh ./infra/utils/monitor/logs-status.sh 
ssh topsprod "sudo tail -fn 100 /var/log/tops-status.out.log"
