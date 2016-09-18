/**
 * Created by hamdi on 08.09.2016.
 */

var async = require("async");
var connectionProvider = require('./mySqlConnectionProvider');

var setEntryCount = {

    setEntryCountMethod : function(kartId) {


        async.waterfall([
            function(callback) {

                var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();
                var sqlStatement = "SELECT kullanımOranı, icerdemi, girisTarihi FROM user WHERE kartId='"+kartId+"'";

                var s = [];
                connection.query(sqlStatement, function (err, rows, fields) {
                    if (err){
                        throw err;
                    }
                    else {
                        rows.forEach(function (row) {

                            s.push(row);
                        });


                        console.log(s[0].kullanımOranı);
                        console.log(s[0].girisTarihi);
                        console.log(s[0].icerdemi);

                        callback(null,s);

                    }
                });
                connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);
            },

            function(s, callback) {
                var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

                var d = new Date();
                var kO = s[0].kullanımOranı;
                var gT = s[0].girisTarihi;
                var i = s[0].icerdemi;

                if((d.getTime()-gT)>10800000 && i==="off"){
                    var sqlStatement1 = "UPDATE user SET kullanımOranı='"+(kO + 1)+"', girisTarihi='"+d.getTime()+"', icerdemi='on' WHERE kartId ='" + kartId + "'";
                    connection.query(sqlStatement1, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
                else if((d.getTime()-gT)<10800000 && i==="on"){
                    var sqlStatement1 = "UPDATE user SET kullanımOranı='"+(kO + 1)+"', girisTarihi='"+d.getTime()+"', icerdemi='off' WHERE kartId ='" + kartId + "'";
                    connection.query(sqlStatement1, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }

                callback(null, "");

                connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);
            }
        ], function(err, result) {
            if (err) {
                console.error(err);
                return;
            }
        });

    }
};

exports.setEntryCount = setEntryCount;