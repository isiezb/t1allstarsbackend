const express = require('express');
const router = express.Router();
const vodController = require('../controllers/vodController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', vodController.getVODs);

// Protected routes (admin only)
router.post('/', authMiddleware, vodController.createVOD);
router.put('/:id', authMiddleware, vodController.updateVOD);
router.delete('/:id', authMiddleware, vodController.deleteVOD);

module.exports = router;
