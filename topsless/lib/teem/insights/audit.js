/**
 * Gets an audit object from database
 */
const db = require('../../../drivers/mysql')

module.exports = issues
module.exports.issues = issues
module.exports.services = services
module.exports.severity = severity

/**
 * Get the total number of issues including passed and failed
 * 
 * SQL File: /database/insights/audit/all_stats_queries.sql
 * 
 * @param {*} user 
 * @param {*} params 
 * @returns 
 */
async function issues(user, params) {
    try {
        const sql = `
        SELECT 
        COUNT(findings.passed) AS total,
        COUNT(CASE WHEN findings.passed=0 THEN 1
        END) AS failed,
        COUNT(CASE WHEN findings.passed=1 THEN 1
        END) AS passed
        FROM (
        SELECT DISTINCT f.service,
        f.rule,
        f.resource,
        f.passed,
        max(f.timestamp)
        FROM audit_findings f
        WHERE f.userid=?
        GROUP BY f.service, f.rule, f.resource,f.passed) findings;
        `
        const result = await db().getRow(sql, [user.userid])
        return result
    } catch (e) {
        throw e
    }
}

async function services(user, params) {
    try {
        const sql = `
        SELECT 
        COUNT(f.passed) AS total,
        COUNT(CASE WHEN f.passed=0 THEN 1
        END) AS failed,
        COUNT(CASE WHEN f.passed=1 THEN 1
        END) AS passed,
        service
        FROM audit_findings f
        WHERE scan_id=(
        select max(s.id) from audit_scan s
        inner join audit_results r
        ON s.id=r.scan_id
        where user_id=?
        and r.service=f.service
        )
        GROUP BY service;
        `
        const result = await db().getRows(sql, [user.userid])
        return result
    } catch (e) {
        throw e
    }
}

/**
 * Get the severity count for each service
 * 
 * SQL File: /database/insights/audit/all_stats_queries.sql
 * 
 * @param {*} user 
 * @param {*} params 
 * @returns 
 */
async function severity(user, params) {
    try {
        const sql = `
        SELECT 
        COUNT(CASE WHEN findings.passed=0 and findings.severity='high' THEN 1
        END) AS high,
        COUNT(CASE WHEN findings.passed=0 and findings.severity='medium' THEN 1
        END) AS medium,
        COUNT(CASE WHEN findings.passed=0 and findings.severity='low' THEN 1
        END) AS low,
        findings.service
        FROM (
        SELECT DISTINCT f.service,
        f.rule,
        f.resource,
        f.passed,
        f.severity,
        max(f.timestamp)
        FROM audit_findings f
        WHERE f.userid=? and f.passed=0
        GROUP BY f.service, f.rule, f.resource,f.passed,f.severity) findings GROUP BY service;
        `
        const result = await db().getRows(sql, [user.userid])
        return result
    } catch (e) {
        throw e
    }
}
