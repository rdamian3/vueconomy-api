'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  displayName: String,
  avatar: String,
  password: {
    type: String,
    select: false
  },
  signupDate: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.pre('save', next => {
  let user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);