import express from "express";
import mongoose from "mongoose";
import ServiceCategory from "../models/ServiceCategory.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all service categories
// @route   GET /api/services
// @access  Public
router.get("/", async (req, res) => {
  try {
    const services = await ServiceCategory.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Create service category (Admin access)
// @route   POST /api/services
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const service = await ServiceCategory.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Update service category (Admin access)
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const service = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: "Service category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
