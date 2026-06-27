const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db');
const { User, Store, Rating } = require('./models');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Store Rating API is running 🚀' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  await sequelize.sync({ alter: true });
  console.log('✅ Database tables synced');

  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    await User.create({
      name: 'System Administrator User',
      email: 'admin@storeratingapp.com',
      password: 'Admin@1234', // default password
      address: 'System Default Admin Address Block',
      role: 'admin',
    });
    console.log('✅ Default admin created');
    console.log('   Email:    admin@storeratingapp.com');
    console.log('   Password: Admin@1234');
  } else {
    console.log('ℹ️  Admin already exists:', adminExists.email);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();