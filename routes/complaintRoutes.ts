import express from "express";
import mongoose from "mongoose";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// @desc    File a new complaint
// @route   POST /api/complaints
// @access  Private (Patient/User)
router.post("/", protect, async (req: any, res) => {
  try {
    const { bookingId, booking: bookingParam, title, description } = req.body;
    const finalBookingId = bookingId || bookingParam;

    if (!finalBookingId || !title || !description) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const Patient = mongoose.model("Patient");
    const patientProfile: any = await Patient.findOne({ user: req.user._id });

    if (!patientProfile) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Verify booking exists and belongs to patient
    const booking = await Booking.findById(finalBookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.patient.toString() !== patientProfile._id.toString()) {
      return res.status(403).json({ message: "Not authorized to file complaint for this booking" });
    }

    const existingComplaint = await Complaint.findOne({
      patient: patientProfile._id,
      booking: booking._id
    });
    
    if (existingComplaint) {
      return res.status(400).json({ message: "A complaint/dispute has already been filed for this booking." });
    }

    const complaint = await Complaint.create({
      patient: patientProfile._id,
      caregiver: booking.caregiver,
      booking: booking._id,
      title,
      description,
      status: "pending"
    });

    // Populate references for return
    const populated = await Complaint.findById(complaint._id)
      .populate("patient")
      .populate("caregiver")
      .populate({
        path: "booking",
        populate: { path: "service" }
      });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate("patient")
      .populate("caregiver")
      .populate({
        path: "booking",
        populate: { path: "service" }
      })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Resolve or Escalate complaint
// @route   PUT /api/complaints/:id
// @access  Private (Admin)
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { status, adminMessageToPatient, adminWarningToCaregiver } = req.body;

    if (!status || !["resolved", "escalated"].includes(status)) {
      return res.status(400).json({ message: "Please provide a valid status: resolved or escalated" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    complaint.resolutionType = status === "resolved" ? "Resolved" : "Escalated";
    
    if (adminMessageToPatient !== undefined) {
      complaint.resolution = adminMessageToPatient;
    }
    
    if (adminWarningToCaregiver !== undefined) {
      complaint.caregiverWarning = adminWarningToCaregiver;
    }

    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate("patient")
      .populate("caregiver")
      .populate({
        path: "booking",
        populate: { path: "service" }
      });

    // Send notifications
    try {
      if (adminMessageToPatient && populated.patient && populated.patient.user) {
        await Notification.create({
          user: populated.patient.user,
          type: "admin_message",
          title: "Complaint Update",
          message: adminMessageToPatient
        });
      }

      if (adminWarningToCaregiver && adminWarningToCaregiver.trim() !== "" && populated.caregiver && populated.caregiver.user) {
        await Notification.create({
          user: populated.caregiver.user,
          type: "admin_warning",
          title: "Admin Notice",
          message: adminWarningToCaregiver
        });
      }
    } catch (notifErr) {
      console.error("Failed to send complaint notifications:", notifErr);
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
