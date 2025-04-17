/**
 * Create s3 auditing library to check for:
 * Encryption
 * Versioning
 * Lifecycle
 * Bucket Policy
 * Bucket ACL
 * Bucket Website
 * Public Access Block
 * 
 */

const s3Lib = require('../../aws/s3')
//get definition
const rules = require('./rules')

var s3
(async () => {
    s3 = await s3Lib(null)
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
    s3 = await s3Lib(config)
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
        var buckets = await s3.command(event)
        return buckets;
    } catch (e) {
        throw e
    }
}