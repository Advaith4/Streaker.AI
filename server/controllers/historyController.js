const DailyLog = require('../models/DailyLog');

// GET /api/history — per-user history for heatmap
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await DailyLog.find({ userId }).sort({ date: 1 });

    let currentStreak = 0, maxStreak = 0, tempStreak = 0, lastActiveDate = null;

    for (let i = 0; i < logs.length; i++) {
      if (logs[i].count > 0) {
        const currentDate = new Date(logs[i].date);
        currentDate.setHours(0, 0, 0, 0);

        if (!lastActiveDate) {
          tempStreak = 1;
        } else {
          const diffDays = Math.round(Math.abs(currentDate - lastActiveDate) / 864e5);
          tempStreak = diffDays === 1 ? tempStreak + 1 : 1;
        }

        lastActiveDate = currentDate;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      }
    }

    if (lastActiveDate) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const diffDays = Math.round(Math.abs(today - lastActiveDate) / 864e5);
      currentStreak = diffDays <= 1 ? tempStreak : 0;
    }

    res.status(200).json({ logs, currentStreak, maxStreak });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getHistory };
