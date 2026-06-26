const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'address', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'user_id'] }],
      order: [[orderField, orderDir]],
    });

    const result = stores.map((store) => {
      const s = store.toJSON();
      const ratings = s.ratings || [];
      const userRating = ratings.find((r) => r.user_id === req.user.id);

      s.averageRating = ratings.length > 0
        ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2))
        : 0;
      s.totalRatings = ratings.length;
      s.userRating = userRating ? userRating.rating : null;
      delete s.ratings;
      return s;
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stores.' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found.' });

    const existingRating = await Rating.findOne({ where: { user_id: req.user.id, store_id: id } });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ success: true, message: 'Rating updated successfully.', data: existingRating });
    }

    const newRating = await Rating.create({ rating, user_id: req.user.id, store_id: id });
    res.status(201).json({ success: true, message: 'Rating submitted successfully.', data: newRating });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ success: false, message: 'Error submitting rating.' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await Rating.findOne({ where: { user_id: req.user.id, store_id: id } });
    if (!rating) return res.status(404).json({ success: false, message: 'No rating found for this store.' });

    await rating.destroy();
    res.json({ success: true, message: 'Rating removed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting rating.' });
  }
};

module.exports = { getStores, submitRating, deleteRating };
