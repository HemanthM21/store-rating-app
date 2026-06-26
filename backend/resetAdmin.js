require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  await connectDB();
  await sequelize.sync();

  await User.destroy({ where: { email: 'admin@storeratingapp.com' } });
  console.log('🗑️  Old admin removed');

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('Admin@1234', salt);

  await User.create({
    name: 'System Administrator User',
    email: 'admin@storeratingapp.com',
    password: hashedPassword,
    address: 'System Default Admin Address Block',
    role: 'admin',
  }, { hooks: false });

  console.log('✅ Admin reset successfully!');
  console.log('   Email:    admin@storeratingapp.com');
  console.log('   Password: Admin@1234');
  process.exit(0);
};

resetAdmin().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
