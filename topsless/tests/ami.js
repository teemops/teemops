const amis = require('../ami')

const run = async function (callback) {
    try {
        var event = {}
        event.body = JSON.stringify({
            region: 'ap-southeast-2',
            cloud_provider: 1,
            app_provider: 13
        })
        const tr = await amis.view(event)
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