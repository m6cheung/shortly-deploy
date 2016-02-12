var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

// var User = db.Model.extend({
  // tableName: 'users',
  // hasTimestamps: true,
  // initialize: function() {
  //   this.on('creating', this.hashPassword);
  // },
  // comparePassword: function(attemptedPassword, callback) {
  //   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
  //     callback(isMatch);
  //   });
  // },
  // hashPassword: function() {
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
// });

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
        this.set('password', hash);
      });
  }
);


usernameSchema.method('comparePassword', function(attemptedPassword, callback) {
      bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
        callback(isMatch);
      });
    }
);
//alternate form
// usernameSchema.on('init', function () {
//   // do stuff with the model
//   var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.password, null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       }
//     );
// });




module.exports = User;
