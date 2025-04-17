var userController = require("../../app/controllers/UserController.js");
var express = require('express');
var bodyParser = require('body-parser');
var auth = require("../../app/utils/auth.js");
var userAuth = require("../../app/auth/user")
var mfa = require("../../app/controllers/MFAController.js");

var router = express.Router();
var myUser = userController();

//Body Parser required to use json and other body data sent in request
//router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
myUser.init();

// define the home  route
router.get('/', function (req, res) {
    res.send('Users API Documentation');
});

/**
 * Get account details
 */
router.get('/account', auth, async function (req, res) {
    try {
        if (req.auth_userid) {
            const result = await myUser.getUserByID(req.auth_userid);
            res.json(result);
        }
        else {
            console.log("User authenticated (id: " + req.auth_userid + "), but not authorised to retrieve details for user id: " + req.params.id);
            throw {
                code: 401,
                message: "Not Authorised"
            };
        }
    } catch (e) {
        console.log(e)
    }

});

/**
 * Verify a new email if it doesn't exist
 * This is step 1 in a process for adding a new user to 
 * the V2 App
 * 
 * @author: Ben Fellows <ben@teemops.com>
 * @params:
 * code
 * 
 */
router.post('/verify', async function (req, res) {
    try {
        const provideCode = await userAuth().provide(req.body.email, req.body.code, req.body.password);
        res.json({ result: provideCode })
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

/**
 * @author: Ben Fellows <ben@teemops.com>
 * @description: add a user
 * @usage: request data needs to include fields:
 * {
 *  "email"
 * }
 * 
 */
router.put('/', async function (req, res) {

    try {
        const result = await myUser.addUser(req.body);
        res.json({
            success: true
        });
    } catch (e) {
        res.status(500).send({ error: e });
    }

});


router.post('/confirm/', async function (req, res) {
    try {
        const result = await myUser.confirmUser(req.body);
        res.json({ status: result });
    } catch (e) {
        console.log(e);
        res.json({ status: `error ${e}` });
    }

});

router.get('/check/:user?', async function (req, res) {
    try {
        const result = await myUser.doesUserExist(req.params);
        res.json({ result });
    } catch (e) {
        console.log(e);
        res.json({ error: "Unknown error" });
    }
});

/**
 * @author: Ben Fellows
 * @description: Generate a unique code and stsexternalId for adding a new AWS Account via CloudFormation
 * @usage: request header needs to include userid and auth token
 * GET /<api_base>/generate
 */
router.get('/generate', auth, async function (req, res) {
    try {
        //get a unique code that can be used for launching the new AWS account link
        var stsExternalId = await userAuth().code();

        //get users unique GUID when they signed up, this can never be changed and is tied to aws account ownership.
        if (req.auth_userid) {
            const result = await myUser.getUserByID(req.auth_userid);
            var response = {
                uniqueId: result.uniqueId,
                externalId: stsExternalId
            }
            res.json(response);
        }
        else {
            throw "Not authorised";
        }

    } catch (e) {
        res.json({ error: e });
        console.log(e);
    }
});

/**
 * @author: Ben Fellows
 * @description: get keys for userid
 * @usage: request header needs to include userid and auth token
 * GET /<api_base>/users/:id
 */
router.get('/keys', auth, async function (req, res) {
    try {
        var result = await myUser.listKeys(req.auth_userid)
        if (result != null) {
            res.json({ data: result });
        } else {
            res.json({ error: 'Key returned no results' })
        }

    } catch (e) {
        res.json({ error: "Couldn't get key" });
        console.log(e);
    }
});

/**
 * @author: Ben Fellows
 * @description: Download a specific key
 * @usage: request header needs to include userid and auth token
 * GET /<api_base>/users/key/:accountid/:region
 */
router.get('/key/:accountid/:region', auth, async function (req, res) {
    const fileName = `${req.params.accountid}-${req.params.region}-teemops-${req.auth_userid}.pem`
    try {
        var result = await myUser.getKey(req.auth_userid, req.params.region, req.params.accountid)
        if (result != null) {

            res.setHeader('Content-Length', result.length);
            res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            res.write(result, 'binary');
            res.end();

        } else {
            res.json({ error: 'Key returned no results' })
        }

    } catch (e) {
        res.json({ error: "Couldn't get key" });
        console.log(e);
    }

});

/**
 * @author: Ben Fellows
 * @description: Download a specific key using POST
 * @usage: request header needs to include auth token
 * POST /<api_base>/users/key
 * {
 *  awsAccountId: 1234567891012,
 *  region: ap-southeast-2
 * 
 * }
 */
router.post('/key', auth, async function (req, res) {
    const fileName = `${req.body.awsAccountId}-${req.body.region}-teemops-${req.auth_userid}.pem`
    try {
        var result = await myUser.getKey(req.auth_userid, req.body.region, req.body.awsAccountId)
        if (result != null) {

            res.setHeader('Content-Length', result.length);
            res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            res.write(result, 'binary');
            res.end();

        } else {
            res.json({ error: 'Key returned no results' })
        }

    } catch (e) {
        res.json({ error: "Couldn't get key" });
        console.log(e);
    }

});

/**
 * @author: Sarah Ruane
 * @description: retrieve user by id (authenticated)
 * @usage: request header needs to include userid and auth token
 * GET /<api_base>/users/:id
 */
router.get('/:id?', auth, async function (req, res) {

    //This check is to ensure that logged in users can only retrieve their own user details
    //This will likely change in the future if a partner user needs to access details of their clients
    if (req.auth_userid == req.params.id) {
        const result = await myUser.getUserByID(req.auth_userid);
        res.json(result);
    }
    else {
        console.log("User authenticated (id: " + req.auth_userid + "), but not authorised to retrieve details for user id: " + req.params.id);
        res.json({ err: "Not authorised" });
    }
});

router.post('/login', async function (req, res) {
    try {
        const result = await myUser.loginUser(req.body);
        //check mfa is required.
        if (result.status == true) {
            const checkMFAEnabled = await mfa.check(result.token)
            if (checkMFAEnabled == true) {
                if (req.body.otp == null) {
                    res.json({ status: false, mfa: true, message: 'MFA Required' })
                } else {
                    const validateMFA = await mfa.validate(result.token, req.body.otp)
                    if (validateMFA == true) {
                        res.json({ status: true, token: result.token })
                    } else {
                        res.status(401)
                        res.json({ status: false, mfa: true, message: 'MFA Failed' })
                    }
                }
            } else {
                res.json({ status: true, token: result.token, mfa: false })
            }
        } else {
            res.status(401)
            res.json({ status: false, message: 'Login Failed' })
        }

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Internal Application Error' });
    }
});

router.post('/reset', async function (req, res) {
    try {
        const sendCode = await userAuth().reset(req.body.email)
        res.json(sendCode)
    } catch (e) {
        res.status(500).send({ error: e });
    }

});

router.post('/reset/code', async function (req, res) {
    try {
        const provideCode = await userAuth().provide(req.body.email, req.body.code, req.body.password)
        if (provideCode) {
            res.json({ result: provideCode })
        }

    } catch (e) {
        res.status(e.status || 500).send({ error: e });
    }

});

/**
 * Add new Subscription
 */
router.post('/subs', auth, async function (req, res) {
    try {
        const result = await myUser.addSubscription(req.auth_userid, req.body.checkout_id)
        res.json({ result: true })
    } catch (e) {
        res.status(403).send({ error: e });
    }

});

/**
 * Check a cart/payment session and get customer details.
 */
router.post('/cart', async function (req, res) {
    try {
        const result = await myUser.getCartCustomer(req.body.checkout_id)
        res.json({ result: result })
    } catch (e) {
        res.status(403).send({ error: e });
    }

});

module.exports = router;
