'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = require('./category');

var MovementSchema = Schema({
  author: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    "default": 0
  },
  description: String,
  category: CategorySchema.schema,
  date: Date,
  hasFinished: Boolean
});
module.exports = mongoose.model('Movement', MovementSchema);