/**
 * Provides rules defintion for a scan
 */
var tasks = {
    listBuckets: {
        task: 'listBuckets',
        id: 'bucket',
        key: 'Name',
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
var config = {
    service: 's3',
    start: tasks.listBuckets,
    defaults: {
        actions: {
            params: (item) => {
                return {
                    Bucket: item.Name
                }
            }
        }
    }
}

tasks.listBuckets.items = {
    Buckets: [
        {
            Name: 'Name',
            Type: 'String',
        },
        {
            Name: 'CreationDate',
            Type: 'Date',
        }
    ]
}
// tasks.getBucketEncryption = {
//     task: 'getBucketEncryption',
//     description: 'Get bucket encryption',
//     params: {
//         Bucket: 'Name'
//     },
//     items: {},
//     actions: {}
// }
// tasks.getBucketAcl = {
//     task: 'getBucketAcl',
//     description: 'Get bucket acl',
//     params: {
//         Bucket: 'Name'
//     },
//     items: {},
//     actions: {}
// }

module.exports = { config: config, tasks: tasks };