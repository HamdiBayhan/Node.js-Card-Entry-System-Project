/**
 * Created by hamdi on 05.09.2016.
 */

var connectionProvider = require('./mySqlConnectionProvider');
var getCardCount = {

    getUsedCardCount : function(callback) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        var sqlStatement = "SELECT * FROM user";

        var data;

        if (connection) {

            connection.query(sqlStatement, function (err, rows, fields) {
                if (err)
                    throw err;
                else {
                    data=rows.length;
                callback(data);

                }
            });
        }

        connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);

    },

    getEmptyCardCount : function(callback) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        var sqlStatement = "SELECT * FROM kartId";
        var data;
        if (connection) {

            connection.query(sqlStatement, function (err, rows, fields) {
                if (err)
                    throw err;
                else {
                    data=rows.length;

                    callback(data);
                }
            });
        }

        connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);

    }
};





exports.getCardCount = getCardCount;