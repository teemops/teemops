# Teemops

Teemops is simplified AWS (Amazon Web Services) management.

## Features

Features are as follows:
* Audit AWS Account(s)
* Security insights and recommendations
* Signup and register
* API for devops/security automation

## Community

Join Telegram Channel: https://t.me/teemops

It consists of a UI, API and back end processing services.

Quick setup:

```
bash <(curl -s https://raw.githubusercontent.com/teemops/teemops/master/install.sh)
```

Current High Level "Release" tasks on Trello:
https://trello.com/b/vbi94Gjg/teem-ops-open-source

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


# License

GNU license is the current license being applied to this code. (The exact license may change in the future, but the intention for community edition is free, open source and able to be freely distributed without fear of any licensing restrictions).

