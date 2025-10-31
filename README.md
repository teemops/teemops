# Teemops

![](https://raw.githubusercontent.com/teemops/teemops/master/ui/assets/images/teemops.gif)

## What is Teemops?
Teemops is a security and compliance tool for AWS accounts.

Teemops simplifies AWS Security by providing insights for the following:
* IAM Configuration
* EC2 Instances
* S3 Bucket Configuration
* Security Groups
* Current Resources

## Install

![](https://raw.githubusercontent.com/teemops/teemops/master/ui/assets/images/teemops-install.png)

Pre-requisites:
- Check docker is installed [Docker Install](https://docs.docker.com/get-docker/)
- Check Node is installed [Node Install](https://nodejs.org/en/download/)
- Check AWS CLI V2 is installed [AWS CLI Install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- An AWS account with permissions to create IAM roles, SQS queues, S3 buckets, Lambda functions and DynamoDB tables.

Quick setup (docker support):

```
mkdir teemops && cd teemops
bash <(curl -s https://raw.githubusercontent.com/teemops/teemops/master/install.sh)
```


Optional:
If you're having issues with docker or permissions you can run the following to ensure you have the correct permissions:
```
# add your user to the docker group
sudo usermod -aG docker $USER
#update user permissions in the current session
newgrp docker
```

## Features

Features are as follows:
* Audit AWS Account(s)
* Security insights and recommendations
* Signup and register
* API for devops/security automation

Request a new Feature:
https://github.com/teemops/teemops/issues/new?template=request-a-feature.md

### Roadmap

Features Board:
https://github.com/orgs/teemops/projects/2/views/2

## Community

Join Telegram Channel: https://t.me/teemops

It consists of a UI, API and back end processing services.

## Bugs

Have a bug that is causing an issue?

Submit a bug: https://github.com/teemops/teemops/issues/new?template=bug_report.md

# Components

Teemops has a number of separate packages that make up the entire application.

- API: api
- UI: ui
- Serverless Back End: topsless
- Different Services: AMIs, SQS Manager, Pricing
- Database schema: located in this repo under schema/ TBD

# Docs

https://docs.teemops.com This is a Work in Progress and will be live soon

# AWS Setup Explanation

Teemops works using Cross Account IAM Role access which allows it to manage multiple resources in an unlimited number of AWS Accounts.

In essence Teemops needs to be installed on any AWS account that can Cross account to any AWS account.

A typical structure is:

- root Teemops AWS Account
  - AWS Account #1
  - AWS Account #2...
  - ...
  - AWS Account #n

Teemops requires the ability to do the following in your root AWS account:

- Create SQS Queues
- Create S3 Buckets
- CloudFormation
- Lambda
- DynamoDB


# Authors

Teemops was created by [Ben Fellows](https://github.com/sponsors/kiwifellows) and is maintained by him and a core team of contributors.

If you would like to contribute to Teemops please see the [CONTRIBUTING.md](

# License

GNU license is the current license being applied to this code. (The exact license may change in the future, but the intention for community edition is free, open source and able to be freely distributed without fear of any licensing restrictions).

