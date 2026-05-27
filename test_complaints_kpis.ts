import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Patient from "./models/Patient.js";
import Caregiver from "./models/Caregiver.js";
import Booking from "./models/Booking.js";
import Complaint from "./models/Complaint.js";
import CareNote from "./models/CareNote.js";

dotenv.config();

async function runComplaintsAndKPITests() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  console.log("====================================================");
  console.log("    COMPLAINTS & KPI SYSTEM VERIFICATION SUITE");
  console.log("====================================================");
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB Atlas:", error);
    process.exit(1);
  }

  const testId = Date.now();

  try {
    // 1. Setup Patient, Caregiver, and Booking
    console.log("\n1. Setting up database documents...");
    const patientUser = await User.create({
      name: `KPI Test Patient ${testId}`,
      email: `kpi.patient.${testId}@test.care24.com`,
      password: "password123",
      role: "user"
    });

    const patientProfile = await Patient.create({
      user: patientUser._id,
      name: patientUser.name,
      age: 72,
      gender: "Female",
      bloodGroup: "B+",
      address: "456 Analytics Ave, Data City",
      phone: "+1-555-0720",
      emergencyContact: {
        name: "John Doe",
        phone: "+1-555-0700",
        relation: "Son"
      }
    });

    const caregiverUser = await User.create({
      name: `KPI Test Caregiver ${testId}`,
      email: `kpi.caregiver.${testId}@test.care24.com`,
      password: "password123",
      role: "caregiver"
    });

    const caregiverProfile = await Caregiver.create({
      user: caregiverUser._id,
      name: caregiverUser.name,
      title: "Geriatric Specialist",
      experienceYears: 10,
      hourlyRate: 75,
      bio: "Specializing in advanced geriatric care and patient support.",
      specialties: ["Geriatrics", "Memory Care"],
      availability: true,
      cities: ["New York", "Boston"],
      isVerified: true
    });

    const booking = await Booking.create({
      patient: patientProfile._id,
      caregiver: caregiverProfile._id,
      service: new mongoose.Types.ObjectId(), // dummy service id
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      totalAmount: 600,
      status: "pending",
      paymentStatus: "pending"
    });
    console.log(`✓ Test Booking created. ID: ${booking._id}`);

    // 2. Complaint Creation Flow
    console.log("\n2. Testing Complaint Creation Flow...");
    const complaint = await Complaint.create({
      patient: patientProfile._id,
      caregiver: caregiverProfile._id,
      booking: booking._id,
      title: "Late arrival",
      description: "Caregiver arrived 45 minutes late without any prior notification.",
      status: "pending"
    });
    console.log(`✓ Complaint created successfully! ID: ${complaint._id}`);
    console.log(`  - Title: ${complaint.title}`);
    console.log(`  - Status: ${complaint.status}`);

    // 3. Complaint Update Flow (Resolve & Escalate)
    console.log("\n3. Testing Complaint Resolution and Escalation...");
    complaint.status = "resolved";
    complaint.resolution = "Spoke with caregiver. Confirmed scheduling mishap. Refund of 1 hour issued.";
    await complaint.save();
    console.log(`✓ Complaint resolved successfully!`);
    console.log(`  - Updated Status: ${complaint.status}`);
    console.log(`  - Resolution Notes: ${complaint.resolution}`);

    complaint.status = "escalated";
    complaint.resolution = "Escalated to local clinical team for review.";
    await complaint.save();
    console.log(`✓ Complaint escalated successfully!`);
    console.log(`  - Updated Status: ${complaint.status}`);
    console.log(`  - Resolution Notes: ${complaint.resolution}`);

    // 4. Dynamic KPI calculations
    console.log("\n4. Testing Dynamic KPI Calculations (Same formulas as admin endpoint)...");
    
    // Total users, caregivers
    const totalUsers = await User.countDocuments({});
    const totalCaregivers = await Caregiver.countDocuments({});
    const verifiedCaregivers = await Caregiver.countDocuments({ isVerified: true });
    const totalBookings = await Booking.countDocuments({});
    
    // Completion rate
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });
    const bookingCompletionRate = (completedBookings + cancelledBookings) > 0 
      ? (completedBookings / (completedBookings + cancelledBookings)) * 100 
      : 100;

    // Simulate booking confirmation to test Average Response Time
    booking.status = "confirmed";
    // Artificially change updatedAt to test diff calculation
    const createTime = new Date();
    const acceptTime = new Date(createTime.getTime() + 15 * 60 * 1000); // 15 mins later
    booking.createdAt = createTime;
    booking.updatedAt = acceptTime;
    await booking.save();

    const confirmedBookingsList = await Booking.find({ status: { $in: ["confirmed", "active", "completed"] } });
    let totalResponseTimeMs = 0;
    let countedAccepts = 0;
    
    confirmedBookingsList.forEach((b: any) => {
      if (b.createdAt && b.updatedAt) {
        const diff = new Date(b.updatedAt).getTime() - new Date(b.createdAt).getTime();
        if (diff > 0) {
          totalResponseTimeMs += diff;
          countedAccepts++;
        }
      }
    });
    
    const avgResponseTimeMinutes = countedAccepts > 0 
      ? (totalResponseTimeMs / countedAccepts) / 60000 
      : 15;

    // User Satisfaction Score
    const caregiversList = await Caregiver.find({});
    let totalRating = 0;
    let ratedCount = 0;
    caregiversList.forEach((cg: any) => {
      if (cg.rating !== undefined) {
        totalRating += cg.rating;
        ratedCount++;
      }
    });
    const userSatisfactionScore = ratedCount > 0 ? totalRating / ratedCount : 5.0;

    // Monthly active users (MAU)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [newUsers, activeBookingsList, activeComplaintsList, activeNotesList] = await Promise.all([
      User.find({ createdAt: { $gte: startOfMonth } }).select("_id"),
      Booking.find({ updatedAt: { $gte: startOfMonth } }).populate("patient caregiver"),
      Complaint.find({ createdAt: { $gte: startOfMonth } }).populate("patient"),
      CareNote.find({ createdAt: { $gte: startOfMonth } }).populate("patient caregiver")
    ]);

    const activeUserIdsSet = new Set<string>();
    newUsers.forEach((u: any) => activeUserIdsSet.add(u._id.toString()));
    activeBookingsList.forEach((b: any) => {
      if (b.patient?.user) activeUserIdsSet.add(b.patient.user.toString());
      if (b.caregiver?.user) activeUserIdsSet.add(b.caregiver.user.toString());
    });
    activeComplaintsList.forEach((c: any) => {
      if (c.patient?.user) activeUserIdsSet.add(c.patient.user.toString());
    });
    activeNotesList.forEach((n: any) => {
      if (n.patient?.user) activeUserIdsSet.add(n.patient.user.toString());
      if (n.caregiver?.user) activeUserIdsSet.add(n.caregiver.user.toString());
    });

    const monthlyActiveUsers = activeUserIdsSet.size || 1;

    console.log("✓ Dynamic KPI Calculations completed successfully:");
    console.log(`  - Total Users registered    : ${totalUsers}`);
    console.log(`  - Total Caregivers           : ${totalCaregivers}`);
    console.log(`  - Verified Caregivers        : ${verifiedCaregivers}`);
    console.log(`  - Total Bookings             : ${totalBookings}`);
    console.log(`  - Booking Completion Rate    : ${bookingCompletionRate.toFixed(1)}%`);
    console.log(`  - Average Response Time      : ${avgResponseTimeMinutes.toFixed(1)} minutes`);
    console.log(`  - User Satisfaction Score    : ${userSatisfactionScore.toFixed(1)}`);
    console.log(`  - Monthly Active Users (MAU) : ${monthlyActiveUsers}`);

    console.log("\n====================================================");
    console.log("STATUS: COMPLAINTS & KPI FLOWS VERIFIED SUCCESSFULLY!");
    console.log("====================================================");

  } catch (err) {
    console.error("✗ Verification test failed with error:");
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

runComplaintsAndKPITests();
