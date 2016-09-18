/**
 * Created by hamdi on 04.09.2016.
 */

var connectionProvider = require('./mySqlConnectionProvider');
var admin = {

    confirmUser : function(kartId) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        var sqlStatement = "DELETE FROM kartId WHERE kartId='"+kartId+"'";

        if (connection) {

            connection.query(sqlStatement, function (err) {
                if (err){
                    throw err;
                }
            });
        }

        var sqlStatement = "UPDATE user SET onay='Onaylandı' WHERE kartId ='"+kartId+"'";

        if (connection) {

            connection.query(sqlStatement, function (err) {
                if (err){
                    throw err;
                }
            });
        }
        connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);
    },

    getConfirmUser : function (callback) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        var den = [];
        var sqlStatement = "SELECT * FROM user WHERE onay='Onaylanmadı'";

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


exports.admin = admin;