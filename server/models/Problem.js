const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  solved: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    default: '',
  },
  solvedAt: {
    type: Date,
    default: null,
  },
  gfgUrl: {
    type: String,
    default: '',
  },
  leetcodeUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);
