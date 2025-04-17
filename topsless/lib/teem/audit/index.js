const add = require('./add')
const start = require('./start')
const get = require('./get')
const findings = require('./findings')
const s3 = require('./s3/scan')
const ec2 = require('./ec2/scan')
const rds = require('./rds/scan')
const iam = require('./iam/scan')
const route53 = require('./route53/scan')

module.exports = {
    add: add,
    get: get,
    start: start,
    findings: findings,
    s3: s3,
    ec2: ec2,
    iam: iam,
    rds: rds,
    route53: route53
}

