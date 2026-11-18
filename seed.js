require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');
    
    // 1. Wipe ALL data from the database
    console.log('🧹 Deleting all old data...');
    await User.deleteMany({});
    await Item.deleteMany({});
    await Claim.deleteMany({});
    
    // 2. Create ONLY the Admin account (so you can log in to approve claims)
    console.log('👑 Creating Admin account...');
    await User.create({ 
      name: 'Portal Admin', 
      email: 'admin@example.com', 
      password: 'admin123', 
      isAdmin: true 
    });
    
    console.log('✅ Database is completely fresh and empty!');
    console.log('👉 Admin Email: admin@example.com | Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seed();