var AWSSTS = require('aws-sdk');
//globals
var config, externalId;
var sts = new AWSSTS.STS();

const sessionName = "tops_audit_scan";

module.exports = init;

function init(appConfig) {
    config = appConfig;
    //externalId = config.get("ExternalId");
    return {
        assume: stsAssume,
        assumeWithMFA: stsAssumeWithMFA
    }
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
async function stsAssume(event) {
    var params = {
        DurationSeconds: 900,
        RoleArn: event.roleArn,
        ExternalId: event.externalId,
        RoleSessionName: sessionName
    };
    return new Promise(function (resolve, reject) {
        sts.assumeRole(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                if (data.Credentials.length !== 0) {
                    var creds = {
                        accessKeyId: data.Credentials.AccessKeyId,
                        secretAccessKey: data.Credentials.SecretAccessKey,
                        sessionToken: data.Credentials.SessionToken,
                        region: event.region
                    };
                    resolve(creds);
                } else {
                    reject("Error Assuming Role");
                }
            }
        });
    })

}

async function stsAssumeWithMFA(roleArn, tokenCode, mfaSerial, region) {

    var params = {
        DurationSeconds: 900,
        RoleArn: roleArn,
        TokenCode: tokenCode,
        RoleSessionName: sessionName,
        SerialNumber: mfaSerial
    };
    return new Promise(function (resolve, reject) {
        sts.assumeRole(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                if (data.Credentials.length !== 0) {
                    var creds = {
                        accessKeyId: data.Credentials.AccessKeyId,
                        secretAccessKey: data.Credentials.SecretAccessKey,
                        sessionToken: data.Credentials.SessionToken,
                        region: region
                    };
                    resolve(creds);
                } else {
                    reject("Error Assuming Role");
                }
            }
        });
    })

}

