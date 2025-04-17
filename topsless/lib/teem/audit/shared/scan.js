const awsLib = require('../../aws/generic')
var aws, lib

module.exports = init
module.exports.set = set

function init() {

    return {
        setup: setup,
        check: check
    }
}

async function set(useLib = 'EC2') {
    lib = useLib
    aws = await awsLib(lib, null, true)
}

async function setup(roleArn, externalId, region) {
    var config = {
        roleArn: roleArn,
        externalId: externalId,
        region: region
    }
    aws = await awsLib(lib, config)
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
