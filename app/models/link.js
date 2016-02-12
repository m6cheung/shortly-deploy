var db = require('../config');
var crypto = require('crypto');

var urlSchema = new db.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: String,
  time: {
    type: Date,
    default: Date.now
  }
});
urlSchema.pre('save', function() {
  var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
});

var Link = db.model('URL', urlSchema);
module.exports = Link;
