const express = require('express');
const { getHistory } = require('../controllers/historyController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/', auth, getHistory);
module.exports = router;
