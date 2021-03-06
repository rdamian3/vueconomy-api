'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = require('./category');

const MovementSchema = Schema({
  author: {
    type: String,
    required: true,
  },
  amount: { type: Number, default: 0 },
  description: String,
  category: CategorySchema.schema,
  date: Date,
  hasFinished: Boolean,
});

module.exports = mongoose.model('Movement', MovementSchema);
