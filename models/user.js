'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
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
    default: Date.now()
  }
});

UserSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, hashPassword, cback) {
  bcrypt.compare(password, hashPassword, (err, areEqual) => {
    if (err) {
      return cback(err);
    }
    cback(null, areEqual);
  });
};

module.exports = mongoose.model('User', UserSchema);
