const Problem = require('../models/Problem');
const UserProblem = require('../models/UserProblem');

// GET /api/problems/solved — per-user solved problems with notes/code
const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProblems = await UserProblem.find({ userId, solved: true })
      .populate('problemId')
      .sort({ solvedAt: -1 });

    const result = userProblems
      .filter(up => up.problemId) // guard against deleted problems
      .map(up => ({
        ...up.problemId.toObject(),
        solved: true,
        notes: up.notes,
        code: up.code,
        solvedAt: up.solvedAt,
      }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// GET /api/problems/stats — per-user solve stats for heatmap/profile
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProblems = await UserProblem.find({ userId, solved: true })
      .select('solvedAt problemId');

    // Build heatmap data: { date: count }
    const heatmap = {};
    userProblems.forEach(up => {
      if (up.solvedAt) {
        // Offset UTC to IST (+5:30) for correct day grouping
        const dateIST = new Date(up.solvedAt.getTime() + (5.5 * 60 * 60 * 1000));
        const d = dateIST.toISOString().slice(0, 10);
        heatmap[d] = (heatmap[d] || 0) + 1;
      }
    });

    const heatmapArr = Object.entries(heatmap).map(([date, count]) => ({ date, count }));

    // Streak calculation
    const sortedDates = Object.keys(heatmap).sort();
    let streak = 0, bestStreak = 0, curr = 0;
    
    // Get today and yesterday in IST
    const nowIST = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
    const today = nowIST.toISOString().slice(0, 10);
    const yesterdayDate = new Date(nowIST.getTime() - 864e5);
    const yesterday = yesterdayDate.toISOString().slice(0, 10);

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) { curr = 1; }
      else {
        const prev = new Date(sortedDates[i - 1]);
        const cur  = new Date(sortedDates[i]);
        const diff = (cur - prev) / 864e5;
        curr = diff === 1 ? curr + 1 : 1;
      }
      if (curr > bestStreak) bestStreak = curr;
      const last = sortedDates[sortedDates.length - 1];
      if (last === today || last === yesterday) streak = curr;
    }

    res.status(200).json({
      totalSolved: userProblems.length,
      heatmap: heatmapArr,
      streak,
      bestStreak,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getSolvedProblems, getUserStats };
