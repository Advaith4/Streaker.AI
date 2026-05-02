const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  problemsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  problemsSolved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  count: {
    type: Number,
    default: 0, // Number of problems solved today
  }
});

// One log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
