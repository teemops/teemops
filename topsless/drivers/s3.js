
//require aws.js
const awsTask = require('./aws');
var s3 = new AWS.S3({ region: 'us-east-1' });

module.exports = function () {

    return {
        task: s3Task,
        listBuckets: listBuckets
    }
}

async function s3Task(task, params = null) {
    try {
        return await awsTask(s3, task, params);
    } catch (e) {
        throw e;
    }
}

// Implementations using s3task can be added below and as a return in module.exports
async function listBuckets() {
    try {
        return await s3Task('listBuckets');
    } catch (e) {
        throw e;
    }
}

