import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add caregiver name"],
    },
    title: {
      type: String,
      required: [true, "Please add professional title (e.g., Elite RN)"],
    },
    experienceYears: {
      type: Number,
      required: [true, "Please add years of experience"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Please add hourly rate"],
    },
    bio: {
      type: String,
      required: [true, "Please add professional bio"],
    },
    specialties: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    cities: [
      {
        type: String,
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Unverified caregivers remain hidden from public Expert Network until admin approval
    },
    rating: {
      type: Number,
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

const Caregiver = (mongoose.models.Caregiver || mongoose.model("Caregiver", caregiverSchema)) as any;

export default Caregiver;
