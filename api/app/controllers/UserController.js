var config = require('config-json');
config.load('./app/config/config.json');

var mysql = require("../../app/drivers/mysql.js");
var mail = require("../../app/drivers/mail.js");
var stripe = require("../../app/drivers/stripe.js");

var jwtController = require("../../app/controllers/JWTController.js");
var keyController = require("../../app/controllers/KeyController");
var log = require('../drivers/log.js');

var util = require('util');

var express = require('express');
var mydb = mysql();
var myEmail = mail();
var myJWT = jwtController();
var router = express.Router();

const CODE_TIME_EXPIRY = 15;
const PASSWORD_LENGTH = {
    min: 8,
    max: 25
}

var password = require('../../app/auth/password')
var pass = password(config)
var userAuth = require('../../app/auth/user')
var user = userAuth(config)
var payments = stripe(config)

myEmail.init(config);
var key = keyController(config);

module.exports = function () {
    return {
        init: function init() {

        },
        listKeys: async function listKeys(userId) {
            const result = await key.list(userId);
            return result;
        },
        getKey: async function getKey(userId, region, awsAccountId) {
            const result = await key.get(userId, region, awsAccountId);
            return result;
        },
        getUserByUniqueId: async function (uniqueId) {
            try {
                var sql = "SELECT userid FROM user WHERE uniqueid=?";
                var params = [uniqueId];
                const result = await mydb.queryPromise(sql, params);
                if (result != undefined && result.length > 0) {
                    return result[0].userid;
                } else {
                    return null;
                }
            } catch (e) {
                throw e;
            }
        },
        getUserByID: async function getUserByID(id, cb) {

            try {
                var sql = "CALL sp_getUserById(?)";
                var params = [id];

                //query database with sql statement and return results or error through callback function
                const result = await mydb.getRow(sql, params);
                return result;
            } catch (e) {
                throw e
            }

        },

        doesUserExist: async function exists(data, cb) {
            var sql = "SELECT count(*) as count FROM user WHERE email = ? OR username = ?";

            var params = [data.user, data.user];
            console.log("Emailusername:" + data.user);

            try {
                var results = await mydb.queryPromise(sql, params);
                if (results != null) {
                    if (results[0].count > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } catch (e) {
                throw e;
            }



        },

        loginUser: async function loginUser(data) {

            var sql = "SELECT userid, uniqueid as guid, username, status FROM user WHERE email = ? AND password = MD5(?)";
            var params = [data.email, pass.create(data.password)];
            try {
                const results = await mydb.queryPromise(sql, params);
                if (results != null) {

                    if (results.length == 1) {
                        if (results[0].status == 1) {
                            var jwtPayload = {
                                guid: results[0].guid,
                                userid: results[0].userid,
                                username: results[0].username,
                                email: data.email,
                                role: 'user'
                            };
                            //TODO: Update this function to handle different roles, by now default role is user role.
                            var jwtToken = await myJWT.createJWT(jwtPayload);

                            return {
                                token: jwtToken,
                                status: true
                            };
                        } else {
                            return {
                                status: false
                            }
                        }
                    } else {
                        return {
                            status: false
                        }
                    }

                } else {
                    return {
                        status: false
                    }
                }

            } catch (e) {

            }


        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: Adds new user
         * @usage: request data needs to match schema
         * Lot's TODO
         */
        addUser: async function addUser(data) {

            try {
                var defaultStatus = 0; //disabled by default
                var timeNow = Date.now();
                var timeIn15Mins = new Date(timeNow + CODE_TIME_EXPIRY * 60000).getTime()
                var confirmCode = user.random();
                var randomPass = pass.create(pass.confirm(data.email + confirmCode));
                var uniqueId = user.guid();

                var sql = "INSERT INTO user(email, username, password, status, timestamp, temp_code, temp_code_expiry, uniqueid)";
                sql += " VALUES(?, ?, MD5(?), ?, ?, ?, ?, ?)";
                var params = [
                    data.email,
                    data.email,
                    randomPass,
                    defaultStatus,
                    timeNow,
                    confirmCode,
                    timeIn15Mins,
                    uniqueId
                ];
                const results = await mydb.insertPromise(sql, params);
                if (results != null) {
                    await sendConfirmEmail(results);
                    return true;
                }
            } catch (e) {
                if (e.code != null) {
                    switch (e.code) {
                        case 'ER_DUP_ENTRY':
                            throw log.EXCEPTIONS.duplicate;
                            break;
                        default:
                            throw e;
                    }
                } else {
                    throw e;
                }
            } finally {

            }

            async function sendConfirmEmail(results) {
                var subject = "Please confirm your Teem Ops Registration";
                var message = `
                <p>Welcome to Teemops,</p>
<p>Please enter the 6 digit below into the signup form:</p> 
<p>${confirmCode}</p>
<br/>
<p>Thanks,</p>
<p>support@teemops.com</p>
                `;
                try {
                    const send = await myEmail.sendEmailAsync(data.email, subject, message);
                    if (send != null) {
                        console.log('Confirmation code sent');
                    } else {
                        throw "Message was not sent: NULL result"
                    }
                } catch (e) {
                    throw e;
                }
            };

        },
        updateUser: function updateUser(authUserid, data, cb) {
            var sql = "UPDATE user SET first=?, last=? where userid=?";
            var params = [
                data.first,
                data.last,
                authUserid
            ];

            //insert query with sql, parameters and retrun results or error through callback function
            mydb.update(
                sql, params,
                function (err, results) {
                    if (err) throw err;

                    if (results != null) {
                        console.log(results);
                        cb({
                            result: results
                        });
                    } else {
                        cb({
                            error: "update_error"
                        });
                    }
                }
            );
        },
        checkNewCode: async function (email, code) {
            var sql = "select count(*) from user where email=? AND confirmcode=? and confirmcode IS NOT NULL";

            var params = [
                email,
                code
            ];

            try {
                const check = await mydb.getRow(sql, params);

            } catch (e) {
                throw `Code doesn't exist or has expired.`
            }
        },
        confirmUser: async function confirmUser(data) {
            var timeNow = Date.now()
            var sql = "UPDATE user set status=1, confirmcode=null,temp_code_expiry=null, password=MD5(?) WHERE temp_code_expiry>? AND email=? AND temp_code=? and temp_code IS NOT NULL";
            var newPassword = data.password;
            var params = [
                pass.create(newPassword),
                timeNow,
                data.email,
                data.code
            ];

            try {
                if (newPassword.length < PASSWORD_LENGTH.min && newPassword.length > PASSWORD_LENGTH.max) {
                    throw `Password length was not between ${PASSWORD_LENGTH.min} and ${PASSWORD_LENGTH.max} characters long. Please enter a new password.`
                }
                const update = await mydb.updatePromise(sql, params)
                if (update) {
                    return true;
                } else {
                    throw 'Code has expired, you will need to perform another reset'
                }
            } catch (e) {
                return e
            }

        },
        addSubscription: async function addSubscription(userId, checkoutId) {
            try {
                var timeNow = Date.now();
                var sessionDetails = await payments.getSessionDetails(checkoutId);
                if (sessionDetails.payment_status != undefined && sessionDetails.payment_status == "paid") {
                    var sql = `INSERT INTO user_sub(userid, stripe_sub_id, stripe_customer_id, stripe_session_id, sub_status, timestamp)
                    VALUES(?, ?, ?, ?, ?, ?)`;

                    var params = [
                        userId,
                        sessionDetails.subscription,
                        sessionDetails.customer,
                        checkoutId,
                        1,
                        timeNow
                    ];
                    const results = await mydb.insertPromise(sql, params);
                    if (results != null) {
                        return results;
                    }
                } else {
                    throw "Payment was not succesful";
                }

            } catch (e) {
                throw e;
            }

        },
        /**
         * Checks status of a cart and if payment was succesful or not.
         * 
         * If succesful we return some payment data including email address which is used for 
         * passing to new registration process.
         * 
         * @param {*} checkoutId 
         */
        getCartCustomer: async function getCartCustomer(checkoutId) {
            try {
                var sessionDetails = await payments.getSessionDetails(checkoutId);
                if (sessionDetails.payment_status != undefined && sessionDetails.payment_status == "paid") {
                    return sessionDetails.customer_details;
                } else {
                    throw "Payment was not succesful";
                }
            } catch (e) {
                throw e;
            }
        }
    }
};