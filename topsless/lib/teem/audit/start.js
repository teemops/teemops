/**
 * Start scanning to get results of an audit
 */
const jmespath = require('jmespath')
const db = require('../../../drivers/mysql')

module.exports = start

/**
 * Starts an audit with the scan object and optional rules
 * 
 * @param {*} audit 
 */
async function start(auditDetails, scan, rules, region) {

    try {
        const tasks = rules.tasks
        const service = rules.config.service
        const startTask = rules.config.start.task
        const startTaskId = rules.config.start.id
        const startTaskKey = rules.config.start.key
        const startTaskSelector = rules.config.start.selector || null
        const results = await scan.check({ task: startTask });
        //get object key from rules.config.start.items
        const itemsName = Object.keys(rules.config.start.items)[0]
        const itemKeyName = rules.config.start.items[itemsName][0][startTaskKey]
        var items = []
        console.log(`Results: ${JSON.stringify(results)}`)
        //if selector is defined, use it to filter items
        if (startTaskSelector) {
            const filteredItems = jmespath.search(results, startTaskSelector)
            items = filteredItems
        } else {
            items = results[itemsName]
        }
        for (const item of items) {
            console.log(`Item: ${JSON.stringify(item)}`)

            const promises = []
            //get rules.config.start.items[itemsName][0]

            var result = await db().insertPromise(
                `INSERT INTO audit_results (scan_id, service, task, item, result, region)
            VALUES(?,?,?,?,?, ?)`,
                [auditDetails.id, service, startTaskId, item[itemKeyName], JSON.stringify(item), region])
            promises.push(result)
            if (result) {
                console.log(`Inserted item ${startTaskId}: ${item[itemKeyName]}`)
            } else {
                console.log(`Unable to insert item ${startTaskId}: ${item[itemKeyName]}`)
            }
            //run all actions for this item
            for (const action of rules.config.start.actions) {
                const task = tasks[action]
                const actionResult = await checkAction(task, item, scan, rules.config.defaults, action)
                promises.push(actionResult)
                const saveResult = await saveActionResult(itemKeyName, service, action, item, actionResult, auditDetails.id, region)
                promises.push(saveResult)
            }
            await Promise.all(promises)
            console.log("All promises completed")
        }

        // items.forEach(async function (item) {


        // });
        return true
    } catch (e) {
        console.error(e)
        // throw e
    }

}

/**
 * get params from task
 * Example:
 * params=
 * {
 *  Bucket: 'Name',
 * }
 * item=
 * {
 * Name: 'test-bucket'
 * CreationDate: '2020-01-01T00:00:00.000Z'
 * }
 * @param {*} params 
 * @param {*} item 
 * @returns 
 */
// function getParams(params, item) {
//     const newParams = {}
//     for (const key in params) {
//         const value = params[key]
//         newParams[key] = item[value]
//         // if (value === 'Name') {
//         //     newParams[key] = item[value]
//         // } else {
//         //     newParams[key] = value
//         // }
//     }
//     return newParams
// }
function getParams(params, item) {
    const newParams = params(item)
    return newParams
}


/**
 * Check Action - this does a scan on the action defined in start task
 * 
 * @param {*} task 
 * @param {*} item 
 * @param {*} scan 
 * @param {*} defaults
 * @returns 
 */
async function checkAction(task, item, scan, defaults, action) {

    try {

        const params = getParams(task.params || defaults.actions.params, item)
        const actionResult = await scan.check({ task: action, params: params });
        if (actionResult) {
            return actionResult
        } else {
            return {}
        }


    } catch (e) {
        console.error(e)
        console.log(`Problem processing action ${task.task}`)
        return false
    }


}

async function saveActionResult(itemKeyName, service, action, item, actionResult, scan_id, region) {
    try {

        const result = await db().insertPromise(
            `INSERT INTO audit_results (scan_id, service, task, item, result, region)
        VALUES(?,?,?,?,?, ?)`,
            [scan_id, service, action, item[itemKeyName], JSON.stringify(actionResult), region])

        if (result) {
            console.log(`Inserted item ${action}: ${item[itemKeyName]}`)
        } else {
            console.log(`Unable to insert item ${action}: ${item[itemKeyName]}`)
        }

    } catch (e) {
        console.error(e)
        console.log(`Problem processing action ${service}`)
    }
}

async function saveResults(results, scanId) {
    try {
        const promises = []
        for (const result of results) {
            const promise = db().insertPromise(
                `INSERT INTO audit_results (scan_id, service, task, item, result)
                VALUES(?,?,?,?,?)`,
                [scanId, result.service, result.task, result.item, JSON.stringify(result.result)])
            promises.push(promise)
        }
        await Promise.all(promises)
    } catch (e) {
        throw e
    }
}