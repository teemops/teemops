#!/bin/bash
#This is to be run from root of the project
#e.g. sh ./infra/utils/connect/ssh-proxy.sh

# get ec2 ip address for the given instance with instance name "ssh-proxy"
# and use it as a proxy to connect to other instances in the same vpc
EC2_INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=ssh-proxy" --query "Reservations[*].Instances[*].InstanceId" --output text)
IP_ADDRESS=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=ssh-proxy" --query "Reservations[*].Instances[*].PublicIpAddress" --output text)

echo $IP_ADDRESS
#GET my Public IP
MY_PUBLIC_IP=$(curl -s https://checkip.amazonaws.com)
echo $MY_PUBLIC_IP
#Check if security group rule for SSH is already added for my public IP for security group called "RemoteSSH"
HAS_RULE=$(aws ec2 describe-security-groups --filters Name=group-name,Values=RemoteSSH --query "SecurityGroups[*].IpPermissions[?ToPort=='22'].IpRanges[?CidrIp=='$MY_PUBLIC_IP/32']" --output text)
SG_ID=$(aws ec2 describe-security-groups --filters Name=group-name,Values=RemoteSSH --query "SecurityGroups[*].GroupId" --output text)

if [ -z "$HAS_RULE" ]; then
  echo "Adding security group rule for SSH for my public IP"
  aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_PUBLIC_IP/32
fi

# #display security group details
# aws ec2 describe-security-groups --filters Name=group-name,Values=RemoteSSH --query "SecurityGroups[*].IpPermissions[?ToPort=='22'].IpRanges" --output text
