const UserProblem = require('../models/UserProblem');
const DailyLog    = require('../models/DailyLog');

// POST /api/solve/:problemId
const solveProblem = async (req, res) => {
  try {
    const userId    = req.user.id;
    const problemId = req.params.id;

    // Upsert UserProblem entry
    const up = await UserProblem.findOneAndUpdate(
      { userId, problemId },
      { $set: { solved: true, solvedAt: new Date() } },
      { upsert: true, new: true }
    );

    // Also push into today's DailyLog.problemsSolved if applicable
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    await DailyLog.findOneAndUpdate(
      { userId, date: { $gte: startOfDay, $lte: endOfDay }, problemsAssigned: problemId },
      { $addToSet: { problemsSolved: problemId }, $inc: { count: 1 } }
    );

    res.status(200).json({ message: 'Problem marked as solved!', up });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { solveProblem };
