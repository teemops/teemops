# Teemops

Teemops is simplified AWS (Amazon Web Services) management.

Join Slack Channel: http://bit.ly/topslack

It consists of a UI, API and back end processing services.

Quick setup:
```
bash <(curl -s https://raw.githubusercontent.com/teemops/teemops/master/setup.sh)
```

Current High Level "Release" tasks on Trello:
https://trello.com/b/vbi94Gjg/teem-ops-open-source

# Components
Teemops has a number of separate repositories that make up the entire application.
* API: https://github.com/teemops/core-api
* UI: https://github.com/teemops/teemops-ui
* Back End: https://github.com/teemops/teemops-serverless
* Services: Not released yet - manages updating of latest AMIs for EC2 actions.
* Database schema: located in this repo under schema/

# Docs
Work in progress sits on Google Drive: http://bit.ly/tops-gdrive

https://docs.teemops.com This is a Work in Progress and will be live Feb 2019

# All Cloudformation templates
These are located in bucket:
https://templates.teemops.com.s3-us-west-2.amazonaws.com

IAM templates:
Root Account: https://templates.teemops.com.s3-us-west-2.amazonaws.com/iam.ec2.root.role.cfn.yaml
Child Account(s): https://templates.teemops.com.s3-us-west-2.amazonaws.com/iam.role.child.account.cfn.yaml

Cloudwatch event templates: (These are only created in each region the first time a launch config is added for a region)
https://templates.teemops.com.s3-us-west-2.amazonaws.com/cw.notify.child.account.cfn.yaml

# AWS Setup Explanation
Teemops works using Cross Account IAM Role access which allows it to manage multiple resources in an unlimited number of AWS Accounts.

In essence Teemops needs to be installed on any AWS account that can Cross account to any AWS account.

A typical structure is:
* root Teemops AWS Account
  * AWS Account #1
  * AWS Account #2...
  * ...
  * AWS Account #n

Teemops requires the ability to do the following in your root AWS account:
* Create SQS Queues
* Create S3 Buckets
* CloudFormation
* Lambda
* DynamoDB 

The following section outines the Cloudformation template required and installation scripts for the entire application.

# BEFORE Setup
Run this CloudFormation which will create the following resources in either a dev or prod ROOT Teemops AWS account:
* IAM Policy for local dev or production EC2 instance
* IAM Role and Instance Profile that can be attached to EC2 instance
* IAM Group that dev users can be added to.

Step 1: Run CloudFormation https://raw.githubusercontent.com/teemops/teemops/master/cloudformation/iam.ec2.root.role.cfn.yaml
```
curl https://raw.githubusercontent.com/teemops/teemops/master/cloudformation/iam.ec2.root.role.cfn.yaml --output iam.ec2.root.role.cfn.yaml && 
aws cloudformation create-stack --stack-name teemops-root-iam --template-body file://iam.ec2.root.role.cfn.yaml --capabilities CAPABILITY_NAMED_IAM --region us-west-2
```
OR from local copy of this repo

```
aws cloudformation create-stack --stack-name teemops-root-iam --template-body file://cloudformation/iam.ec2.root.role.cfn.yaml --capabilities CAPABILITY_NAMED_IAM --region us-west-2
```

If you are runnning on a dev machine locally you will need to ensure your AWS IAM user is attached 

If you are running on an EC2 Instance you will need to use Instance Profile created in the above CloudFormation template.

# Setup
TODO: 17 Jan 2018
* setup core-api/app/config/config.json properly from setup.sh script
* do serverless deploy command as part of setup - AWS option

Setup is pretty simple. 
OPTION 1: Just download and run this repo's setup.sh script or run the following command on a linux or MAC OSX
```
bash <(curl -s https://raw.githubusercontent.com/teemops/teemops/master/setup.sh)
```
If on a MAC you may need to use sudo

```
sudo bash <(curl -s https://raw.githubusercontent.com/teemops/teemops/master/setup.sh)
```
OPTION 2: Clone this repo and run setup.sh with optional args
Clone repo and use setup.sh

```
#clone repo into teemops folder
git clone https://github.com/teemops/teemops.git

#run setup sh with optional argument
cd teemops
setup.sh dev
```


# Pre-requisites
To run the above needs to be done on a MAC OSX or Ubuntu machine with the following installed:
* Node
* NPM
* MYSQL
* Serverless (Will attempt to install if it is not installed)

If the first 3 aren't installed the installation will notify when the script runs. If Serverless is not installed then it will be installed if all above 3 are installed

### Installing latest node version ###

You can install nvm locally:
# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# install node 8
nvm install 8

# to make node 8 the default
nvm alias default 8



