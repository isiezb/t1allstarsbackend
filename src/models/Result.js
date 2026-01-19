const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  tournament: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  runner_up: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    enum: ['NA', 'EU', 'KR'],
    required: true,
  },
  prize_pool: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Result', resultSchema);
