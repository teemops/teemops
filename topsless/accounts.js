const tHttp = require('./lib/teem/http')
const db = require('./drivers/mysql')
const crypto = require('./drivers/crypto')
const axios = require('axios')

/**
 * Generate unique account Identifier and then create placeholder
 * with email address provided by customer
 * then register user
 * and then send 
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.generateCode = async function (event, context) {

    try {
        const newKey = await crypto()
        const newPass = await crypto()
        //add new user
        const body = JSON.parse(event.body)
        const params = [body.email, newPass, newKey]
        //const signup = await signup(body.email, newPass)


        return tHttp.res({
            key: newKey
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }

}

async function signup(email, password) {
    try {

        var defaultStatus = 0; //disabled by default
        var timeNow = Date.now();
        var confirmCode = pass.confirm(data.username + data.email + timeNow);
        var sql = "INSERT INTO user(email, username, password, status, timestamp, confirmcode, first, last)";
        sql += " VALUES(?, ?, MD5(?), ?, ?, ?, ?, ?)";

        var params = [
            email,
            email,
            pass.create(password),
            defaultStatus,
            timeNow,
            confirmCode,
            data.first,
            data.last
        ];

        if (result) {

        } else {

        }
    } catch (e) {
        throw `Error registering user ${e}`
    }
}
