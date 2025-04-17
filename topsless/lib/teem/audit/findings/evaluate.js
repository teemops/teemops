const db = require('../../../../drivers/mysql')

/**
 * Evaluate results against a ruleset and return the findings in a format that can be displayed in the UI
 * and also parsed and integrated or understood by 3rd party security tools such as security hub.
 * 
 * @param {*} results | an array of results from a scan
 * @param {*} ruleset 
 * @returns 
 */
module.exports = evaluate
function evaluate(findings, ruleset) {
    try {
        const compliance = []
        if (findings != undefined && findings.length > 0) {
            //check each rule for any compliance success or failures
            ruleset.rules.forEach(rule => {
                const check = checkRule(rule, findings)
                compliance.push(...check)
            })
        }
        return compliance
    } catch (e) {
        throw {
            code: 500,
            message: `${e.message} Stack:  ${e.stack}`
        }
    }
}

function checkRule(rule, findings) {
    try {
        //Matching findings are those that have the same task as the rule method
        var matchingItems = findings.filter(finding => {
            return finding.task == rule.method
        })
        //check each matching item for compliance and return all items with compliant status
        var items = matchingItems.map(item => {
            var complianceItem = checkItem(item, rule)
            complianceItem = {
                ...complianceItem,
                rule: describeRule(rule)
            }
            return complianceItem
        })
        return items
    } catch (e) {
        throw e
    }
}

function checkItem(item, rule) {
    try {
        const r = JSON.parse(item.result)
        var item = {
            ...item,
            compliant: false
        }
        //if the rule is not compliant then return the item
        if (eval(`${rule.condition}`)) {
            item.compliant = false
        } else {
            item.compliant = true
        }
        return item
    } catch (e) {
        throw e
    }
}

function describeRule(rule) {
    try {
        return {
            rule: rule.rule,
            service: rule.service,
            name: rule.name,
            description: rule.description,
            severity: rule.severity,
        }
    } catch (e) {
        return null
    }
}
