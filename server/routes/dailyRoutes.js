const express = require('express');
const { getDailyProblems, generateDailyProblems } = require('../controllers/dailyController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/',  auth, getDailyProblems);
router.post('/', auth, generateDailyProblems);
module.exports = router;
