const express = require('express');
const router = express.Router();
const { register, login, updatePassword, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/update-password', authMiddleware, updatePassword);

module.exports = router;
