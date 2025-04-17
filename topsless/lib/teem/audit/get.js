/**
 * Gets an audit object from database
 */
const db = require('../../../drivers/mysql')

module.exports = get
module.exports.list = list
module.exports.results = results
module.exports.findings = findings

async function get(auditId) {
    try {
        const result = await db().getRow(`SELECT * FROM audit_scan WHERE id=?`, [auditId])
        return result
    } catch (e) {
        throw e
    }
}

/**
 * All Scans for a user
 * 
 * SQL File: /database/insights/audit/scans_for_user.sql
 * 
 * @param {*} user 
 * @returns 
 */
async function list(user) {
    try {
        const sql = `
        SELECT s.*, ucp.aws_account_id, ucp.name as aws_account_name, count(r.id) as findings FROM audit_scan s
        inner join audit_results r
        ON s.id=r.scan_id
        inner join user_cloud_provider ucp
        ON s.user_cloud_provider_id=ucp.id
        WHERE user_id=?
        and r.timestamp =(
        select max(subr.timestamp)
        from audit_results subr
        where subr.scan_id=s.id
        and subr.region=r.region
        and subr.service=r.service
        and subr.task=r.task
        and subr.item=r.item
        )
        GROUP BY
        s.id,
        s.user_cloud_provider_id,
        s.audit_type,
        s.timestamp,
        s.user_id,
        ucp.aws_account_id,
        ucp.name
        order by timestamp desc

        `
        const result = await db().getRows(sql, [user.userid])
        return result
    } catch (e) {
        throw e
    }
}

async function results(user, scanId) {
    try {
        const sql = `
        SELECT r.*
        FROM audit_results r
        INNER JOIN audit_scan s
        ON r.scan_id=s.id
        WHERE user_id=? and r.scan_id=?;
        `
        const result = await db().getRows(sql, [user.userid, scanId])
        return result
    } catch (e) {
        throw e
    }
}

/**
 * Gets the latest recommendations findings for a user
 * 
 * @param {*} user 
 * @param {*} scanId 
 * @returns 
 */
async function findings(user, scanId = null) {
    try {
        if (!scanId) {
            const sql = `
            SELECT f.*
            FROM audit_findings f
            WHERE scan_id=(
            select max(s.id) from audit_scan s
            inner join audit_results r
            ON s.id=r.scan_id
            where user_id=?
            and r.service=f.service
            )
            and f.timestamp=(
            select max(subf.timestamp)
            from audit_findings subf
            where subf.userid=f.userid
            and subf.service=f.service
            and subf.rule=f.rule
            and subf.resource=f.resource
            );
            `
            const result = await db().getRows(sql, [user.userid])
            return result
        } else {
            const sql = `
            SELECT f.*
            FROM audit_findings f
            WHERE f.userid=? and f.scan_id=?
            and f.timestamp=(
            select max(subf.timestamp)
            from audit_findings subf
            where subf.userid=f.userid
            and subf.service=f.service
            and subf.rule=f.rule
            and subf.resource=f.resource
            );
            `
            const result = await db().getRows(sql, [user.userid, scanId])
            return result
        }

    } catch (e) {
        throw e
    }
}
