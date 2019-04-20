'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
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
