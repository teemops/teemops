
const ERROR_CODE_NOKEYPAIR = 'InvalidKeyPair.NotFound';
const KEY_S3_PATH = "customer/keys/";
var ec2 = require("../../app/drivers/ec2");
var stsDriver = require("../../app/drivers/sts");
var s3Driver = require("../../app/drivers/s3");
var kmsDriver = require("../../app/drivers/kms");
var resourceController = require("../controllers/ResourceController");

var config, ec2, sts, s3, kms, defaultKeyName, keyBucket;
var resource = resourceController();
function init(appConfig) {
    config = appConfig;
    sts = stsDriver(appConfig);
    kms = kmsDriver(appConfig);
    s3 = s3Driver(appConfig);
    resource = resourceController();
    defaultKeyName = config.get("kms", "defaultKeyName");
    keyBucket = process.env.S3_KEY_STORE;

    return {
        create: createEc2Key,
        check: checkEc2KeyExists,
        get: getEc2Key,
        list: listEc2Keys
    }
}

/**
 * Creates Ec2 KeyPair for a given account and region labelling as current teemops userid.
 * Returns PEM file which needs to be added to the KMS store
 * 
 * @param {*} userId 
 * @param {*} region 
 * @param {*} userCloudProviderId 
 * @param {*} awsAccountId
 */
async function createEc2Key(userId, region, userCloudProviderId, awsAccountId) {

    var keyName = "teemops-" + userId;
    var keyPairParams = {
        KeyName: keyName
    };

    try {
        const key = await resource.ec2Task(userId, userCloudProviderId, 'createKeyPair', keyPairParams, region);

        //now get the unencrypted KeyMaterial(PEM key unencrypted)
        if (key != null) {
            const encrypted = await kms.encrypt(defaultKeyName, key.KeyMaterial);
            var objectPath = createKeyObjectPath(userId, awsAccountId, region, keyName);
            const savedS3 = await s3.save(objectPath, keyBucket, encrypted);
            if (savedS3) {
                return true;
            } else {
                var error = 'EC2 Key Pair was not saved to S3';
                throw error;
            }
        } else {
            return null;
        }
    } catch (e) {
        throw e;
    }
}

function createKeyObjectPath(userId, awsAccountId, region, keyName) {
    return KEY_S3_PATH + userId + "/" + awsAccountId + "/" + region + "/" + keyName + ".pem";
}

/**
 * Returns unencrypted key
 * 
 * @param {*} userId 
 * @param {*} region 
 * @param {*} RoleArn 
 */
async function getEc2Key(userId, region, awsAccountId) {
    var keyName = "teemops-" + userId;
    var objectPath = createKeyObjectPath(userId, awsAccountId, region, keyName);
    try {
        const savedS3 = await s3.read(objectPath, keyBucket);
        const decrypted = await kms.decrypt(savedS3);
        if (decrypted) {
            return decrypted.toString();
        } else {
            var error = 'EC2 Key Pair was not found in S3';
            throw error;
        }
    } catch (e) {
        throw e;
    }
}

/**
 * Returns list of key names for EC2 Key Pairs
 * 
 * @param {*} userId 
 * @param {*} region 
 * @param {*} RoleArn 
 */
async function listEc2Keys(userId) {
    var prefixPath = KEY_S3_PATH + userId;
    try {
        //list objects under customer id
        const items = await s3.list(prefixPath, keyBucket);
        if (items) {
            return items.Contents.map(function (value) {
                var newKey = value.Key.split('/');
                return {
                    account: newKey[3],
                    region: newKey[4],
                    item: `${newKey[3]}-${newKey[4]}-${newKey[5]}`
                };
            });
        } else {
            return null;
        }

    } catch (e) {
        throw e;
    }
}

/**
 * Checks if EC2 key pair exists for given account, region and teemops user
 * 
 * @param {*} userId 
 * @param {*} region 
 * @param {*} userCloudProviderId 
 */
async function checkEc2KeyExists(userId, region, userCloudProviderId) {
    const keyPairParams = {
        KeyNames: [
            "teemops-" + userId
        ]
    };

    try {
        const keys = await resource.ec2Task(userId, userCloudProviderId, 'describeKeyPairs', keyPairParams, region);

        return keys.KeyPairs.length > 0;
    } catch (e) {
        if (e.code == ERROR_CODE_NOKEYPAIR) {
            return false;
        }
        throw e;
    }
}
module.exports = init;