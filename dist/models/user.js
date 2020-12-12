'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  displayName: String,
  avatar: String,
  password: {
    type: String,
    required: true
  },
  signupDate: {
    type: Date,
    "default": Date.now()
  },
  bucket: String
});
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        next(err);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, hashPassword, cback) {
  bcrypt.compare(password, hashPassword, function (err, areEqual) {
    if (err) {
      return cback(err);
    }

    cback(null, areEqual);
  });
};

module.exports = mongoose.model('User', UserSchema);