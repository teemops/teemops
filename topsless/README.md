# Serverless app for file uploads

Uploads stuff to S3

### What is this repository for?

### Setup and configuration files

### Manual install

```
cd <this_repos_folder>
npm install
```

#Deploy entire serverless stack in folder
'''
serverless deploy
#or
serverless deploy --stage dev
'''

### Deploy a single serverless function

Must have already been deployed by serverless deploy command above
'''
serverless deploy function --function upload
'''

#Monitoring
Monitoring will capture any error and success and sent to AWS cloud watch.
The Lambda function will automatically capture errors and successes.

### Development Environment

Setup your dev environment to work offline without AWS connectivity.
This will ensure you can use a local Dynamo and Lambda

```
docker pull lambci/lambda
sls dynamodb install
sls dynamodb start -p 8000  --migrate true
```

Run offline mode

```
serverless offline
```

### Tail logs

```
serverless logs -f upload -t  --startTime 20m
serverless logs -f download -t --startTime 20m
```

### Testing functions locally

You can test functions locally using test data.
WARNING: Testing locally can still launch AWS assets such as EC2 instances.
Test data needs to be modified in tests/json folder.

```
#Test pulling data
serverless invoke local -f upload -p tests/json/event.json

```

### Installing latest node version

You can install nvm locally:

# install nvm

curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# install node 8

nvm install 8

# to make node 8 the default

nvm alias default 8

### Older versions of node

If you have an older version of node > v4, this app will support it.

### Local SQS ElasticMQ

This is used to test SQS functionality
https://github.com/softwaremill/elasticmq
