/**
 * Created by hamdi on 04.09.2016.
 */

var connectionProvider = require('./mySqlConnectionProvider');
var generateKartId = {

    generateKartIdMethod : function(data) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        for( var i=0; i<150; i++) {

            var post = {
                kartId: i
            };

            var sqlStatement = "INSERT INTO kartId SET ?";
            //var sqlStatement = "DELETE FROM kartId";

            if (connection) {

                connection.query(sqlStatement, post, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);
    }
};

exports.generateKartId = generateKartId;