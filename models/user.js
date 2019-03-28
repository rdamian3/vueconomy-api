"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
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

UserSchema.pre("save", function(next){
  const usuario = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    bcrypt.hash(usuario.password, salt, null, (err, hash) => {
      if (err) {
        next(err);
      }
      usuario.password = hash;
      next();
    })
  })
});

UserSchema.methods.comparePassword = function(password, hashPassword, cback) {
  bcrypt.compare(password, hashPassword, (err, areEqual) => {
    if (err) {
      return cback(err);
    }
    cback(null, areEqual);
  });
};

module.exports = mongoose.model("User", UserSchema);
