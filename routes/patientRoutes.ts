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

// @desc    Create or update patient profile
// @route   POST /api/patients
// @access  Private
router.post("/", protect, async (req: any, res) => {
  try {
    console.log(`[POST /api/patients] Received body:`, JSON.stringify(req.body));
    console.log(`[POST /api/patients] Authenticated User ID: ${req.user?._id}`);

    let patient = await Patient.findOne({ user: req.user._id });

    if (patient) {
      console.log(`[POST /api/patients] Patient profile exists. Updating...`);
      patient = await Patient.findOneAndUpdate({ user: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      });
      console.log(`[POST /api/patients] Update result:`, JSON.stringify(patient));
      return res.json(patient);
    }

    console.log(`[POST /api/patients] Creating new patient profile...`);
    patient = await Patient.create({
      user: req.user._id,
      ...req.body,
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
      if (
        req.user.role !== "admin" &&
        req.user.role !== "caregiver" &&
        patientUserId !== req.user._id.toString()
      ) {
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
