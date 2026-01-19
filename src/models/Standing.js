const mongoose = require('mongoose');

const standingSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    enum: ['NA', 'EU', 'KR'],
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  tournaments: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  prize: {
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

module.exports = mongoose.model('Standing', standingSchema);
