import express from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get current user's patient profile
// @route   GET /api/patients/me
// @access  Private
router.get("/me", protect, async (req: any, res) => {
  try {
    console.log(`[GET /api/patients/me] Fetching patient profile for User ID: ${req.user?._id}`);
    const patient = await Patient.findOne({ user: req.user._id });
    console.log(`[GET /api/patients/me] Query result: ${patient ? `Found profile with ID: ${patient._id}` : "Not found"}`);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: "Patient profile not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

function toProperCase(str: string): string {
  if (!str) return str;
  return str
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function cleanPhone(phone: string): string {
  if (!phone) return phone;
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return (hasPlus ? "+" : "") + digits;
}

// @desc    Create or update patient profile
// @route   POST /api/patients
// @access  Private
router.post("/", protect, async (req: any, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users with role 'user' can create or update a patient profile" });
    }

    console.log(`[POST /api/patients] Received body:`, JSON.stringify(req.body));
    console.log(`[POST /api/patients] Authenticated User ID: ${req.user?._id}`);

    const normalizedBody = { ...req.body };
    if (normalizedBody.name) {
      normalizedBody.name = toProperCase(normalizedBody.name.trim());
    }
    if (normalizedBody.phone) {
      normalizedBody.phone = cleanPhone(normalizedBody.phone);
    }
    if (normalizedBody.emergencyContact) {
      normalizedBody.emergencyContact = { ...normalizedBody.emergencyContact };
      if (normalizedBody.emergencyContact.name) {
        normalizedBody.emergencyContact.name = toProperCase(normalizedBody.emergencyContact.name.trim());
      }
      if (normalizedBody.emergencyContact.phone) {
        normalizedBody.emergencyContact.phone = cleanPhone(normalizedBody.emergencyContact.phone);
      }
    }

    let patient = await Patient.findOne({ user: req.user._id });

    if (patient) {
      console.log(`[POST /api/patients] Patient profile exists. Updating...`);
      patient = await Patient.findOneAndUpdate({ user: req.user._id }, normalizedBody, {
        new: true,
        runValidators: true,
      });
      console.log(`[POST /api/patients] Update result:`, JSON.stringify(patient));
      return res.json(patient);
    }

    console.log(`[POST /api/patients] Creating new patient profile...`);
    patient = await Patient.create({
      user: req.user._id,
      ...normalizedBody,
    });

    console.log(`[POST /api/patients] Create result:`, JSON.stringify(patient));
    res.status(201).json(patient);
  } catch (error) {
    console.error(`[POST /api/patients] Error:`, (error as Error).stack);
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
router.get("/:id", protect, async (req: any, res) => {
  try {
    console.log(`[GET /api/patients/:id] Fetching patient ID: ${req.params.id} for user: ${req.user?._id}`);

    const patient: any = await Patient.findById(req.params.id).populate("user", "name email");
    if (patient) {
      const patientUserId = patient.user && (patient.user._id ? patient.user._id.toString() : patient.user.toString());
      if (req.user.role === "caregiver") {
        const CaregiverModel = mongoose.model("Caregiver");
        const BookingModel = mongoose.model("Booking");
        const cg = (await CaregiverModel.findOne({ user: req.user._id })) as any;
        if (!cg) {
          return res.status(403).json({ message: "Not authorized to access this profile" });
        }
        const bookingExists = await BookingModel.findOne({
          patient: patient._id,
          caregiver: cg._id,
        });
        if (!bookingExists) {
          return res.status(403).json({ message: "Not authorized to access unrelated patient profile" });
        }
      } else if (req.user.role !== "admin" && patientUserId !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to access this profile" });
      }
      res.json(patient);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
