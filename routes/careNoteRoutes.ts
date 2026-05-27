import express from "express";
import mongoose from "mongoose";
import CareNote from "../models/CareNote.js";
import Caregiver from "../models/Caregiver.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

async function createNotification(userId: string, type: any, title: string, message: string, relatedId?: string, relatedModel?: string) {
  try { await Notification.create({ user: userId, type, title, message, relatedId, relatedModel }); } catch (e) {}
}


// @desc    Add care note & vitals to a booking
// @route   POST /api/notes
// @access  Private
router.post("/", protect, async (req: any, res) => {
  try {
    const { booking, caregiver, note, bloodPressure, heartRate, spo2, temperature } = req.body;

    console.log("====================================================");
    console.log("             NEW CARE NOTE SUBMISSION");
    console.log("====================================================");
    console.log(`Caregiver ID : ${caregiver}`);
    console.log(`Booking ID   : ${booking}`);
    console.log("Payload      :", JSON.stringify(req.body, null, 2));

    // Resolve patient reference from the Booking
    let patientId = req.body.patient;
    if (!patientId && booking) {
      const BookingModel = mongoose.model("Booking");
      const bDoc: any = await BookingModel.findById(booking);
      if (bDoc) {
        patientId = bDoc.patient;
      }
    }

    // Telemetry Alert Logic
    let isAlert = false;
    let alertReason = "";

    if (heartRate && (heartRate > 100 || heartRate < 50)) {
      isAlert = true;
      alertReason += `Abnormal Heart Rate (${heartRate} BPM). `;
    }
    if (spo2 && spo2 < 95) {
      isAlert = true;
      alertReason += `Low SpO2 (${spo2}%). `;
    }
    if (temperature && (temperature > 100.4 || temperature < 97.0)) {
      isAlert = true;
      alertReason += `Abnormal Temperature (${temperature}°F). `;
    }
    if (bloodPressure) {
      const [sysStr, diaStr] = bloodPressure.split("/");
      const sys = parseInt(sysStr, 10);
      const dia = parseInt(diaStr, 10);
      if (!isNaN(sys) && !isNaN(dia)) {
        if (sys > 140 || sys < 90 || dia > 90 || dia < 60) {
          isAlert = true;
          alertReason += `Abnormal Blood Pressure (${bloodPressure}). `;
        }
      }
    }
    alertReason = alertReason.trim();

    const careNote = await CareNote.create({
      booking,
      caregiver,
      patient: patientId,
      note,
      bloodPressure,
      heartRate,
      spo2,
      temperature,
      isAlert,
      alertReason,
    });

    const populatedNote = await CareNote.findById(careNote._id)
      .populate("patient")
      .populate("caregiver")
      .populate({
        path: "booking",
        populate: [
          { path: "patient" },
          { path: "service" }
        ]
      });

    console.log("Saved CareNote Document in MongoDB:");
    console.log(JSON.stringify(populatedNote, null, 2));
    console.log("====================================================");



    // Notify patient if there's an alert
    if (isAlert && patientId) {
      try {
        const PatientModel = mongoose.model("Patient");
        const patientDoc: any = await PatientModel.findById(patientId);
        if (patientDoc?.user) {
          await createNotification(
            patientDoc.user.toString(),
            "alert_generated",
            "Health Alert!",
            `Your caregiver has logged an alert: ${alertReason}`,
            careNote._id.toString(), "CareNote"
          );
        }
      } catch (e) {}
    } else if (patientId) {
      // Notify patient of new care note
      try {
        const PatientModel = mongoose.model("Patient");
        const patientDoc: any = await PatientModel.findById(patientId);
        if (patientDoc?.user) {
          await createNotification(
            patientDoc.user.toString(),
            "care_note_added",
            "Care Note Added",
            `Your caregiver has added a new care note.`,
            careNote._id.toString(), "CareNote"
          );
        }
      } catch (e) {}
    }

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error("Error creating CareNote:", error);
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get all notes created by the current caregiver
// @route   GET /api/notes/me
// @access  Private
router.get("/me", protect, async (req: any, res) => {
  try {
    const cg = await Caregiver.findOne({ user: req.user._id });
    if (!cg) {
      return res.status(404).json({ message: "Caregiver profile not found" });
    }

    const notes = await CareNote.find({ caregiver: cg._id })
      .populate("patient")
      .populate({
        path: "booking",
        populate: [
          { path: "patient" },
          { path: "service" }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get all notes for a booking
// @route   GET /api/notes/booking/:bookingId
// @access  Private
router.get("/booking/:bookingId", protect, async (req: any, res) => {
  try {
    const notes = await CareNote.find({ booking: req.params.bookingId })
      .populate("patient")
      .populate("caregiver")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
