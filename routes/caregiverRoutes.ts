import express from "express";
import mongoose from "mongoose";
import Caregiver, { updateServicePrices } from "../models/Caregiver.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all verified caregivers (Public/User access)
// @route   GET /api/caregivers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const caregivers = await Caregiver.find({ isVerified: true }).populate("user", "name email");
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get all caregivers including unverified (Admin access)
// @route   GET /api/caregivers/admin
// @access  Private/Admin
router.get("/admin", protect, authorize("admin"), async (req, res) => {
  try {
    const caregivers = await Caregiver.find({}).populate("user", "name email");
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get current user's caregiver profile
// @route   GET /api/caregivers/me
// @access  Private/Caregiver
router.get("/me", protect, async (req: any, res) => {
  try {
    const caregiver = await Caregiver.findOne({ user: req.user._id });
    if (caregiver) {
      res.json(caregiver);
    } else {
      res.status(404).json({ message: "Caregiver profile not found" });
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

// @desc    Create or update caregiver profile
// @route   POST /api/caregivers
// @access  Private
router.post("/", protect, async (req: any, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Only users with role 'caregiver' can create or update a caregiver profile" });
    }

    console.log(`[POST /api/caregivers] Received body:`, JSON.stringify(req.body));
    console.log(`[POST /api/caregivers] Authenticated User ID: ${req.user?._id}`);

    const rawName = req.body.name || req.user.name;
    const payload = {
      ...req.body,
      name: rawName ? toProperCase(rawName.trim()) : "",
    };

    let caregiver = await Caregiver.findOne({ user: req.user._id });

    if (caregiver) {
      console.log(`[POST /api/caregivers] Caregiver profile exists. Updating...`);
      caregiver = await Caregiver.findOneAndUpdate({ user: req.user._id }, payload, {
        new: true,
        runValidators: true,
      });
      console.log(`[POST /api/caregivers] Update result:`, JSON.stringify(caregiver));
      return res.json(caregiver);
    }

    console.log(`[POST /api/caregivers] Creating new caregiver profile...`);
    caregiver = await Caregiver.create({
      user: req.user._id,
      ...payload,
      isVerified: false, // Default to unverified
    });

    console.log(`[POST /api/caregivers] Create result:`, JSON.stringify(caregiver));
    res.status(201).json(caregiver);
  } catch (error) {
    console.error(`[POST /api/caregivers] Error:`, (error as Error).stack);
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Admin verify caregiver
// @route   PUT /api/caregivers/:id/verify
// @access  Private/Admin
router.put("/:id/verify", protect, authorize("admin"), async (req: any, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate("user", "name email");

    if (caregiver) {
      res.json(caregiver);
    } else {
      res.status(404).json({ message: "Caregiver not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Admin revoke caregiver verification
// @route   PUT /api/caregivers/:id/revoke
// @access  Private/Admin
router.put("/:id/revoke", protect, authorize("admin"), async (req: any, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    ).populate("user", "name email");

    if (caregiver) {
      res.json(caregiver);
    } else {
      res.status(404).json({ message: "Caregiver not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Admin delete caregiver profile
// @route   DELETE /api/caregivers/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req: any, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndDelete(req.params.id);
    if (caregiver) {
      await updateServicePrices();
      res.json({ message: "Caregiver profile deleted successfully" });
    } else {
      res.status(404).json({ message: "Caregiver not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Toggle availability status
// @route   PUT /api/caregivers/me/availability
// @access  Private/Caregiver
router.put("/me/availability", protect, async (req: any, res) => {
  try {
    const { availability } = req.body;

    const caregiver = await Caregiver.findOneAndUpdate(
      { user: req.user._id },
      { availability: availability !== undefined ? availability : true },
      { new: true }
    );

    if (caregiver) {
      res.json(caregiver);
    } else {
      res.status(404).json({ message: "Caregiver profile not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Admin toggle caregiver availability
// @route   PUT /api/caregivers/:id/availability
// @access  Private/Admin
router.put("/:id/availability", protect, authorize("admin"), async (req: any, res) => {
  try {
    const { availability } = req.body;
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { availability: availability !== undefined ? availability : true },
      { new: true }
    ).populate("user", "name email");

    if (caregiver) {
      res.json(caregiver);
    } else {
      res.status(404).json({ message: "Caregiver profile not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
