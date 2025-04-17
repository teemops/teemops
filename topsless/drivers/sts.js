
//require aws.js
const awsTask = require('./aws');
var sts = new AWS.STS()

module.exports = function () {

    return {
        assume: assumeRole,
    }
}

async function stsTask(task, params = null) {
    try {
        return await awsTask(sts, task, params);
    } catch (e) {
        throw e;
    }
}

// Implementations using stsTask can be added below and as a return in module.exports
//function to sts assume role
async function assumeRole(roleArn, roleSessionName, externalId) {
    try {
        const result = await stsTask('assumeRole', {
            DurationSeconds: 900,
            RoleArn: roleArn,
            RoleSessionName: roleSessionName,
            ExternalId: externalId
        });
        if (result.Credentials.length !== 0) {
            return result.Credentials;
        } else {
            throw new Error('No credentials returned from STS');
        }
    } catch (e) {
        throw e;
    }
}

