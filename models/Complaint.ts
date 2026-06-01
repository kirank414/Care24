import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caregiver",
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "escalated"],
      default: "pending",
    },
    resolution: {
      type: String,
      default: "",
    },
    resolutionType: {
      type: String,
      enum: ["Open", "Escalated", "Resolved"],
      default: "Open",
    },
    caregiverWarning: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = (mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema)) as any;

export default Complaint;
