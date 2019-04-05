const User = require('../common/mongoose').model('User')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: '311228889504174',
        clientSecret: 'c5b7985f0f847755eec9958aff3df8e9',
        callbackURL: '/users/auth/facebook/callback',
        profileFields: ['id', 'displayName','photos', 'email'],
        
      },
      function (accessToken, refreshToken, profile, done) {
        User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        if(err) console.log(err)
          console.log(user)
          return done(err, user)
        });
      }));
  passport.use(new GoogleStrategy({
    clientID: '388884328654-6q0a20di3cqme5mvkvsem7oui0tar53g.apps.googleusercontent.com',
    clientSecret: 'OugzEQ2xW3lCd13e304f_6M4',
    callbackURL: "users/auth/google/callback",
    passReqToCallback: true
  },
    function (request, accessToken, refreshToken, profile, done) {
      User.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
        if(err) console.log(err)
          console.log(user)
          return done(err, user)
      })
    }))
}