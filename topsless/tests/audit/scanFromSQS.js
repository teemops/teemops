const audit = require('../../audit')

const run = async function (callback) {
    try {
        
        console.log(process.argv)
        var event = {
            Records: [
                {
                    messageId: '57aa4cd1-7871-40c5-8261-0e24e57b1173',
                    receiptHandle: 'gUajgnfNtn75KR2h7/k/oOmiQw21uAW6rIjwUR/2UdAPYZ2m1uPjXKo3Ytuym6L+tKvQKtlcy15UylJmjrOHCKkcEDLjeNC7BNIGljOv1TSbulhNq4wG7AwiOyOTgRvyY8Wl1YjyOo5DsKBBQ1YeuhRjwvD2NzLjyTEeGCzLAvRbIJZw05tV6WS7BdMYlRUZIMQrCncmDTJQ+Y0lT4gTRbsaRHsmcf+pKcbejOqEXBV3QzjlqMmDWs6QCTX7lLPHFnKytE4mrI0ICkQuNJvj8nXhCrO36yehn/kUEtJKyPkCdGF9AD0NV1vtDnqkJpllsrdBblmWo8DcP9N2zPr4WfnHXGlVlQgEcdXlFAlX2Oa/8HniKV88/Q==',
                    Body: '{"audit_scan_id":2}',
                    attributes: [Object],
                    messageAttributes: [Object],
                    md5OfMessageAttributes: 'b4c49dc2bfece205e219bae6f28346bd',
                    md5OfBody: '06b6e5e0d6a3d4826e3fe79571a6f7fc',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-west-2:123456789101:teemops_audit',
                    awsRegion: 'us-west-2'
                }
            ]
        }

        const results = await audit.scan(event, null)
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