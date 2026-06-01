import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';
import User from './models/User.js';
import Patient from './models/Patient.js';
import Caregiver from './models/Caregiver.js';
import Complaint from './models/Complaint.js';
import Notification from './models/Notification.js';
import ServiceCategory from './models/ServiceCategory.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/care24');
  console.log('Connected to DB');

  try {
    // 1. Setup mock data
    const adminUser = await User.findOne({ role: 'admin' });
    const patientUser = await User.findOne({ role: 'patient' });
    const caregiverUser = await User.findOne({ role: 'caregiver' });

    if (!adminUser || !patientUser || !caregiverUser) {
      console.log('Missing test users');
      process.exit(1);
    }

    const patient = await Patient.findOne({ user: patientUser._id });
    const caregiver = await Caregiver.findOne({ user: caregiverUser._id });
    const service = await ServiceCategory.findOne({});

    if (!patient || !caregiver || !service) {
      console.log('Missing patient, caregiver, or service');
      process.exit(1);
    }

    // Create a mock booking
    const booking = await Booking.create({
      patient: patient._id,
      caregiver: caregiver._id,
      service: service._id,
      startDate: new Date(),
      endDate: new Date(),
      status: 'active',
      totalAmount: 100
    });

    console.log('1. Created Mock Booking');

    // Create a complaint
    const complaint = await Complaint.create({
      patient: patient._id,
      caregiver: caregiver._id,
      booking: booking._id,
      title: 'Caregiver was late',
      description: 'Caregiver arrived 1 hour late.',
      status: 'pending'
    });

    console.log(`2. Created Complaint: ${complaint._id}`);

    // Login as Admin
    const adminLoginRes = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminUser.email, password: 'password123' })
    });
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;

    // Escalate the complaint (no warning)
    const escalateRes = await fetch(`http://localhost:5000/api/complaints/${complaint._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'escalated',
        adminMessageToPatient: 'Your complaint is being investigated.',
        adminWarningToCaregiver: ''
      })
    });
    
    const escalateData = await escalateRes.json();
    console.log(`3. Escalated Complaint Status: ${escalateData.status}, Type: ${escalateData.resolutionType}`);

    // Verify Notification for Patient exists
    const ptNotifs = await Notification.find({ user: patientUser._id, type: 'admin_message' });
    console.log(`4. Patient 'admin_message' Notifications Count: ${ptNotifs.length}`);

    // Verify Caregiver Notification does NOT exist
    const cgNotifs = await Notification.find({ user: caregiverUser._id, type: 'admin_warning' });
    console.log(`5. Caregiver 'admin_warning' Notifications Count: ${cgNotifs.length}`);

    // Resolve the complaint (with warning)
    const resolveRes = await fetch(`http://localhost:5000/api/complaints/${complaint._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'resolved',
        adminMessageToPatient: 'The caregiver has been warned. Issue resolved.',
        adminWarningToCaregiver: 'Please be on time in the future. This is a final warning.'
      })
    });
    
    const resolveData = await resolveRes.json();
    console.log(`6. Resolved Complaint Status: ${resolveData.status}, Type: ${resolveData.resolutionType}`);

    // Verify Caregiver Notification DOES exist now
    const cgNotifsAfter = await Notification.find({ user: caregiverUser._id, type: 'admin_warning' });
    console.log(`7. Caregiver 'admin_warning' Notifications Count After Resolve: ${cgNotifsAfter.length}`);

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();
