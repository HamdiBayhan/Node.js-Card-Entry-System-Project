var express = require('express');
var router = express.Router();
var getPeopleInfo = require("../models/getUserInfo");
var insertUser = require("../models/user");
var admin = require("../models/admin");
var getCardCount = require("../models/getCardCount");
var setEntryCount = require("../models/numberOfUse");
var async = require("async");
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var control = "";
var upload = multer({ storage: storage });

var csrf = require('csurf');
var csrfProtection = csrf();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//router.use(csrfProtection);

router.get('/admin', ensureAuthenticated1, function(req, res, next) {

    admin.admin.getConfirmUser(function(a){

        var results =[];
        for (var i = 0; i < a.length; i++) {
            results.push( { "kartId": a[i].kartId,
                "email": a[i].email, "isim": a[i].isim, "soyisim": a[i].soyisim  });
        }
        res.render('admn', { title: results});

    });
});

function ensureAuthenticated1(req, res, next){


    if(req.user == "admin"){
        return next();
    } else {
        res.redirect('/user/adminLogin');
    }
}

/* GET home page. */

router.get('/', ensureAuthenticated,function(req, res, next) {


    async.series([
        function (callback){
            getPeopleInfo.getPeopleInfo.getAll(function(data1) {

                callback(null,data1);
            });
        },
        function (callback){
            getCardCount.getCardCount.getUsedCardCount(function( data2) {

                callback( null, data2);
            });
        },
        function (callback){
            getCardCount.getCardCount.getEmptyCardCount(function(data3) {

                callback(null,data3);
            });
        }

    ],
        function (err, results) {

            var info = results[0];
            var infoArr=[];
            for (var i = 0; i < info.length; i++) {
                infoArr.push({
                    "kartId": info[i].kartId,
                    "email": info[i].email, "isim": info[i].isim, "soyisim": info[i].soyisim, "onay": info[i].onay,
                    "tarih": info[i].uTarihi, "kullanimSayisi": info[i].kullanımOranı, "imagePath": info[i].imagePath
                });
            }



            var online = 0;
            var onaylanmamisSayisi = 0;
            var kArr = [];
            var kIdArr = [];
            for(var t = 0; t<infoArr.length; t++){

                if(info[t].onay === "Onaylanmadı"){
                    onaylanmamisSayisi++;
                }
                if(info[t].icerdemi === "on"){
                    online++;
                }

                kArr.push({kullanımOranı: info[t].kullanımOranı, kartId: info[t].kartId});
            }

            kArr.sort(function (a, b) {
                if (a.kullanımOranı > b.kullanımOranı) {
                    return 1;
                }
                if (a.kullanımOranı < b.kullanımOranı) {
                    return -1;
                }
                return 0;
            });

            var border = 10;

            if(info.length<border){
                border=info.length;
            }

            var usageRate=[];
                for (var i = (border-1); i >= 0 ; i--) {
                    for(var r = 0; r < info.length; r++) {
                        if(kArr[i].kartId == info[r].kartId){
                            usageRate.push({
                                "kartId": info[r].kartId, "email": info[r].email,
                                "isim": info[r].isim, "soyisim": info[r].soyisim, "kullanimSayisi": info[r].kullanımOranı
                            });
                        }
                    }
                }



            res.render('./index', {title: infoArr, empty: results[1], use: results[2], notConfirm: onaylanmamisSayisi,
                online: online, usageRate: usageRate});

            if (err)
                console.log(err);
        });

});


function ensureAuthenticated(req, res, next){
    //console.log(req.user);

    if(req.user == "management"){
        return next();
    } else {
        res.redirect('/user/login');
    }
}

router.get('/user/signin', function(req, res, next) {
  res.render('user/signin');
});

router.post('/user/signin', upload.any(), function(req, res, next) {

    var kartId = req.body.kartId;
    var email = req.body.email;
    var isim = req.body.isim;
    var soyisim = req.body.soyisim;
    var imagePath = req.files[0].filename;


  if(!isNaN(kartId) && kartId && !(email === "") && !(isim === "") && !(soyisim === "")) {

    insertUser.insertUser.insertAll(req.body, imagePath);
    res.redirect("/user/signin");
  }
  else{
    res.redirect("/user/signin");
  }
});



router.get('/sendKartId/:id', function(req, res, next)
{
    var kartId = req.params.id;

    admin.admin.confirmUser(kartId);
    res.redirect("/admin");

});

router.post('/readCardSim', function(req, res, next) {

    var kartId = req.body.kartId;

    setEntryCount.setEntryCount.setEntryCountMethod(kartId);
    res.redirect("/readCardSim");

});

router.get('/readCardSim', function(req, res, next) {
    res.render('readCardSim');
});

passport.use("management-local", new LocalStrategy(
    function(username, password, done) {
       if(username == "management") {
           var user = true;
       }
        else{
            var user = false;
           }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            else{
                if (!(password == "password")) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                else{
                    user = "management";
                    control = "management";
                    return done(null, user);
                }}

    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(control, done) {
    if(control == "management")
    {
        done(null, "management");
    }
    else{
        done(null, "admin");
    }
});


router.get('/user/login', function(req, res){
    res.render('user/login');
});

router.post('/user/login',
    passport.authenticate('management-local', {successRedirect:'/', failureRedirect:'/user/login'}),
    function(req, res) {
        res.redirect('/');
});

passport.use("admin-local", new LocalStrategy({
        usernameField: 'Ausername',
        passwordField: 'Apassword' // this is the virtual field on the model
    },
    function(Ausername, Apassword, done) {
        if(Ausername == "admin") {
            var user = true;
        }
        else{
            var user = false;
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        else{
            if (!(Apassword == "password")) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            else{
                user = "admin";
                control = "admin";
                return done(null, user);
            }}
    }
));

router.get('/user/adminLogin', function(req, res){
    res.render('user/adminLogin');
});

router.post('/user/adminLogin',
    passport.authenticate('admin-local', {successRedirect:'/admin', failureRedirect:'/user/adminLogin'}),
    function(req, res) {
        res.redirect('/admin');
    });


router.get('/logout', function(req, res){
    req.logout();


    res.redirect('/user/login');
});


module.exports = router;
