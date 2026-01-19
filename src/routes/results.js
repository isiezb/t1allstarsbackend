const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', resultController.getResults);

// Protected routes (admin only)
router.post('/', authMiddleware, resultController.createResult);
router.put('/:id', authMiddleware, resultController.updateResult);
router.delete('/:id', authMiddleware, resultController.deleteResult);

module.exports = router;
