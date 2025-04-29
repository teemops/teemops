var nodemailer = require('nodemailer');

var transporter = null;

var config, auth_host, auth_user, auth_pass;

module.exports = function () {
    return {
        init: function init(appConfig) {
            config = appConfig;
            auth_host = process.env.SMTP_HOST;
            if (auth_host=="maildev" || process.env.SMTP_USER=="") {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                transporter = nodemailer.createTransport({
                    host: auth_host,
                    port: 1025,
                    secure: false, // true for 465, false for other ports
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            }else {
                transporter = nodemailer.createTransport('smtps://' + process.env.SMTP_USER + ':' + process.env.SMTP_PASS + '@' + process.env.SMTP_HOST);
            }

        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: Send email
         */
        sendEmail: function sendEmail(to, subject, message, callback) {

            // setup e-mail data with unicode symbols 
            var mailOptions = {
                from: auth_user, // sender address 
                to: to, // list of receivers 
                subject: subject, // Subject line 
                text: message, // plaintext body 
                html: message // html body 
            };

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    callback(error, null)
                } else {
                    console.log('Message sent: ' + info.response);
                    callback(null, true)
                }

            });

        },
        /**
         * Send email Promise<>
         * @param {*} to 
         * @param {*} subject 
         * @param {*} message 
         * @param {*} callback 
         */
        sendEmailAsync: function sendEmailAsync(to, subject, message) {

            try {

                // setup e-mail data with unicode symbols 
                var mailOptions = {
                    from: auth_user, // sender address 
                    to: to, // list of receivers 
                    subject: subject, // Subject line 
                    text: message, // plaintext body 
                    html: message // html body 
                };
            } catch (e) {
                throw e;
            }

            return new Promise(function (resolve, reject) {
                // send mail with defined transport object 
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                        resolve(true);
                    }
                });
            })
        },

    }
};