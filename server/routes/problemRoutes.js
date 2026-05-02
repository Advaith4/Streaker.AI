const express = require('express');
const { getSolvedProblems, getUserStats } = require('../controllers/problemController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/solved', auth, getSolvedProblems);
router.get('/stats',  auth, getUserStats);

module.exports = router;
