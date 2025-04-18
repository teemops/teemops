![Teemops GIF](https://raw.githubusercontent.com/teemops/assets/master/teemops-scg-gif.mp4.gif)

# Teemops UI

Teemops UI is the User Interface for the Teemops App.

Built in Nuxt JS.

## Problem: Creating AWS Resources via templates is hard for newbies

The one problem teemops aims to solve today is to remove deployment complexity for new AWS resources including EC2, Autoscaling Groups, Load Balancers and other resources.

## Solution: Provide a Simple UI to make it easier

The solution that teemops has is to provide a simple Form with some options and parameters a user can enter to launch a CloudFormation template via the AWS Console or via the AWS CLI.

## When and Why would you use Teemops?

If you are in are an Ops team, systems engineer, developer or cloud newbie.
CloudFormation is AWS templating language for deploy AWS infrastructure such as EC2(Servers), Load Balancers, RDS (Databases).
If you're stuck on developing CloudFormation templates and want an easy way to launch them into your own AWS account this tool will provide you with an easy form to automate the process using pre-defined templates.

## Feature requests

Please ask for any AWS resources you want to see here: https://github.com/teemops/teemops/issues/new

## SCG - Simple Cloud Generator

Part of Teemops is SCG - A Simple Cloud Generator
Simple Cloud Generator can be run at https://app.teemops.com or by downloading the source and following the instructions below.

## Options to Run

Either:

https://app.teemops.com

OR

## Install pre-requisites

You will need a node environment to run.
https://nodejs.org/en/

## Install teemops locally

```bash
git clone https://github.com/teemops/teemops.git
cd teemops/ui
npm install
npm run dev

```

## Dev Build Setup

```bash
# install dependencies
$ npm install
#or
npm install --legacy-peer-deps

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

#upgrade all npm modules in package.json
$ npm update
```

## Deployment to an AWS S3 + CloudFront

Deployment can be done by using docker for the ansible controller.

Using VS Code Remote Containers is the most simple because it will build the docker environment and all Ansible / Python requirements for deployment artifacts

- First modify the deploy/vars/customers/scg.yml file to be envirnoment specific (see scg.sample.yml)
- You'll need to manually set up an SSL cert if you want to deploy,
- The deployment will deploy Teemops UI into an S3 bucket with CloudFront.

```bash
cd deploy
sh deploy.sh

```

## Deployment using Bash
