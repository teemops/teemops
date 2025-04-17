const tips = require('./rules/tips.json')
const allRecommendations = tips.recommendations

module.exports.get = get

/**
 * Parses a list of findings and returns a list of recommendations
 * and a summary of how many instances of each finding there are
 * and the resource names
 * 
 * @param {*} findings 
 */
async function get(findings) {

    try {
        //loop through findings and get the recommendations
        var recommendations = []

        findings.forEach(finding => {
            if (!finding.passed) {
                var matchingRecs = allRecommendations.filter(rec => {
                    const recTask = rec.rules.filter(rule => {
                        return rule == finding.rule
                    })
                    return recTask.length > 0
                })

                matchingRecs.forEach(rec => {
                    //if recommendation already exists, add the finding to it
                    var existingRec = recommendations.filter(r => {
                        return r.name == rec.name
                    })
                    var risk = finding.severity == 'high' ? 3 : finding.severity == 'medium' ? 2 : 1
                    if (existingRec.length > 0) {
                        existingRec[0].risk += risk
                        existingRec[0].findings.push(finding)
                    } else {
                        recommendations.push({
                            ...rec,
                            risk: risk,
                            findings: [finding],
                        })
                    }


                })
            }
        });

        return recommendations
    } catch (e) {
        throw e
    }
}