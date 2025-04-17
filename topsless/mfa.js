//custom lambda authorizer
const auth = require('./lib/teem/auth/user')
const tHttp = require('./lib/teem/http')

module.exports.handler = async (event, context) => {
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