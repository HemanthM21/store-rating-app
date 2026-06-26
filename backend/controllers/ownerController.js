const { Store, Rating, User } = require('../models');

const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'No store found for this owner.' });
    }

    const ratings = store.ratings || [];
    const averageRating = ratings.length > 0
      ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2))
      : 0;

    const ratingsList = ratings.map((r) => ({
      id: r.id,
      rating: r.rating,
      userName: r.user.name,
      userEmail: r.user.email,
      submittedAt: r.createdAt,
    }));

    res.json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
        },
        averageRating,
        totalRatings: ratings.length,
        ratings: ratingsList,
      },
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data.' });
  }
};

module.exports = { getOwnerDashboard };
