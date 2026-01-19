const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', playerController.getPlayers);
router.get('/:name', playerController.getPlayerByName);

// Protected routes (admin only)
router.post('/', authMiddleware, playerController.createPlayer);
router.put('/:id', authMiddleware, playerController.updatePlayer);
router.delete('/:id', authMiddleware, playerController.deletePlayer);

module.exports = router;
