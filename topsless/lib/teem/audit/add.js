/**
 * Adds an audit object to database
 */
const db = require('../../../drivers/mysql')
const awsLib = require('../aws/generic')

var config = {
    region: process.env.AWS_REGION
}


var aws
// (async (config) => {
//     aws = await awsLib('EC2', config)
// })();

module.exports = add
module.exports.findings = findings

/**
 * Adds an audit to the SQS Queue and to database (if is new audit ID)
 * body contains data such as the audit_type and user_cloud_provider_id
 * optionally can have a custom sqsQueueName
 * can also add options see options parameter below
 * 
 * @param {*} body 
 * @param {*} user 
 * @param {*} sqsQueueName 
 * @param {*} options options are used to configure e.g. {task:'ec2',region:'ap-southeast-2'}
 * @returns 
 */
async function add(body, user, isNew = true, sqsQueueName, options) {
    try {
        var msgBody
        //console.log(JSON.stringify(process.env))
        console.log(process.env.IS_OFFLINE || 'is offline not defined ')
        if (isNew) {
            var result = await db().insertPromise(
                `INSERT INTO audit_scan (user_cloud_provider_id, audit_type, user_id)
                VALUES(?,?, ?)`,
                [body.user_cloud_provider_id, body.audit_type, user.userid])
        } else {
            var result = options.audit_scan_id
        }

        //now add to sqs queue
        // config = {
        //     ...config,
        //     endpoint: process.env.SQS_ENDPOINT,
        // }
        aws = await awsLib('SQS', config, false)
        console.log("aws sqsqueue url")
        var sqsQueueUrl = await aws.command({ task: 'getQueueUrl', params: { QueueName: sqsQueueName || process.env.SQS_QUEUE_NAME } })
        // if (process.env.IS_OFFLINE) {
        //     sqsQueueUrl = {
        //         QueueUrl: `${process.env.SQS_ENDPOINT}/000000000000/teemops_audit`
        //     }
        // }
        // else {
        //     sqsQueueUrl = {
        //         QueueUrl: `https://sqs.us-west-2.amazonaws.com/0000000000000000/teemops_audit`
        //     }
        // }
        console.log("aws sendMessage params")
        if (options != undefined) {
            msgBody = {
                ...options,
                audit_scan_id: result
            }
        } else {
            msgBody = {
                audit_scan_id: result
            }
        }
        var event = {
            task: 'sendMessage',
            params: {
                QueueUrl: sqsQueueUrl.QueueUrl,
                MessageBody: JSON.stringify(msgBody),
                DelaySeconds: 0,
                MessageAttributes: {
                    mainKey: {
                        DataType: 'Number',
                        StringValue: result.toString()
                    }
                }
            }
        }
        console.log("aws sendMessage event sent")
        const sqsResult = await aws.command(event)
        console.log("aws sendMessage Completed")
        return result
    } catch (e) {
        throw e
    }
}

async function findings(userId, findings, scanId, ruleset = 'basic') {
    try {
        //loop through findings and add a record for each
        for (const finding of findings) {
            const promises = []

            var result = await db().insertPromise(
                `INSERT INTO audit_findings (guid, userid, results_id, scan_id, service, resource, passed, severity, description, ruleset, rule, timestamp, region)
                VALUES(UUID(),?,?,?,?,?,?,?,?,?,?,?,?)`,
                [userId, finding.id, scanId, finding.service, finding.item, finding.compliant, finding.rule.severity, finding.rule.description, ruleset, finding.rule.rule, finding.timestamp, finding.region])
            console.log(`Finding ${finding.task} added to database with ID ${result}`)
            promises.push(result)

            await Promise.all(promises)
        }

        return true
    } catch (e) {
        throw e
    }
}
