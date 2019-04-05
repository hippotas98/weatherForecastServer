var express = require('express')
var passport = require('passport')
var oauthRouter = express.Router()
var jwt = require('./jwt.generator')
var authentication = require('./authentication')
var User = require('../common/mongoose').model('User')


oauthRouter.route('/auth/facebook')
  .post(passport.authenticate('facebook', { session: false }), function (req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    // prepare token for API
    req.auth = {
      id: req.user.id,
      email: req.user.email,
      role: 1
    };
    next();
  }, jwt.generateToken, jwt.sendToken);
oauthRouter.route('/auth/google')
  .post(passport.authenticate('google', { session: false }), function (req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    // prepare token for API
    req.auth = {
      id: req.user.id,
      email: req.user.email,
      role: 1
    };
    next();
  }, jwt.generateToken, jwt.sendToken);
var getCurrentUser = function (req, res, next) {
  User.findById(req.auth.id, function (err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

var getOne = function (req, res) {
  var user = req.user.toObject();

  delete user['facebookProvider'];
  delete user['googleProvider'];
  delete user['__v'];

  res.json(user);
};

oauthRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log('success')
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };
    console.log(req.auth)
    jwt.generateToken(req, res, () => { })
    jwt.sendToken(req, res)
  });

oauthRouter.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log('success')
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };
    console.log(req.auth)
    jwt.generateToken(req, res, () => { })
    jwt.sendToken(req, res)
  });

oauthRouter.route('/auth/me*')
  .get(authentication.authenticateHeader, getCurrentUser, getOne);

module.exports = oauthRouter