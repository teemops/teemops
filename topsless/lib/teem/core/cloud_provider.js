/**
 * Gets a user cloud provider object
 */
const db = require('../../../drivers/mysql')

module.exports.get = get

async function get(userId, userCloudProviderId) {
    try {
        var sql = "CALL sp_getSTSCredsUserAccount(?, ?, ?)";
        const params = [userId, userCloudProviderId, 'audit']

        const sqldata = await db().getRow(sql, params)
        if (sqldata.length) {
            var result = {
                RoleArn: JSON.parse(sqldata[0].authData).arn,
                externalId: sqldata[0].externalId,
            };
            return result
        } else {
            return null
        }


    } catch (e) {
        throw e
    }
}