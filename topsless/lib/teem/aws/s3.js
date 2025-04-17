const AWS = require('aws-sdk');
const at = require('./awsTask');
const sts = require('./sts');
var creds;
var s3;
module.exports = init;

async function init(config = null) {

    try {
        if (config) {
            if (config['tokenCode'] && config['mfaSerial'] && config['roleArn']) {
                creds = await sts(config).assumeWithMFA(config['roleArn'], config['tokenCode'], config['mfaSerial'], config['region'] ? config['region'] : 'us-east-1');
            } else {
                creds = await sts(config).assume(config);
            }

            s3 = new at.client(creds.region, creds, 'S3')
        } else {
            s3 = new at.client('us-east-1', null, 'S3')
        }

    }
    catch (e) {
        throw e
    }
    return {
        list: listBuckets,
        command: command
    }

}

async function listBuckets() {

    try {
        const data = await at(s3, 'listBuckets');
        return data;
    } catch (e) {
        console.log(e)
        throw e
    }

}

/**
 * event is sent in following format:
 * {
 *  "task": "listBuckets",
*   "params": {
*        "Bucket": "string",
*         "Delimiter": "string",
*         "EncodingType": "url",
*         "Marker": "string",
*         "MaxKeys": number,
* "       "Prefix": "string"
 *   }
 * }
 * @param {*} event 
 * @returns 
 */
async function command(event) {

    try {
        const data = await at(s3, event.task, event.params ? event.params : null);
        return data;
    } catch (e) {
        console.log(e)
        throw e
    }

}
