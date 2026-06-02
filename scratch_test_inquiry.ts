import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inquiry from './models/Inquiry.js';
import User from './models/User.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/care24');
  console.log('Connected to DB');

  try {
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Missing admin user');
      process.exit(1);
    }

    // Login as Admin
    const adminLoginRes = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminUser.email, password: 'password123' })
    });
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;

    // Create a mock inquiry
    const inquiry = await Inquiry.create({
      name: 'Test User',
      email: 'test@example.com',
      question: 'How do I reset my password?',
      status: 'Open'
    });

    console.log(`Created Inquiry: ${inquiry._id}`);

    // Answer the inquiry
    const answerRes = await fetch(`http://localhost:3000/api/inquiries/${inquiry._id}/answer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        answer: 'You can reset your password from the login page.'
      })
    });
    
    if (!answerRes.ok) {
      const errorText = await answerRes.text();
      console.error(`Error answering inquiry: ${answerRes.status} ${answerRes.statusText}`, errorText);
    } else {
      const answerData = await answerRes.json();
      console.log(`Answered Inquiry Status: ${answerData.status}, Answer: ${answerData.answer}`);
    }

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();
