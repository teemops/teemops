/**
 * Create IAM auditing library to check for:
 * User creds, Access Keys
 * etc...
 * 
 */

const awsLib = require('../../aws/generic')
//get definition
const rules = require('./rules')

var aws
(async () => {
    aws = await awsLib('IAM', null, true)
})();

module.exports = init
module.exports.rules = rules

function init() {

    return {
        setup: setup,
        check: check
    }
}

async function setup(roleArn, externalId, region) {
    var config = {
        roleArn: roleArn,
        externalId: externalId,
        region: region
    }
    aws = await awsLib('IAM', config)
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
async function check(event) {
    try {
        var items = await aws.command(event)
        return items;
    } catch (e) {
        throw e
    }
}
