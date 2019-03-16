'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovementSchema = Schema({
  amount: { type: Number, default: 0 },
  description: String,
  category: { name: String, icon: String },
  date: String,
  hasFinished: Boolean
});

module.exports = mongoose.model('Movement', MovementSchema);
