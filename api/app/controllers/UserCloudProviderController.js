var mysql = require("../../app/drivers/mysql.js");
var mydb = mysql();
var log = require('../../app/drivers/log.js');
const DEFAULT_CLOUD_PROVIDER = 1; //AWS

module.exports = function () {
  return {
    /**
    * @author: Sarah Ruane
    * @description: Add a new cloud provider account to a users profile
    * @usage: request data should include userid, cloudproviderId, awsAccountId, name, isDefault flag
    */
    addCloudProviderAccount: async function (data) {
      const existingId = await getExistingAWSAccountId(data.userId, data.awsAccountId, data.name);
      if (existingId > 0) {
        log.error(log.EXCEPTIONS.duplicate, 'Acccount ID and Account Alias must be unique.');
      } else {
        var sql = "CALL sp_insertUserCloudProvider (?, ?, ?, ?, ?)";
        var params = [
          data.userId,
          data.cloudProviderId,
          data.awsAccountId,
          data.name,
          data.isDefault ? 1 : 0
        ];

        try {
          const result = await mydb.insertSPPromise(sql, params);
          return ({ id: result });
        } catch (e) {
          // log.error(log.EXCEPTIONS.generic, e);
          console.log(e);
        }
      }
    },
    /**
    * @author: Ben Fellows
    * @description: Add new audit account with aws account id and IAM Role ID
    * @usage: request data should include awsAccountId, roleARN
    */
    addAuditAccount: async function (data) {

      var sql = "INSERT INTO audit_accounts (aws_account, role_arn) VALUES(?, ?)";
      var params = [
        data.awsAccountId,
        data.roleARN
      ];

      try {
        const result = await mydb.insertSPPromise(sql, params);
        return ({ id: result });
      } catch (e) {
        // log.error(log.EXCEPTIONS.generic, e);
        console.log(e);
      }

    },

    /**
     * Get All cloudproviders for user
     * TODO
     * @param {long} userid 
     * @param {*} cb 
     */
    getAll: function (userId, cb) {

    },

    /**
     * Get account id from authData arn field
     * @param {*} authData  Object that has accountid, aws arn etc..
     */
    getAccountIdFromAuth: function (authData) {
      console.log(JSON.parse(authData).arn);
      arn = JSON.parse(authData).arn;
      accountId = this.getAccountIdFromArn(arn);
      return accountId;
    },

    getAccountIdFromArn: function (arn) {
      console.log(arn)
      accountId = arn.toString().split("arn:aws:iam::")[1].split(":")[0];
      return accountId;
    },

    /**
     * get specific cloudprovider by accountid and userId
     * @param {*} accountId 
     * @param {*} userId
     * @param {*} cb 
     */
    getByAccountId: async function (userId, accountId) {

      var sql = "SELECT * FROM user_cloud_provider WHERE (userid=? AND aws_account_id=?)";
      var params = [userId, accountId];

      try {
        const result = await mydb.queryPromise(sql, params);
        if (result != null) {
          return result[0];
        } else {
          return null;
        }
      } catch (e) {
        throw ({ error: "Error getting Cloud Provider" });
      }

    },

    /**
    * @author: Sarah Ruane
    * @description: Remove cloud provider account from a users profile
    * @usage: request data should user_cloud_provider_id and userid
    */
    deleteCloudProviderAccount: async function (data) {

      var sql = "CALL sp_deleteUserCloudProvider(?,?)";
      var params = [data.userCloudProviderId, data.userId];

      try {
        const results = await mydb.updatePromise(sql, params);
        if (results != null) {
          return (results);
        }
      } catch (e) {
        throw ({ error: "Error removing cloud provider account" }, null);
      }

    },

    /**
    * @author: Sarah Ruane
    * @description: update cloud provider account for a user
    * @usage: request data should provide user_cloud_provider_id and userid
    */
    updateCloudProviderAccount: async function (data) {

      var sql = "CALL sp_updateUserCloudProvider (?, ?, ?, ?, ?)";
      var params = [data.id, data.userId, data.awsAccountId, data.name, data.isDefault];

      try {
        const results = await mydb.updatePromise(sql, params);
        if (results != null) {
          return (results);
        }
      } catch (e) {
        throw ({ error: "Error updating cloud provider account" }, null);
      }

    }
  };
}

async function getExistingAWSAccountId(userId, awsAccountId, accountAlias) {
  var sql = "CALL sp_checkAWSAccount(?, ?, ?)";
  var params = [
    userId,
    awsAccountId,
    accountAlias
  ];

  try {
    const result = await mydb.getRow(sql, params);
    if (result) {
      return result.id;
    } else {
      return 0;
    }
  } catch (e) {
    throw ({ error: 'Error Getting Existing AWS Account Id' });
  }
}