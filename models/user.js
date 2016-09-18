/**
 * Created by hamdi on 04.09.2016.
 */

var connectionProvider = require('./mySqlConnectionProvider');
var insertUser = {

    insertAll : function(data, imagePath) {

        var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

        var d = new Date();
        var uTarihi = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
        var post = {
            kartId: data.kartId,
            email: data.email,
            isim: data.isim,
            soyisim: data.soyisim,
            onay: "Onaylanmadı",
            kullanımOranı: 0,
            icerdemi: "off",
            girisTarihi: 0,
            uTarihi: uTarihi,
            imagePath: imagePath
        };

        var sqlStatement = "INSERT INTO user SET ?";

        if (connection) {

            connection.query(sqlStatement, post, function (err) {
                if (err){
                    throw err;
                }
            });
        }
        connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);
    }
};

exports.insertUser = insertUser;