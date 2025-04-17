var stripeLib = require('stripe')
var stripe;

module.exports = function (appConfig) {
    config = appConfig;
    stripeKey = process.env.STRIPE_KEY;
    stripe = stripeLib(stripeKey);
    return {
        getSessionDetails: getSessionDetails
    }
}

/**
 * Gets session from shopping cart
 * 
 * @param {string} stripeSessionId the provided sessionid which has cart/checkout details.
 * @returns {boolean} true or false
 */
async function getSessionDetails(stripeSessionId) {

    try {
        const stripeCheckout = await stripe.checkout.sessions.retrieve(stripeSessionId);

        return stripeCheckout;

    } catch (e) {
        throw e;
    }

}

