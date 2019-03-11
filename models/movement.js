'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovementSchema = Schema({
  amount: { type: Number, default: 0 },
  description: String,
  category: String,
  date: String
});

module.exports = mongoose.model('Movement', MovementSchema);
