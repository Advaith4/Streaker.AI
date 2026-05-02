const UserProblem = require('../models/UserProblem');

// PUT /api/notes/:problemId
const updateNotes = async (req, res) => {
  try {
    const userId    = req.user.id;
    const problemId = req.params.id;
    const { notes, code } = req.body;

    const update = {};
    if (notes !== undefined) update.notes = notes;
    if (code  !== undefined) update.code  = code;

    const up = await UserProblem.findOneAndUpdate(
      { userId, problemId },
      { $set: update },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Saved!', up });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { updateNotes };
