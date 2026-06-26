const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validatePassword, validateEmail, validateName, validateAddress, getPasswordError } = require('../utils/validators');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ success: false, message: 'Name must be between 20 and 60 characters.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: getPasswordError() });
    }
    if (!validateAddress(address)) {
      return res.status(400).json({ success: false, message: 'Address must not exceed 400 characters.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, address, role: 'user' });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ success: false, message: getPasswordError() });
    }

    const user = await User.findByPk(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating password.' });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, updatePassword, getMe };
