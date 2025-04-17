const AWS = require('aws-sdk');
const at = require('./awsTask');
const sts = require('./sts');
var creds;
var generic;
module.exports = init;

/**
 * init the credentials and client
 * 
 * @param {*} config 
 * @param {*} apiName  the api to use e.g. 'S3' or 'EC2'
 * @returns 
 */
async function init(apiName = 'S3', config = null, hasSTS = true) {

    try {

        if (config && hasSTS) {
            //we assume if credentials have expired and sessionToken is set, we need to assume a role
            //because if we just check credentials.expired they will not be expired for the default AWS profile/credentials 
            //if we haven't yet assumed a role
            if (generic.config.credentials == undefined || (generic.config.credentials.sessionToken && generic.config.credentials.expired) || !generic.config.credentials.sessionToken) {
                //check if config has mfa or has a stsExternalId
                if (config['externalId']) {
                    // creds = await sts(config).assume()
                    creds = await sts(config).assume({
                        roleArn: config['roleArn'],
                        externalId: config['externalId'],
                        region: config['region'] ? config['region'] : 'us-east-1'
                    });
                } else { //MFA Option
                    creds = await sts(config).assumeWithMFA(config['roleArn'], config['tokenCode'], config['mfaSerial'], config['region'] ? config['region'] : 'us-east-1');
                }
                generic = new at.client(creds.region, creds, apiName)
            } else {
                //check region and change
                if (generic.config.region != config['region']) {
                    generic = new at.client(config['region'], generic.config.credentials, apiName)
                }
            }

        } else {
            if (config && config.region) {
                generic = new at.client(config.region, null, apiName)
            } else {
                generic = new at.client('us-east-1', null, apiName)
            }
        }

    }
    catch (e) {
        throw e
    }
    return {
        regions: listRegions,
        command: command
    }

}

async function listRegions() {

    try {
        const regionClient = new at.client('us-east-1', null, 'EC2')
        const data = await at(regionClient, 'describeRegions');
        if (data.Regions) {
            return data.Regions.map(region => region.RegionName)
        } else {
            throw new Error('No regions found')
        }

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
        const data = await at(generic, event.task, event.params ? event.params : null);
        return data;
    } catch (e) {
        console.log(e)
        throw e
    }

}
