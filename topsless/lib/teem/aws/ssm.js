//used for getting ssm pareameters secrets
const at = require('./awsTask');
const { SSMClient } = require('@aws-sdk/client-ssm');
const sts = require('./sts');
var creds, ssm;

module.exports = async function (config = null) {
    try {
        if (config) {
            creds = await sts(config).assumeWithMFA(config['roleArn'], config['tokenCode'], config['mfaSerial'], config['region'] ? config['region'] : 'us-east-1');
            ssm = new at.client(creds.region, creds, 'S3')
        } else {
            s3 = new at.client('us-east-1', null, 'S3')
        }

    }
    catch (e) {
        throw e
    }
    return {
        task: ssmTask,
        getParam: getParam
    }
}

// Implementations using ssmTask can be added below and as a return in module.exports
async function getParam(key) {
    try {
        const params = {
            Name: key,
            WithDecryption: true
        }
        return await at('getParameter', params);
    } catch (e) {
        throw e;
    }
}