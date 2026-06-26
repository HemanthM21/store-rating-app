const { User, Store, Rating } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { validatePassword, validateEmail, validateName, validateAddress, getPasswordError } = require('../utils/validators');

const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count({ where: { role: ['user', 'owner'] } }),
      Store.count(),
      Rating.count(),
    ]);

    res.json({ success: true, data: { totalUsers, totalStores, totalRatings } });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      order: [[orderField, orderDir]],
    });

    const usersWithRating = await Promise.all(
      users.map(async (user) => {
        const userData = user.toJSON();
        if (user.role === 'owner') {
          const store = await Store.findOne({
            where: { owner_id: user.id },
            include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
          });
          if (store && store.ratings.length > 0) {
            const avg = store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length;
            userData.storeRating = parseFloat(avg.toFixed(2));
            userData.storeName = store.name;
          }
        }
        return userData;
      })
    );

    res.json({ success: true, data: usersWithRating });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const userData = user.toJSON();
    if (user.role === 'owner') {
      const store = await Store.findOne({
        where: { owner_id: user.id },
        include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
      });
      if (store && store.ratings.length > 0) {
        const avg = store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length;
        userData.storeRating = parseFloat(avg.toFixed(2));
        userData.storeName = store.name;
      }
    }

    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!validateName(name)) return res.status(400).json({ success: false, message: 'Name must be 20-60 characters.' });
    if (!validateEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email.' });
    if (!validatePassword(password)) return res.status(400).json({ success: false, message: getPasswordError() });
    if (!validateAddress(address)) return res.status(400).json({ success: false, message: 'Address max 400 characters.' });
    if (!['admin', 'user', 'owner'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role.' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({ name, email, password, address, role });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Error creating user.' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'email', 'address', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
      order: [[orderField, orderDir]],
    });

    const storesWithRating = stores.map((store) => {
      const s = store.toJSON();
      const ratings = s.ratings || [];
      s.averageRating = ratings.length > 0
        ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2))
        : 0;
      s.totalRatings = ratings.length;
      delete s.ratings;
      return s;
    });

    res.json({ success: true, data: storesWithRating });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stores.' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!validateName(name)) return res.status(400).json({ success: false, message: 'Store name must be 20-60 characters.' });
    if (!validateEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email.' });
    if (!validateAddress(address)) return res.status(400).json({ success: false, message: 'Address max 400 characters.' });

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Store email already exists.' });

    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner || owner.role !== 'owner') {
        return res.status(400).json({ success: false, message: 'Invalid owner. User must have owner role.' });
      }
    }

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });

    res.status(201).json({ success: true, message: 'Store created successfully.', data: store });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ success: false, message: 'Error creating store.' });
  }
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, createStore };
