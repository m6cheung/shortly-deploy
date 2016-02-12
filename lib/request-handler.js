var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var mongo = require('mongo');
var db = require('mongoose');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if(err) {throw err;}
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({'url': uri}, function(err, foundData) {
    if(err) { throw err;
    }
    if(foundData) {
      res.send(200, foundData);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if(err) {
          console.log(err);
          return res.send(404);
        }
        var newLink = Link({
          'url': uri,
          'title': title,
          'baseUrl': req.headers.origin
        });
        newLink.save(function(err) {
          if(err) {
            throw err;
          }
          res.send(200, newLink);
        });    
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var userData = req.body;
  var username = req.body.username;
  User.find({'username': username}, function(err, data) {
    if(err) {
      return err;
    }
    if(!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if(match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var userData = req.body;

  User.find({'username': username}, function(err, user) {
    if(err) {return err;
    }
    if(!user) {
      User.create(userData, function(err, createdUser){
        if(err) {return err;}
          Users.add(createdUser);
          util.createSession(req, res, createdUser);
      });
    } else {
      console.log('Account already exists!');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {

  Link.find({ code: req.params[0] }, function(err, link) {
    if(err) {return err;}
    if(!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      return res.redirect(link.url);
    }
  });
};



















