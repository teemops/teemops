var schemas = require("../../app/models/");
var mysql = require("../../app/drivers/mysql.js");
var config = require("config-json");
config.load("./app/config/config.json");
const crypto = require("crypto");
var mydb = mysql();

module.exports = function () {
  return {
    addUserDataProvider: async function (data, cb) {
      var sql = "CALL sp_insertUserDataProvider (?, ?, ?, ?, ?)";
      var params = [
        data.userCloudProviderId,
        data.awsAuthMethod,
        data.authData,
        data.accessType,
        data.externalId
      ];

      try {
        const result = await mydb.insertSPPromise(sql, params);
        return result;
      } catch (e) {
        throw e;
      }
    },

    updateUserDataProvider: async function (data, cb) {
      var sql = `UPDATE user_data_providers SET
          auth_data = ?
          WHERE id = ?`;

      var params = [data.authData, data.id];

      try {
        var result = await mydb.updatePromise(sql, params);
        sql = `UPDATE user_cloud_provider set name=?
        WHERE id=?`;
        params = [data.name, data.userCloudProviderId];
        result = await mydb.updatePromise(sql, params);
        return result;
      } catch (e) {
        throw e;
      }
    },

    getDataProvidersByUserId: function (userId, cb) {
      var sql = "CALL sp_getDataProvidersByUserId(?)";
      var params = [userId];

      //query database with sql statement and retrun results or error through callback function
      mydb.query(sql, params, function (err, results) {
        if (err) throw err;

        if (results != null) {
          cb(null, results[0]);
        } else {
          cb(null, []);
        }
      });
    },

    /**
     * get specific Cloud Data Provider by accountid and userId
     * @param {*} accountId
     * @param {*} userId
     * @param {*} cb
     */
    getByAccountId: async function (userId, accountId) {

      //convert following callback code to async/await
      try {
        var sql = "CALL sp_getDataProvidersByAccountId(?,?)";
        var params = [userId, accountId];
        var results = await mydb.queryPromise(sql, params);
        if (results != null) {
          return results[0];
        } else {
          return [];
        }
      } catch (e) {
        throw { error: "Error getting Cloud Provider" };
      }
    },

    deleteUserDataProvider: async function (id) {
      var sql = "DELETE FROM user_data_providers WHERE id = ?";
      var params = [id];
      try {
        var result = await mydb.updatePromise(sql, params);
        return result;
      } catch (e) {
        throw e;
      }
    },
  };
};
