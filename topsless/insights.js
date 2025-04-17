const tHttp = require('./lib/teem/http')
const auth = require('./lib/teem/auth/user')
const insights = require('./lib/teem/insights/index')
const audit = require('./lib/teem/audit')

const AUDIT_TYPE_MAP = {
    'aws-audit': 2,
    's3-audit': 1,
    'iam-audit': 3,
    'custom-audit': 4,
}

const STATS_TYPE = {
    'issues': {
        name: 'Issues',
        description: 'Total Issues by fail or pass',
    },
    'services': {
        name: 'Services',
        description: 'Services with findings totals',
    },
    'severity': {
        name: 'Severity',
        description: 'Total Issues by Severity and Service',
    },
}

module.exports.stats = async function (event, context) {
    console.log(event)
    try {
        const user = auth.getUser(event)
        const body = JSON.parse(event.body)
        if (!body.stats_type) {
            return tHttp.res({
                error: 'Missing stats type field stats_type, choose one of the valid_types',
                valid_types: STATS_TYPE
            })
        }
        const statsType = STATS_TYPE[body.stats_type]
        if (!statsType) {
            return tHttp.res({
                error: 'Invalid stats type field stats_type, choose one of the valid_types',
                valid_types: STATS_TYPE
            })
        }

        const params = body.params || {}
        var data
        switch (body.stats_type) {
            case 'severity':
                data = await insights.audit.severity(user, params)
                break
            case 'issues':
                data = await insights.audit.issues(user, params)
                break
            case 'services':
                data = await insights.audit.services(user, params)
                break
        }

        return tHttp.res({
            success: true,
            result: data

        })
    } catch (e) {
        console.log(e)
        return {
            statusCode: e.code || 500,
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
// module.exports.stats = async function (event, context) {
//     console.log(event)
//     try {
//         const user = auth.getUser(event)
//         const body = JSON.parse(event.body)
//         if (!body.stats_type) {
//             return tHttp.res({
//                 error: 'Missing stats type field stats_type, choose one of the valid_types',
//                 valid_types: STATS_TYPE
//             })
//         }
//         const statsType = STATS_TYPE[body.stats_type]
//         if (!statsType) {
//             return tHttp.res({
//                 error: 'Invalid stats type field stats_type, choose one of the valid_types',
//                 valid_types: STATS_TYPE
//             })
//         }

//         const params = body.params || {}

//         var results = await insights.audit.totals(user, params)

//         return tHttp.res({
//             success: true,
//             result: results
//         })
//     } catch (e) {
//         return {
//             statusCode: e.code,
//             body: JSON.stringify(e),
//         }
//     }
// }

module.exports.recommend = async function (event, context) {
    try {
        const user = auth.getUser(event)
        const body = JSON.parse(event.body)
        var findings = await audit.get.findings(user)
        //TODO: parse all future rulesets and make this generic, but for now we just do basic ruleset
        var result = await insights.recommend.get(findings)

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