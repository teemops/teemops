
const crypto = require('crypto');

function init(appConfig) {
    config = appConfig;

    return {
        create: createPassword,
        confirm: createConfirmCode,
        generate: generateCode
    }
}
/**
         * TODO: 
         * This needs minimum scrypt functionality found in https://github.com/barrysteyn/node-scrypt
         * 
         * TODO:
         * This needs to be moved to a security driver - potentially using
         * an internal OS provided library (scrypt C++ implementation)
         * or external KMS type service, which has
         * more robust protecion and means secret will be not stored on OS, only
         * available in protected memory for app as required. 
         * 
         * TODO:
         * At the moment this is not the best place
         * to have a function that handles security - would be too easy for 
         * someone to accidentally make a change and then do a PR that
         * causes this to be overlooked as part of that PR.
         * @param {*} str 
         */
function createPassword(str) {
    var hash = crypto.createHmac('sha256', process.env.SECRET)
        .update(str)
        .digest('hex');
    return hash;
}

function createConfirmCode(str) {
    var hash = crypto.createHmac('sha256', process.env.CONFIRM_SECRET)
        .update(str)
        .digest('hex');
    return hash;
}

/**
 * Generates a code that can be used in various places including AWS Account linking.
 * 
 * @returns 
 */
function generateCode() {
    const key = crypto.createHash("sha256").update(crypto.randomBytes(50)).digest()
    const generated = crypto.createHmac('sha256', process.env.SECRET)
        .update(key.toString('hex'))
        .digest('hex');
    
    return generated
}


module.exports = init;