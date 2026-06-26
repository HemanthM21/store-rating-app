const express = require('express');
const router = express.Router();
const { getStores, submitRating, deleteRating } = require('../controllers/storeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware, roleMiddleware('user'));

router.get('/', getStores);
router.post('/:id/rate', submitRating);
router.delete('/:id/rate', deleteRating);

module.exports = router;
