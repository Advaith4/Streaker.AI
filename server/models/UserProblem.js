const mongoose = require('mongoose');

// Per-user tracking: solved status, notes, code for each problem
const userProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  solved: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  code:  { type: String, default: '' },
  solvedAt: { type: Date, default: null },
}, { timestamps: true });

// Each user can only have one record per problem
userProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('UserProblem', userProblemSchema);
