import mongoose from 'mongoose';
import Inquiry from './models/Inquiry.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  console.log('Inquiries count:', inquiries.length);
  
  if (inquiries.length > 0) {
    const target = inquiries[0];
    console.log('Target ID:', target._id.toString());
    
    // Attempt to manually update it like the route does
    target.answer = 'This is a script test answer ' + Date.now();
    target.status = 'Resolved';
    
    try {
      await target.save();
      console.log('Successfully saved target inquiry!');
    } catch (e) {
      console.error('Error saving inquiry:', e);
    }
  }

  process.exit(0);
}

run();
