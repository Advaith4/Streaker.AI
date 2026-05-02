const express = require('express');
const { solveProblem } = require('../controllers/solveController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/:id', auth, solveProblem);
module.exports = router;
