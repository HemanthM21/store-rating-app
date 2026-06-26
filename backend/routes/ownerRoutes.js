const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware, roleMiddleware('owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
