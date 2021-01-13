const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/users');
const jwt = require('jsonwebtoken');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user,"12345-67890-09876-54321",{expiresIn : 3600});
}

exports.verifyUser = passport.authenticate('jwt',{session :false});