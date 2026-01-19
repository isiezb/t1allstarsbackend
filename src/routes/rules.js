const express = require('express');
const router = express.Router();
const rulesController = require('../controllers/rulesController');
const authMiddleware = require('../middleware/auth');

// Public route
router.get('/', rulesController.getRules);

// Protected route (admin only)
router.put('/', authMiddleware, rulesController.updateRules);

module.exports = router;
