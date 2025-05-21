require('dotenv').config() 
const audit = require('./audit')
const awsLib = require('./lib/teem/aws/generic')

var config = {
    region: process.env.AWS_REGION
}

const WAIT_TIME = 500;
const DEFAULT_SQS_VIS_TIMEOUT=30;
const DEFAULT_SQS_WAIT_TIMEOUT=5;

const SQS_QUEUE_NAMES = {
    standard: 'teemops_audit' || process.env.SQS_QUEUE_NAME,
    region: 'teemops_audit_region'
}

const SCAN_OPTIONS = {
    standard: 'scan',
    region: 'scanRegion'
}

var code = 0;
var aws;

const start = async function () {
    var qDetails, qDetailsRegion;
    try {
        aws = await awsLib('SQS', config, false)
        console.log("aws sqsqueue url")
        qDetails = await aws.command({ task: 'getQueueUrl', params: { QueueName: SQS_QUEUE_NAMES.standard } })
        qDetailsRegion = await aws.command({ task: 'getQueueUrl', params: { QueueName: SQS_QUEUE_NAMES.region } })
    } catch (e) {
        console.log("Error getting queue url")
        throw e;
    }
    try {
        await auditService(qDetails, qDetailsRegion);
    } catch (e) {
        console.log(e);
        throw e;
    }

}

start();

const readItems=async function(qUrl, MaxNumberOfMessages=1){
    try {
        const params = {
            task: 'receiveMessage',
            params: {
                QueueUrl: qUrl,
                MaxNumberOfMessages: MaxNumberOfMessages,
                WaitTimeSeconds: DEFAULT_SQS_WAIT_TIMEOUT,
                VisibilityTimeout: DEFAULT_SQS_VIS_TIMEOUT
            }
        };
        return await aws.command(params);
    } catch (e) {
        throw e;
    }
}

const removeMessage=async function(qUrl, message){
    try {
        const params = {
            task: 'deleteMessage',
            params: {
                QueueUrl: qUrl,
                ReceiptHandle: message.ReceiptHandle
            }
        };
        return await aws.command(params);
    } catch (e) {
        throw e;
    }
}

const checkAuditMessages = async function (qDetails,scanOption=SCAN_OPTIONS.standard) {
    //check SQS message
    try {
        const messages = await readItems(qDetails.QueueUrl, 1);
        console.log("aws sqsResult")
        console.log(messages)
        if(messages.Messages) {
            messages.Messages.forEach(async (msg, key) => {
                var event = {
                    Records: [
                        {
                            ...msg,
                        }
                    ]
                }
                const results = await audit[scanOption](event, null)
                //delete message from queue
                const deletedMessage=await removeMessage(qDetails.QueueUrl, msg);
                console.log(`PROCESSED MESSAGE: ${msg.MessageId} from queue ${qDetails.QueueUrl}`)
            }
            )
        }
        else {
            console.log(`${qDetails.QueueUrl} No messages in queue to process yet`)
        }
    }
    catch(e){
        console.log('Error is: ' + e)
        throw e
    }

}

const auditService = async function (qDetails,qRegionDetails) {
    //check SQS message

    try{
        await checkAuditMessages(qDetails);
        await checkAuditMessages(qRegionDetails, SCAN_OPTIONS.region);
    }
    catch(e){
        console.log('Error is: ' + e)
        throw e
    }

}

if (code === 1) {
    console.log('restarting');
}