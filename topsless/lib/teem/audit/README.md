# Audit rules

Audit rules are used to trigger and scan for resources in AWS.

## Structure

The structure is as follows.

### Service folder
Under the audit directory are multiple service folders. these folders correspond to a service in AWS. For example, the `ec2` folder contains audit rules for the EC2 service.

### Rule file: rules.js
The rules.js file implements a basic structure as follows:
 * tasks: an array of tasks to be executed
    * task: the name of the task to be executed
        * id: the name of the field to be used as an id. This ID is used to identify the resource in the database
        * key: the name of the field to be used as a key. This key is used to identify the resource in the AWS API
 * config: a configuration object for the rule file
 
tasks example as below:
```javascript
var tasks = {
    listBuckets: { //primary task
        task: 'listBuckets', //AWS SDK method
        id: 'bucket',    //name of the field to be used as an id
        key: 'Name',    //name of the field to be used as a key
        description: 'List all buckets',
        items: {},
        actions: [
            'getBucketEncryption',
            'getBucketAcl',
            'getPublicAccessBlock',
            'getBucketVersioning'
        ]
    },
    getBucketEncryption: {},
    getBucketAcl: {},
    getPublicAccessBlock: {},
    getBucketVersioning: {},
}
```