import mongoose from "mongoose";

const careNoteSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caregiver",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    note: {
      type: String,
      required: [true, "Please add clinical note content"],
    },
    // Vitals stored as flat root-level fields
    bloodPressure: {
      type: String,
    },
    heartRate: {
      type: Number,
    },
    spo2: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    // Optional nested block to support legacy CareNote formats
    vitalSigns: {
      bloodPressure: { type: String },
      heartRate: { type: Number },
      oxygenSaturation: { type: Number },
      temperature: { type: Number },
    },
    isAlert: {
      type: Boolean,
      default: false,
    },
    alertReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CareNote = (mongoose.models.CareNote || mongoose.model("CareNote", careNoteSchema)) as any;

export default CareNote;
