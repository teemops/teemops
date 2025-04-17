var userCloudProviderController = require("../../app/controllers/UserCloudProviderController.js");
var security = require('../../app/security/index');
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var userCloudProvider=userCloudProviderController();
const DEFAULT_CLOUD_PROVIDER=1  //AWS

router.use(bodyParser.json());
//Auth middleware for all routes in this view
router.use(security.middleware);

/**
 * @author: Sarah Ruane
 * @description: add new cloud provider account to user's profile (authenticated)
 * @usage: userid, cloudproviderId, awsAccountId, isDefault flag
 * PUT /<api_base>/usercloudproviders
 */
router.put('/', async function(req, res) {

  try{
    const providerParams=req.body;
    const account = await userCloudProvider.addCloudProviderAccount(providerParams);
    res.json(account);
  }catch (e) {
    res.json({ e });
  }
  
});


/**
 * @author: Sarah Ruane
 * @description: remove cloud provider account from user's profile (authenticated)
 * @usage: pass user_cloud_provider_id as param. user id also required for authorisation
 * DELETE /<api_base>/usercloudproviders
 */
router.delete('/:params', function(req, res) {

    var params = JSON.parse(req.params.params);

    //This check is to ensure that logged in users can only update their own user details
    //This will likely change in the future if a partner user needs to access details of their clients
    if(req.auth_userid == params.userId) {

      userCloudProvider.deleteCloudProviderAccount({ userId: params.userId, userCloudProviderId: params.id },
        function (err, result){

          if(result){
            res.json({ success: result });
          }

          if(err) {
            console.log(err);

            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
              res.json({ error: 'FK_ERROR' });
            }
          }
        });
    }
    else {
      console.log("User authenticated (id: " + req.auth_userid + "), but not authorised to update details for user id: " + params.userId);
      res.json({error: "Not authorised"});
    }
});

/**
 * @author: Sarah Ruane
 * @description: update cloud provider account from user's profile (authenticated)
 * @usage: pass user_cloud_provider_id as param. user id also required for authorisation
 * POST /<api_base>/usercloudproviders
 */
router.post('/', function(req, res) {

    //This check is to ensure that logged in users can only update their own user details
    //This will likely change in the future if a partner user needs to access details of their clients
    if(req.auth_userid == req.body.userId) {

      userCloudProvider.updateCloudProviderAccount(req.body,
        function (err, result){

          if(result){
            res.json({ success: result });
          }

          if(err) {
            res.json({ error: err });
          }
        });
    }
    else {
      console.log("User authenticated (id: " + req.auth_userid + "), but not authorised to update details for user id: " + req.body.userId);
      res.json({error: "Not authorised"});
    }
});

/**
 * @author: Ben Fellows
 * @description: Get All Cloud Providers
 * @usage: pass user_cloud_provider_id as param. user id also required for authorisation
 * DELETE /<api_base>/usercloudproviders
 */
router.get('/', function(req, res) {


});

/**
 * @author: Ben Fellows
 * @description: Get Specific Cloud Provider Accounts for this specific user
 * @usage: pass user_cloud_provider_id as param. user id also required for authorisation
 * POST /<api_base>/usercloudproviders/search
 */
router.post('/search', function(req, res) {
    // if(req.auth_userid == req.body.userId) {
    //   var accountId=userCloudProvider.getAccountIdFromArn(req.body.arn);
    //   userCloudProvider.getByAccountId(
    //     req.body.userId,
    //     accountId,
    //     function (providers){
    //         if(providers){
    //           var providerParams={
    //             userId: req.body.userId,
    //             cloudProviderId: DEFAULT_CLOUD_PROVIDER,
    //             awsAccountId: accountId,
    //             name:'default-'+accountId,
    //             isDefault:1
    //           }
    //           userCloudProvider.addCloudProviderAccount(

    //           )
    //         }else{
    //           res.json(providers);
    //         }
              
    //     }
    //   );

    // }else{
    //   return res.status(403).json({ errors: "Access denied for user" }); 
    // }

});

module.exports = router;
