// //require aws sdk ec2
var AWSEC2 = require('aws-sdk');
//require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const tHttp = require('./lib/teem/http')
const auth = require('./lib/teem/auth/user')
const db = require('./drivers/mysql')
const audit = require('./lib/teem/audit')
const core = require('./lib/teem/core')
const generic = require('./lib/teem/aws/generic')

const AUDIT_TYPE_MAP = {
    'aws-audit': 2,
    's3-audit': 1,
    'iam-audit': 3,
    'custom-audit': 4
}

const SQS_QUEUE_NAMES = {
    standard: 'teemops_audit',
    region: 'teemops_audit_region'
}

/**
 * Start an audit
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.start = async function (event, context) {
    console.log("Testing audit start ")
    console.log(JSON.stringify(event))
    try {

        const body = JSON.parse(event.body)
        const user = auth.getUser(event)
        const result = await audit.add(body, user)
        if (result) {
            return tHttp.res({
                success: true
            })
        } else {
            return tHttp.res({
                error: 'Unable to start audit'
            })
        }

    } catch (e) {
        console.log(e)
        return tHttp.err({
            error: e
        },
            500)

    }

}

/**
 * Run the audit scan from an SQS NewMessage event
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.scan = async function (event, context) {
    console.log(event)
    try {

        const record = event.Records[0]
        console.log(JSON.stringify(record))
        const body = JSON.parse(record.Body)
        const result = await audit.get(body.audit_scan_id)
        const userId = result.user_id
        const stsCreds = await core.cloudProvider.get(userId, result.user_cloud_provider_id)

        if (result) {
            //now start the scan based on the audit type
            switch (result.audit_type) {
                case AUDIT_TYPE_MAP['s3-audit']:
                    var newAudit = audit.s3
                    var scan = newAudit()
                    var rules = newAudit.rules
                    await scan.setup(stsCreds.RoleArn, stsCreds.externalId, 'us-east-1')
                    // const results = scan.check({
                    //     "task": "listBuckets",
                    // });
                    const auditResult = await audit.start(result, scan, rules, 'us-east-1')
                    console.log(`Completed S3 Scan for audit ID: ${body.audit_scan_id}`)
                    console.log(auditResult)

                    break;
                case AUDIT_TYPE_MAP['aws-audit']:
                    await auditAny(body, result)
                    await auditAny(body, result, 'rds')

                    break;
                case AUDIT_TYPE_MAP['iam-audit']:
                    await auditIam(body, stsCreds, result)
                    await auditRoute53(body, stsCreds, result)
                    break;
                case AUDIT_TYPE_MAP['custom-audit']:
                    var scan = audit.custom()
                    break;
                default:
                    throw new Error('Invalid audit type')
            }

            const results = await audit.get.results({ userid: userId }, body.audit_scan_id)

            //starting the findings process
            const findings = audit.findings.evaluate(results, audit.findings.rulesets.basic)

            //add findings to database
            const addFindingsResult = await audit.add.findings(userId, findings, body.audit_scan_id)
            if (addFindingsResult) {
                console.log(`Added ${findings.length} findings to database`)
            }

            console.log('Completed audit scan and findings')
        } else {
            console.log('Unable to find audit scan ID')
        }

    } catch (e) {
        console.log(e)
    }

}

module.exports.scanRegion = async function (event, context) {
    try {
        const record = event.Records[0]
        console.log(JSON.stringify(record))
        const body = JSON.parse(record.body)
        const result = await audit.get(body.audit_scan_id)
        const userId = result.user_id
        const stsCreds = await core.cloudProvider.get(userId, body.user_cloud_provider_id)
        await auditGeneral(body, stsCreds, result)

        //Findings
        const results = await audit.get.results({ userid: userId }, body.audit_scan_id)

        //starting the findings process
        const findings = audit.findings.evaluate(results, audit.findings.rulesets.basic)

        //add findings to database
        const addFindingsResult = await audit.add.findings(userId, findings, body.audit_scan_id)
        if (addFindingsResult) {
            console.log(`Added ${findings.length} findings to database`)
        }

        console.log('Completed audit scan and findings')
    } catch (e) {
        console.log(e)
        console.log(e.stack)

    }
}

module.exports.runS3 = async function (event, context) {
    try {
        const body = JSON.parse(event.body)
        //setup with role arn and mfa token
        const scan = audit.s3()
        await scan.setup(body.roleArn, body.mfaToken, body.region)
        const results = scan.check(null);
        return tHttp.res({
            message: 'Audit complete',
            results: results
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }
}

/**
 * Lists the scans that have been requested by the user
 * 
 * @param {*} event 
 * @param {*} context 
 * @returns 
 */
module.exports.list = async function (event, context) {
    try {
        const user = auth.getUser(event)
        const result = await audit.get.list(user)
        return tHttp.res({
            success: true,
            result: result
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }
}

/**
 * Display the findings as evaluated in realtime for a user and audit scan
 * 
 * @param {*} event 
 * @param {*} context 
 * @returns 
 */
module.exports.findingsRealtime = async function (event, context) {
    try {
        //const user = auth.getUser(event)
        const body = JSON.parse(event.body)
        const result = await audit.get(body.scan_id)
        const userId = result.user_id
        const results = await audit.get.results({ userid: userId }, body.scan_id)

        //starting the findings process
        const findings = audit.findings.evaluate(results, audit.findings.rulesets.basic)

        //add findings to database
        const addFindingsResult = await audit.add.findings(userId, findings, body.scan_id)
        if (addFindingsResult) {
            console.log(`Added ${findings.length} findings to database`)
        }

        console.log('Completed audit scan and findings')

        return tHttp.res({
            success: true,
            result: findings
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }
}

/**
 * Display the findings as evaluated at scan time for a user and audit scan
 * 
 * @param {*} event 
 * @param {*} context 
 * @returns 
 */
module.exports.findings = async function (event, context) {
    try {
        const user = auth.getUser(event)
        const body = JSON.parse(event.body)
        var results = await audit.get.findings(user, body.scan_id)
        //TODO: parse all future rulesets and make this generic, but for now we just do basic ruleset
        var ruleset = audit.findings.rulesets.basic
        results = results.map((result) => {
            const rule = ruleset.rules.filter((rule) => rule.rule === result.rule)
            result.passed = result.passed === 1 ? true : false
            return {
                ...result,
                rule_detail: rule.length > 0 ? rule[0] : 'No valid rule found'
            }
        })

        return tHttp.res({
            success: true,
            result: results
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }
}

/**
 * Example:
 * {
 *  body: {
 *    audit_scan_id: 123,
 *      audit_type: 'ec2-audit'
 *  },
 *  user: {
 *      userid: 123
 *  }
 * }
 * 
 * @param {*} body 
 * @param {*} user 
 */
async function addAudit(body, user) {
    try {

    } catch (e) {
        console.log(e)
    }
}

/**
 * Example:
 * {
 *  task: 'ec2',
 *  region: 'ap-southeast-2',
 *  audit_scan_id: 123
 * }
 * 
 * @param {*} body 
 * @param {*} stsCreds 
 * @param {*} result 
 */
async function auditGeneral(body, stsCreds, result) {
    try {
        var newAudit = audit[body.task]
        var scan = newAudit()
        var rules = newAudit.rules
        await scan.setup(stsCreds.RoleArn, stsCreds.externalId, body.region)
        const auditResult = await audit.start(result, scan, rules, body.region)
        console.log(`Completed ${body.task} Scan for audit ID: ${body.audit_scan_id}`)
        console.log(auditResult)
    }
    catch (e) {
        throw e
    }

}

async function auditAny(body, result, taskType = 'ec2') {
    try {
        const regions = await getRegions()
        regions.forEach(async function (region) {
            const promises = []
            console.log('Region is: ' + region)
            const auditResult = await audit.get(body.audit_scan_id)
            promises.push(auditResult)
            const user = {
                userid: auditResult.user_id
            }
            const options = {
                audit_scan_id: body.audit_scan_id,
                user_cloud_provider_id: auditResult.user_cloud_provider_id,
                user_id: auditResult.user_id,
                audit_type: auditResult.audit_type,
                task: taskType,
                region: region
            }
            const result = await audit.add(body, user, false, SQS_QUEUE_NAMES.region, options)
            promises.push(result)
            await Promise.all(promises)
        });

    } catch (e) {
        console.log(e)
    }
}

// async function auditEc2(body, stsCreds, result) {
//     var newAudit = audit.ec2
//     var scan = newAudit()
//     var rules = newAudit.rules
//     await scan.setup(stsCreds.RoleArn, stsCreds.externalId, 'ap-southeast-2')
//     const auditResult = await audit.start(result, scan, rules, 'ap-southeast-2')
//     console.log(`Completed EC2 Scan for audit ID: ${body.audit_scan_id}`)
//     console.log(auditResult)
// }

async function auditIam(body, stsCreds, result) {
    var newAudit = audit.iam
    var scan = newAudit()
    var rules = newAudit.rules
    await scan.setup(stsCreds.RoleArn, stsCreds.externalId, 'us-east-1')
    const auditResult = await audit.start(result, scan, rules, 'us-east-1')
    console.log(`Completed IAM Scan for audit ID: ${body.audit_scan_id}`)
    console.log(auditResult)
}

async function auditRoute53(body, stsCreds, result) {
    var newAudit = audit.route53
    var scan = newAudit()
    var rules = newAudit.rules
    await scan.setup(stsCreds.RoleArn, stsCreds.externalId, 'us-east-1')
    const auditResult = await audit.start(result, scan, rules, 'us-east-1')
    console.log(`Completed Route53 Scan for audit ID: ${body.audit_scan_id}`)
    console.log(auditResult)
}

async function getRegions() {
    try {
        var aws = await generic('EC2', null)
        const regions = await aws.regions()
        return regions
    } catch (e) {
        console.log(e)
    }
}