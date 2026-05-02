const express = require('express');
const { updateNotes } = require('../controllers/notesController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
router.put('/:id', auth, updateNotes);
module.exports = router;
