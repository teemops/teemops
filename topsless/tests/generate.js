const accounts = require('../accounts')

const run = async function (callback) {
    try {
        var event = {}
        const tr = await accounts.generateCode(event)
        console.log(tr)
    } catch (e) {
        console.log('Error is: ' + e)
        throw e
    }
}
run(function (err, data) {
    if (err) console.log(err)

    //console.log(JSON.parse(data))
})