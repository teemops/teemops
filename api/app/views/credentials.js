var credentialController = require("../../app/controllers/CredentialController.js");
var userCloudProviderController = require("../../app/controllers/UserCloudProviderController");
var express = require("express");
var bodyParser = require('body-parser');
var router = express.Router();
var myCredential = credentialController();
var userCloudProvider = userCloudProviderController();
var security = require("../../app/security/index");
var auth = require("../../app/utils/auth.js");

const DEFAULT_CLOUD_PROVIDER = 1; //AWS

//Body Parser required to use json and other body data sent in request
//router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// Authentication middleware
router.use(security.middleware);

router.put("/", async function (req, res) {
  /**
   * Check whether or not the usercloudprovider's account is added yet
   * if accountid does not exist then add
   */
  var authData = JSON.parse(req.body.authData);
  var accountId = userCloudProvider.getAccountIdFromAuth(req.body.authData);

  console.log("AccountID: " + accountId);
  try {
    const providers = await userCloudProvider.getByAccountId(
      req.body.userid,
      accountId
    );
    if (providers == undefined) {
      var providerParams = {
        userId: req.body.userId,
        cloudProviderId: DEFAULT_CLOUD_PROVIDER,
        awsAccountId: accountId,
        name: authData.name,
        isDefault: req.body.isDefault,
      };
      //TODO: create async request

      const account = await userCloudProvider.addCloudProviderAccount(
        providerParams
      );
      var params = {
        userCloudProviderId: account.id,
        awsAuthMethod: req.body.awsAuthMethod,
        authData: req.body.authData,
      };

      const newId = await myCredential.addUserDataProvider(params);
      res.json({ credentialId: newId });
    } else {
      var params = {
        userCloudProviderId: providers.id,
        awsAuthMethod: req.body.awsAuthMethod,
        authData: req.body.authData,
      };

      const newId = await myCredential.addUserDataProvider(params);
      res.json({ credentialId: newId });
    }
  } catch (e) {
    res.json({ e });
  }
});

router.post("/", async function (req, res) {
  try {
    const result = await myCredential.updateUserDataProvider(req.body);
    res.json({ success: result });
  } catch (e) {
    res.json({ e });
  }
});

router.delete("/:id?", async function (req, res) {

  try {
    const result = await myCredential.deleteUserDataProvider(req.params.id);
    res.json({ success: result });
  } catch (e) {
    res.json({ e });
  }

});

router.get("/", auth, async function (req, res) {

  // res.json({ bah: "blah" });

  myCredential.getDataProvidersByUserId(
    req.auth_userid,
    function (err, result) {
      if (err) {
        res.json({ err });
      } else {
        res.json({ result });
      }
    }
  );

});

module.exports = router;
