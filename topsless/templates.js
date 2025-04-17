const tHttp = require('./lib/teem/http')
const db = require('./drivers/mysql')


/**
 * List OS templates available in teemops
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.list = async function (event, context) {

    try {
        var result = await db().queryPromise(
            `SELECT id, name, type, description,aws_account_id,aws_ami_name as pattern,
            connect_user,connect_type from app_provider 
            WHERE enabled=? 
            AND type=? 
            ORDER BY type, name`,
            [1, 'blank'])
        return tHttp.res({
            templates: result
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }

}


