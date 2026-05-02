const Problem = require('../models/Problem');
const DailyLog = require('../models/DailyLog');
const UserProblem = require('../models/UserProblem');

// GET /api/daily — fetch today's log for the logged-in user
const getDailyProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayLog = await DailyLog.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('problemsAssigned').populate('problemsSolved');

    if (!todayLog) return res.status(200).json(null);

    // Merge per-user solved/notes/code into each problem
    const userProblems = await UserProblem.find({
      userId,
      problemId: { $in: todayLog.problemsAssigned.map(p => p._id) }
    });
    const upMap = {};
    userProblems.forEach(up => { upMap[up.problemId.toString()] = up; });

    const enriched = todayLog.problemsAssigned.map(p => {
      const up = upMap[p._id.toString()];
      return {
        ...p.toObject(),
        solved: up?.solved || false,
        notes: up?.notes || '',
        code: up?.code || '',
        solvedAt: up?.solvedAt || null,
      };
    });

    res.status(200).json({
      ...todayLog.toObject(),
      problemsAssigned: enriched,
      problemsSolved: userProblems.filter(up => up.solved).map(up => up.problemId),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// POST /api/daily — generate today's plan for the logged-in user
const generateDailyProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dayType } = req.body;
    const targetCount = dayType === 'holiday' ? 7 : 3;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if this user already generated today
    const existing = await DailyLog.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    if (existing) {
      return res.status(400).json({ message: 'Today already generated.' });
    }

    // Get problems this user hasn't solved yet
    const solvedByUser = await UserProblem.find({ userId, solved: true }).select('problemId');
    const solvedIds = solvedByUser.map(up => up.problemId);

    const unsolvedProblems = await Problem.find({ _id: { $nin: solvedIds } });

    if (unsolvedProblems.length === 0) {
      return res.status(404).json({ message: 'You\'ve solved all problems! 🎉' });
    }

    // Round-robin across topics for variety
    const topicMap = {};
    unsolvedProblems.forEach(p => {
      if (!topicMap[p.topic]) topicMap[p.topic] = [];
      topicMap[p.topic].push(p);
    });

    const selectedProblems = [];
    const topics = Object.keys(topicMap);
    let topicIndex = 0;
    while (selectedProblems.length < targetCount && selectedProblems.length < unsolvedProblems.length) {
      const currentTopic = topics[topicIndex % topics.length];
      const pool = topicMap[currentTopic];
      if (pool && pool.length > 0) selectedProblems.push(pool.shift());
      topicIndex++;
    }

    const problemIds = selectedProblems.map(p => p._id);

    let todayLog = await DailyLog.create({
      userId,
      date: startOfDay,
      problemsAssigned: problemIds,
      problemsSolved: [],
      count: 0
    });

    todayLog = await todayLog.populate('problemsAssigned');

    // Enrich with user-specific data (all unsolved for new problems)
    const enriched = todayLog.problemsAssigned.map(p => ({
      ...p.toObject(),
      solved: false, notes: '', code: '', solvedAt: null,
    }));

    res.status(201).json({ ...todayLog.toObject(), problemsAssigned: enriched });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getDailyProblems, generateDailyProblems };
