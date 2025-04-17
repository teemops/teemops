const shared = require('../shared/scan');
//get definition
const rules = require('./rules');
(async () => {
    shared.set('Route53')
})();
module.exports = shared;
module.exports.rules = rules;
