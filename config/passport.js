/**
 * Created by hamdi on 04.09.2016.
 */

var passport = require('passport');
var User = require('../jsFiles/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){

    done(null, user.id);

});