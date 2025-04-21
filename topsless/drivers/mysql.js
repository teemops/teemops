
var mysql = require('mysql2');

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = function () {
    return {
        init: function init() {

        },
        escape: function escape(str) {
            return pool.escape(str);
        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: Sets a query, parameters
         * @usage:  data should include SQL string
         * parameters and callback function
         */
        query: function query(sqlstring, params, callback) {
            pool.query(sqlstring, params, function (err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        callback(null, rows);
                    } else {
                        callback(null, null);
                    }
                } else {
                    console.log('Error while performing Query.');
                    return callback(err, null);
                }
            });
        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: Sets a query, parameters
         * @usage:  data should include SQL string
         * parameters and callback function
         * @returns: Promise<array>
         */
        queryPromise: function queryPromise(sqlstring, params) {
            //var sqlresult=new Object;
            return new Promise(function (resolve, reject) {
                pool.query(sqlstring, params, function (err, rows, fields) {
                    if (err) {
                        console.log('Error while performing Query.');
                        reject(err);
                    } else {
                        if (rows.length > 0) {
                            resolve(rows);
                        } else {
                            resolve(null);
                        }
                    }
                });
            })
        },
        /**
          * @author: Ben Fellows <ben@teemops.com>
          * @description: Returns single row
          * @returns: Promise<array>
          */
        getRow: async function getRow(sqlstring, params) {
            try {
                const result = await this.queryPromise(sqlstring, params);
                if (result.length > 0) {
                    return result[0];
                } else {
                    return null;
                }
            } catch (e) {
                throw e;
            }

        },
        /**
          * @author: Ben Fellows <ben@teemops.com>
          * @description: Returns all rows from query
          * @returns: Promise<array>
          */
        getRows: async function getRows(sqlstring, params) {
            try {
                const result = await this.queryPromise(sqlstring, params);
                if (result != null) {
                    return result;
                } else {
                    return null;
                }
            } catch (e) {
                throw e;
            }

        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: INSERT query
         * @usage:  data should include SQL string
         * parameters and callback function
         * @returns: Insert ID of new ID
         */
        insert: function insert(sqlstring, params, callback) {

            pool.query(sqlstring, params, function (err, result) {

                if (!err) {

                    if (result.insertId > 0) {
                        callback(null, result.insertId);
                    }
                } else {
                    console.log('Error while performing Query.');
                    return callback(err, null);
                }
            });

        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: INSERT query
         * @usage:  data should include SQL string
         * parameters
         * @returns: Insert ID of new ID
         */
        insertPromise: function insertPromise(sqlstring, params) {
            console.log(JSON.stringify(sqlstring))
            console.log(JSON.stringify(params))
            try {
                return new Promise(function (resolve, reject) {
                    pool.query(sqlstring, params, function (err, result) {

                        if (!err) {

                            if (result.insertId > 0) {
                                resolve(result.insertId);
                            } else {
                                reject("Object wasn't inserted");
                            }
                        } else {
                            console.log('Error while performing Query.');
                            reject(err);
                        }
                    });

                });
            } catch (e) {
                console.log(e)
                throw e
            }


        },

        /**
         * @author: Sarah Ruane <sarah@teem.nz>
         * @description: INSERT query for stored proc
         * @usage:  data should include SQL string
         * parameters and callback function
         * @returns: Insert ID of new ID
         */
        insertSP: function (sqlstring, params, callback) {

            pool.query(sqlstring, params, function (err, result) {

                if (!err) {

                    var strResult = JSON.stringify(result[0][0]);
                    var jsonResult = JSON.parse(strResult);

                    if (jsonResult.insertId > 0) {
                        callback(null, jsonResult.insertId);
                    }
                } else {
                    console.log('Error while performing Query.');
                    /**
                     * Tackle all cases related to bad input data
                     */
                    return callback(err, null);
                }
            });

        },
        /**
         * @author: Ben Fellows
         * @description: INSERT query for stored proc
         * @usage:  data should include SQL string
         * parameters
         * @returns: Insert ID of new ID
         */
        insertSPPromise: function (sqlstring, params) {
            return new Promise(function (resolve, reject) {
                pool.query(sqlstring, params, function (err, result) {

                    if (!err) {

                        var strResult = JSON.stringify(result[0][0]);
                        var jsonResult = JSON.parse(strResult);

                        if (jsonResult.insertId > 0) {
                            resolve(jsonResult.insertId);
                        }
                    } else {
                        console.log('Error while performing Query.');
                        reject(err);
                    }
                });
            });


        },
        /**
         * @author: Ben Fellows <ben@teemops.com>
         * @description: UPDATE query
         * @usage:  data should include SQL string
         * parameters and callback function
         * @returns: Insert ID of new ID
         */
        update: function update(sqlstring, params, callback) {
            //var sqlresult=new Object;
            pool.query(sqlstring, params, function (err, result) {
                if (!err) {
                    if (result.affectedRows > 0) {
                        callback(null, "true");
                    } else {
                        callback(null, "false");
                    }
                } else {
                    console.log('Error while performing Query.');
                    return callback(err, null);
                }
            });

        },
        updatePromise: function updatePromise(sqlstring, params) {

            return new Promise(function (resolve, reject) {
                pool.query(sqlstring, params, function (err, result) {
                    if (!err) {
                        if (result.affectedRows > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        console.log('Error while performing Query.');
                        reject(err);
                    }
                });
            })

        }
    }
};