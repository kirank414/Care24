const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function fixAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@care24.com' },
      { $set: { password: hashedPassword } }
    );
    console.log('Admin password explicitly forced to password123');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

fixAdminPassword();
