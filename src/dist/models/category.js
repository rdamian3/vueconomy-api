'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var CategorySchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  author: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Category', CategorySchema);