const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', tournamentController.getTournaments);
router.get('/:week', tournamentController.getTournamentByWeek);

// Protected routes (admin only)
router.post('/', authMiddleware, tournamentController.createTournament);
router.put('/:id', authMiddleware, tournamentController.updateTournament);
router.delete('/:id', authMiddleware, tournamentController.deleteTournament);

module.exports = router;
