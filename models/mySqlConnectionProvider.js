/**
 * Created by hamdi on 03.09.2016.
 */

var mysql = require('mysql');
var mySqlConnectionString = require('./mySqlConnectionString');
var mySqlConnectionProvider = {

    getSqlConnection : function(){

        var connection = mysql.createConnection(mySqlConnectionString.mySqlConnection.connectionString.development)

        connection.connect(function (error){

            if(error) {throw  error}
            //console.log("connection succesful");
        })

        return connection;
    },

    closeSqlConnection : function (currentConnection) {
        currentConnection.end(function(error){

            if(error) { throw  error}
            //console.log("mysql connection close succesfully");

        })
    }
}

exports.mySqlConnectionProvider = mySqlConnectionProvider;
