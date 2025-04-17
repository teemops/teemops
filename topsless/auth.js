//custom lambda authorizer
const auth = require('./lib/teem/auth/user')
const tHttp = require('./lib/teem/http')

module.exports.handler = async (event, context) => {
    try {
        const result = await auth.authorize(event, context);
        return result;
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }
}

/**
 * Pass in event such as:
 * {
 *      token: "..."
 * }
 * @param {*} event 
 * @param {*} context 
 * @returns boolean or JWT Specific Error
 */
module.exports.verify = async (event, context) => {
    try {
        console.log(JSON.stringify(event))
        const body = JSON.parse(event.body)
        const values = await auth.verify(body.token);
        if (values.email) {
            return tHttp.res({
                success: true,
                details: values
            });
        } else {
            return tHttp.res({
                success: false
            });
        }

    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }
}

