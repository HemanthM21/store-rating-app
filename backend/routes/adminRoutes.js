const express = require('express');
const router = express.Router();
const { getDashboard, getUsers, getUserById, createUser, getStores, createStore } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.get('/stores', getStores);
router.post('/stores', createStore);

module.exports = router;
