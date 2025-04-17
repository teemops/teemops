var AWSEC2 = require('aws-sdk');
var jms = require('jmespath');
const tHttp = require('./lib/teem/http')
const db = require('./drivers/mysql')
const awsLib = require('lib/teem/aws/generic')

/**
 * Provides AMI details - Uses POST Request
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.view = async function (event, context) {

    try {
        const body = JSON.parse(event.body)
        const params = [body.cloud_provider, body.region, body.app_provider]
        var result = await db().queryPromise(`
        SELECT image_id as ami 
        FROM app_provider_image_list  
        WHERE cloud_provider_id=? AND 
        region=? 
        and app_provider_id=?
        order by timestamp desc
        LIMIT 1
        `, params)
        return tHttp.res({
            amis: result[0]
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }

}

/**
 * Searches for an AMI - uses GET Request
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.search = async function (event, context) {

    try {
        const body = event.queryStringParameters
        const params = [body.q]
        var result = await db().queryPromise('SELECT id, name, description,aws_account_id,aws_ami_name as pattern,connect_user,connect_type from app_provider WHERE enabled=1 and type=?', params)
        return tHttp.res({
            templates: result
        })
    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }

}

/**
 * Updates AMIs
 *
 * @param {*} event 
 * @param {*} context 
 */
module.exports.update = async function (event, context) {
    AWSEC2.config.update({
        region: 'us-west-2'
    })
    var ec2Client = new AWSEC2.EC2();
    console.log('Starting update to AMIs')
    try {
        var sqlParams = ['blank', 1]
        var providers = await db().queryPromise('SELECT * from app_provider where type=? and enabled=?', sqlParams)
        console.log(JSON.stringify(providers))
        const regions = await ec2Task('describeRegions', null, ec2Client)
        console.log(JSON.stringify(regions))
        //loop
        regions.Regions.forEach(async r => {
            console.log("--------------------------------------------")
            console.log("---------START REGION IMPORT AMI DATA-------")
            console.log("--------------------------------------------")
            console.log(`Region: ${r.RegionName}`)
            AWSEC2.config.update({
                region: r['RegionName']
            })
            var regionClient = new AWSEC2.EC2()
            providers.forEach(async p => {
                var amiId = await getEc2ImageId(regionClient, p.aws_account_id, p.aws_ami_name)

                if (amiId == null) {
                    console.log(`No ami found for ${p.aws_ami_name}`)
                } else {
                    console.log(`Image Data: ${amiId} ${r['RegionName']} ${p.name}`)
                    if (!await sImageExist(r.RegionName, amiId, 1)) {
                        var params = [
                            amiId,
                            1,
                            r.RegionName,
                            p.id,
                            Date.now()
                        ]
                        var newId = await db().insertPromise(`
                        INSERT INTO app_provider_image_list (image_id, cloud_provider_id, region, app_provider_id, timestamp)
                        VALUES(?,?,?,?,?)`, params);
                    }

                }
            })

        })
        // ).then(function (result) {

        //     return tHttp.res({
        //         templates: result
        //     })
        // }).catch(function (error) {
        //     console.log(error)
        // })

    } catch (e) {
        return {
            statusCode: e.code,
            body: JSON.stringify(e),
        }
    }

}

async function getAmiIds() {

}

async function getEc2ImageId(client, owner, search) {
    const params = {
        ExecutableUsers: ['all'],
        Filters: [
            {
                Name: 'name',
                Values: [
                    search
                ]
            },
            {
                Name: 'state',
                Values: [
                    'available'
                ]
            }
        ],
        Owners: [owner]
    }
    const awsImage = await ec2Task('describeImages', params, client)
    if (awsImage.Images !== undefined) {
        const latestImage = awsImage.Images.sort(function (a, b) {
            return new Date(b['CreationDate']) - new Date(a['CreationDate'])
        })

        return latestImage[0]['ImageId']
    } else {
        return null
    }

}

async function sImageExist(region, amiId, cloudProvider = 1) {
    const params = [
        amiId,
        cloudProvider,
        region
    ]
    const count = await db().queryPromise(`
    select count(*) as count from app_provider_image_list
    where image_id=? and cloud_provider_id=? and region=?`,
        params)
    return count[0].count
}

async function ec2Task(task, params = {}, ec2Client) {
    console.log(task)

    if (params == null) {
        params = {}
    }
    console.log(params)
    return new Promise(function (resolve, reject) {

        ec2Client[task](params, function (err, data) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
}
