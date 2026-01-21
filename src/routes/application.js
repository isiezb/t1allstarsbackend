const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', applicationController.getApplicationUrl);

// Protected routes (admin only)
router.put('/', authMiddleware, applicationController.updateApplicationUrl);

module.exports = router;
