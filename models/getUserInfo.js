/**
 * Created by hamdi on 03.09.2016.
 */

var connectionProvider = require('./mySqlConnectionProvider');
var getPeopleInfo = {

    getAll : function(callback) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        var den = [];
        var sqlStatement = "SELECT * FROM user";

        if (connection) {

            connection.query(sqlStatement, function (err, rows, fields) {
                if (err)
                    throw err;
                else {
                    rows.forEach(function (row) {

                        den.push(row);
                    });

                    callback(den);

                }
            });
        }

        connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);

    }
};

exports.getPeopleInfo = getPeopleInfo;