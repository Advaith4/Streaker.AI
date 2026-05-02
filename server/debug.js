require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const DailyLog = require('./models/DailyLog');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const total = await Problem.countDocuments();
  const unsolved = await Problem.countDocuments({ solved: false });
  const logs = await DailyLog.countDocuments();

  console.log('Total Problems:', total);
  console.log('Unsolved Problems:', unsolved);
  console.log('Total DailyLogs:', logs);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const log = await DailyLog.findOne({ date: { $gte: today, $lte: end } }).populate('problemsAssigned');
  console.log('Today Log:', log ? `Found - ${log.problemsAssigned.length} problems assigned` : 'None');

  // Sample 3 problems
  const sample = await Problem.find().limit(3);
  console.log('Sample problems:', sample.map(p => ({ title: p.title, topic: p.topic, difficulty: p.difficulty })));

  process.exit(0);
});
