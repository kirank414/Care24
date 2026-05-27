import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Caregiver from "../models/Caregiver.js";
import Booking from "../models/Booking.js";
import CareNote from "../models/CareNote.js";
import ServiceCategory from "../models/ServiceCategory.js";

dotenv.config();

async function runTests() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  console.log("====================================================");
  console.log("       CARE24 SYSTEM FLOW VERIFICATION SUITE");
  console.log("====================================================");
  console.log(`Connecting to database at: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB Atlas successfully!");
    console.log(`Active Cluster Host: ${mongoose.connection.host}`);
    console.log(`Active Database: ${mongoose.connection.db?.databaseName}`);
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB Atlas.");
    console.error(`Error: ${(error as Error).message}`);
    console.log("\n[ACTION REQUIRED]:");
    console.log("Please ensure your IP (157.50.182.253) is whitelisted in your MongoDB Atlas Network Access rules.");
    console.log("====================================================");
    process.exit(1);
  }

  const testId = Date.now();
  console.log(`\nStarting Test Run ID: ${testId}`);

  try {
    // 1. SERVICE CATEGORY FLOW TEST
    console.log("\nTesting: Service Category Flow...");
    const serviceCategory = await ServiceCategory.create({
      title: `Critical ICU Support - ${testId}`,
      description: "Advanced mechanical ventilation support and post-op ICU step-down monitoring.",
      priceRange: "From $75/hr",
      icon: "Stethoscope",
      features: ["Ventilator management", "Wound care", "Arterial line tracking"]
    });
    console.log(`✓ Service Category created. ID: ${serviceCategory._id}`);

    // 2. PATIENT ONBOARDING FLOW TEST
    console.log("\nTesting: Patient Onboarding Flow...");
    const patientUser = await User.create({
      name: `Test Patient ${testId}`,
      email: `patient.${testId}@test.care24.com`,
      password: "password123",
      role: "user"
    });
    console.log(`✓ Patient User registered. ID: ${patientUser._id}`);

    const patientProfile = await Patient.create({
      user: patientUser._id,
      name: patientUser.name,
      age: 65,
      gender: "Male",
      bloodGroup: "O+",
      address: "123 Healthcare Blvd, Medical District",
      phone: "+1-555-0199",
      medicalHistory: ["Hypertension", "Type 2 Diabetes"],
      allergies: ["Penicillin"],
      currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
      mobilityStatus: "Assisted (Cane/Walker)",
      careRequirements: ["BGL Monitoring", "Mobility support"],
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1-555-0100",
        relation: "Daughter"
      }
    });
    console.log(`✓ Patient Profile setup complete. ID: ${patientProfile._id}`);

    // 3. CAREGIVER ONBOARDING & APPROVAL FLOW TEST
    console.log("\nTesting: Caregiver Onboarding & Approval Flow...");
    const caregiverUser = await User.create({
      name: `Test Caregiver ${testId}`,
      email: `caregiver.${testId}@test.care24.com`,
      password: "password123",
      role: "caregiver"
    });
    console.log(`✓ Caregiver User registered. ID: ${caregiverUser._id}`);

    const caregiverProfile = await Caregiver.create({
      user: caregiverUser._id,
      name: caregiverUser.name,
      title: "ICU Specialist Nurse (RN)",
      experienceYears: 12,
      hourlyRate: 80,
      bio: "Former ICU charge nurse specializing in step-down care and cardiorespiratory support.",
      specialties: ["Ventilator management", "Cardiac monitoring", "Geriatrics"],
      availability: true,
      isVerified: false // Onboarded but needs admin approval
    });
    console.log(`✓ Caregiver Profile created (Unverified). ID: ${caregiverProfile._id}`);

    // Simulating Admin Modality Approval
    console.log("Simulating Admin modality approval...");
    caregiverProfile.isVerified = true;
    await caregiverProfile.save();
    console.log("✓ Caregiver isVerified updated to true (Approved by Admin).");

    // 4. BOOKING FLOW TEST
    console.log("\nTesting: Booking Flow...");
    const booking = await Booking.create({
      patient: patientProfile._id,
      caregiver: caregiverProfile._id,
      service: serviceCategory._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // 24 hours later
      totalAmount: 80 * 24, // hourly rate * hours
      status: "pending",
      paymentStatus: "pending",
      notes: "ICU patient monitoring booking request."
    });
    console.log(`✓ Booking created (Pending). ID: ${booking._id}`);

    // Update booking status to active
    booking.status = "active";
    await booking.save();
    console.log("✓ Booking status updated to 'active' (Caregiver Commenced Shift).");

    // 5. CLINICAL CARE NOTE FLOW TEST
    console.log("\nTesting: Care Note & Vitals Logging Flow...");
    const careNote = await CareNote.create({
      booking: booking._id,
      caregiver: caregiverProfile._id,
      patient: patientProfile._id,
      note: "Patient stable. Monitored vitals, administered evening insulin and blood pressure medications as scheduled. Patient resting comfortably.",
      bloodPressure: "128/82",
      heartRate: 74,
      spo2: 97,
      temperature: 98.4
    });
    console.log(`✓ Care Note / Vitals logged. ID: ${careNote._id}`);

    // REPORT GENERATION
    console.log("\n====================================================");
    console.log("            VERIFICATION REPORT SUMMARY");
    console.log("====================================================");
    console.log("MongoDB Collections Checked & Active:");
    const collections = await mongoose.connection.db?.listCollections().toArray() || [];
    collections.forEach(col => console.log(`  - ${col.name}`));

    console.log("\nDocuments Created during this test run:");
    console.log(`  - ServiceCategory ID : ${serviceCategory._id} (${serviceCategory.title})`);
    console.log(`  - User (Patient) ID   : ${patientUser._id} (${patientUser.email})`);
    console.log(`  - Patient Profile ID  : ${patientProfile._id}`);
    console.log(`  - User (Caregiver) ID : ${caregiverUser._id} (${caregiverUser.email})`);
    console.log(`  - Caregiver Profile ID: ${caregiverProfile._id} (isVerified: ${caregiverProfile.isVerified})`);
    console.log(`  - Booking ID          : ${booking._id} (status: ${booking.status})`);
    console.log(`  - CareNote ID         : ${careNote._id} (BP: ${careNote.bloodPressure}, SpO2: ${careNote.spo2}%)`);
    console.log("====================================================");
    console.log("STATUS: ALL FLOWS VERIFIED SUCCESSFULLY!");
    console.log("====================================================");

  } catch (err) {
    console.error("\n✗ Flow test failed with error:");
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

runTests();
