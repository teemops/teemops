const audit = require('../../audit')

const run = async function (callback) {
    try {
        console.log(process.argv)
        var event = {
            Records: [
                {
                    messageId: '7b3b61ef-9c41-49aa-9df5-1a8466ffa627',
                    receiptHandle: 'qLrMXkBrEhm/WqLPHjRP5Sf9/1icrrWnMDMC6ogX9xCcwlV7AZblOWPERMcaP2Yu02/kOHaMR6/K4kNqneqzoUSnwr47JJ5GPwyJht4vZb8VFjlEIGSzdQGU5TcoKdAwCEZ9kit+my2lU+iY5Z/clIgUOy8gdHzon3Gl84uBArn0Wps3zOvX0xl7RUg2loCc7MghdM1gQyeiIr9yBwm47g+hXcVBurgbBGjq5x8E0sWCrETnRpAX879QPaDYhlucaYFr+SIG1Plwn6/+RY/zD1O9iHmQH7g4Ha/fqbU5o5GF5XJcGGVqa3gBprBIJO/sluRakzje0TJWMtgY7oJ0XALrsRHwxfy/442hOLZk7HBQ==',
                    body: '{"audit_scan_id":12,"user_cloud_provider_id":2,"user_id":5,"audit_type":2,"task":"ec2","region":"ap-southeast-2"}',
                    attributes: [Object],
                    messageAttributes: [Object],
                    md5OfBody: '930faa21f4bafaee6d932999ab676146',
                    md5OfMessageAttributes: 'a89839651512727f708b9884f5f68825',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-west-2:123456789101:teemops_audit_region',
                    awsRegion: 'us-west-2'
                }
            ]
        }

        const results = await audit.scanRegion(event, null)
        console.log(results)
        callback(null, results)
    } catch (e) {
        console.log('Error is: ' + e)
        throw e
    }
}
run(function (err, data) {
    if (err) console.log(err)

    console.log(data)
})