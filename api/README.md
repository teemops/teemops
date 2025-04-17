![Teem Ops CI Build Status](https://travis-ci.org/teemops/core-api.svg?branch=master)

# Teemops Core API

Simplified AWS Operations

Join Slack Channel: http://bit.ly/topslack

This is the API part of https://github.com/teemops/teemops

Alpha code, not ready for release or maintenance.
(Moved from private Bitbucket to Public GitHub)

Feel free to look through the code or watch this repo.

This contains the code for the following:

- Node Express API

# About and Background

Teemops was originally developed as a SaaS product, but after some thought and a few years of R&D the founder decided to
release the code as an open source project under the Creative Commons and GNUS licenses for different components.

The reasons for this were many, but the main was to provide a free version to make it easier for IT Ops teams on AWS.

Examples of problems that Teemops wants to solve:

- Multi-account management
- Multi-region managemennt
- Faster launch configuration
- Centralised AMI management
- Centralised key management (EC2 Key Pairs)
- Automate a number of cumbersome tasks in AWS
- Security Scanning and Insights.

# Security

Security is day "zero" at Teemops. We like to take security seriously, but we also like to ensure innovation is not hindered by it. If you have any ideas how we could improve security and want to contribute in this area please email security@teemops.com

<!-- Read about thoughts and updates on our blog:
https://blog.teemops.com/tag/security -->

## Trello

There is a public Trello board which has current status of high level features:
https://trello.com/b/vbi94Gjg/teem-ops-open-source

You can use Github issues to add issues.


### Installing latest node version

You can install nvm locally:

# install nvm

curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# install node 16

nvm install 16

# to make node 16 the default

nvm alias default 16

### Older versions of node

If you have an older version of node < v16, this app will support it.

# Database setup

Now using Prisma ORM.
This was done using the following online guide:
https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-node-mysql

## using prisma

### setup new migration

```bash
npx prisma migrate dev --name <init>
```

### Migrate changes to database

```bash
npx prisma migrate deploy
```

### prisma studio

```bash
npx prisma studio
```

### seed data for development

First run the migrate deploy command above then run below:

```bash
npx prisma generate
npx prisma db seed
```

# Setup and configuration files

You can run the installer, which will take care of everything and ensure you are running on the latest build.
See https://github.com/teemops/teemops

Setup .env file.

### Running:

- Dev
  npm start

- Test
  npm run-script start-test

- Prod
  npm run-script start-prod

## Deployment

Deployment at the moment is either to EC2 or ECS.
However for simplicity and the current scale I have opted for EC2.
The deployment is done at the root level of the Monorepo (1 level above this api folder).

### Deployment to EC2

There are 2 steps to deployment:
1./ Setup the EC2 Environment on the Ubuntu OS
2./ Deploy the code to the EC2 Environment

Setup the EC2 Environment

```bash
sh ./infra/utils/deploy/setup.sh prod
```

Deploy the code to the EC2 Environment

```bash
sh ./infra/utils/deploy/deploy.sh dev
```

### Plugins - Still in Development

The concept of plugins is just an idea at the moment but would be default plugins and custom extensions.

If plugins exist in config file and in file system they are loaded by default. You can build your own custom plugins such as message queuing, database driver etc...
The following plugins are enabled by default:

- SQS
- MySQL

Plugin settings:
These are in config.json.sample.

### License and Copyright notices

GNU General Public License v3.0

### Support

For any support related queries please email ben@teemops.com
