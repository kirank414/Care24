import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add patient name"],
    },
    age: {
      type: Number,
      required: [true, "Please add patient age"],
    },
    imageUrl: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Please add patient gender"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Please add blood group"],
    },
    address: {
      type: String,
      required: [true, "Please add address"],
    },
    phone: {
      type: String,
      required: [true, "Please add phone number"],
    },
    medicalHistory: [
      {
        type: String,
      },
    ],
    allergies: [
      {
        type: String,
      },
    ],
    currentMedications: [
      {
        type: String,
      },
    ],
    mobilityStatus: {
      type: String,
      enum: ["Independent", "Assisted (Cane/Walker)", "Wheelchair Bound", "Bedridden"],
      default: "Independent",
    },
    careRequirements: [
      {
        type: String,
      },
    ],
    chronicConditions: [
      {
        type: String,
      },
    ],
    preferredLanguage: {
      type: String,
      default: "English",
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, required: true },
      notificationPreference: { type: String, enum: ["SMS", "Email", "Phone Call", "WhatsApp"], default: "SMS" },
    },
  },
  {
    timestamps: true,
  }
);

const Patient = (mongoose.models.Patient || mongoose.model("Patient", patientSchema)) as any;

export default Patient;
