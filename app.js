process.env.PWD = process.cwd();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var timers = require('timers');

var expressValidator = require('express-validator');
var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var mysql = require("mysql");
var async = require("async");
var passport = require('passport');
var flash = require('connect-flash');
var generateKartId = require('./models/generateKartId');
var x = require("./models/admin");
var LocalStrategy = require('passport-local'),Strategy;
var connectionProvider = require('./models/mySqlConnectionProvider');

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(expressSession({secret: 'mysupersecret', saveUninitialized: true, resave: false}));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);
app.use(express.static(process.env.PWD + '/public/uploads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


setInterval(function(){

  async.waterfall([
    function(callback) {

      var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();
      var sqlStatement = "SELECT girisTarihi, kartId FROM user";

      var s = [];
      connection.query(sqlStatement, function (err, rows, fields) {
        if (err){
          throw err;
        }
        else {
          rows.forEach(function (row) {

            s.push(row);
          });

          callback(null,s);

        }});
      connectionProvider.mySqlConnectionProvider.closeSqlConnection(connection);
    },

    function(s, callback) {
      var connection = connectionProvider.mySqlConnectionProvider.getSqlConnection();

      var d = new Date();
      var gTarr = [];
      var kIdArr = [];

      for (var i = 0; i < s.length; i++) {
        gTarr.push(s[i].girisTarihi);
        kIdArr.push(s[i].kartId);
      }

      var change="";

      for(var c=0; c < s.length; c++) {
        if((d.getTime()-gTarr)>10800000){
          if(change.length==0){
            change = change + "'" + kIdArr[c] + "'";
          }
          else{
            change = change + ",'" + kIdArr[c] + "'";
          }
        }
      }

      if(change.length>0) {
        var sqlStatement1 = "UPDATE user SET icerdemi='off' WHERE kartId in (" + change + ")";


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

}, 1000);

module.exports = app;




