var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var usernameSchema = new db.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
});

var User = db.model('Username', usernameSchema);


usernameSchema.pre('save', function() {
  var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
      });
  }
);


usernameSchema.method('comparePassword', function(attemptedPassword, callback) {
      bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
        callback(isMatch);
      });
    }
);




module.exports = User;
