const express = require('express');
const router = express.Router();
const pickemsController = require('../controllers/pickemsController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/leaderboard', pickemsController.getLeaderboard);
router.get('/week/:week', pickemsController.getPicksByWeek);
router.get('/week/:week/user/:userId', pickemsController.getMyPick);
router.get('/user/twitch/:twitchId', pickemsController.getUserByTwitchId);

// User routes (no admin auth needed, but requires twitch login - validated by user_id in body)
router.post('/week/:week', pickemsController.submitPick);
router.post('/user', pickemsController.upsertUser);

// Admin routes
router.put('/tournament/:id/results', authMiddleware, pickemsController.setResultsAndScore);

module.exports = router;
