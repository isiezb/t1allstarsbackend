const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    enum: ['NA', 'EU', 'KR'],
    required: true,
  },
  status: {
    type: String,
    enum: ['complete', 'live', 'upcoming'],
    default: 'upcoming',
  },
  participants: {
    type: [String],
    default: [],
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

module.exports = mongoose.model('Tournament', tournamentSchema);
