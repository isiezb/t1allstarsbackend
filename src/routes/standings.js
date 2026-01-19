const express = require('express');
const router = express.Router();
const standingController = require('../controllers/standingController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', standingController.getStandings);

// Protected routes (admin only)
router.post('/', authMiddleware, standingController.createStanding);
router.put('/:id', authMiddleware, standingController.updateStanding);
router.delete('/:id', authMiddleware, standingController.deleteStanding);

module.exports = router;
