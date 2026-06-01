import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import SystemSetting from "../models/SystemSetting.js";

const router = express.Router();

// @desc    Get system settings
// @route   GET /api/settings
// @access  Public
router.get("/", async (req, res) => {
  try {
    let settings = await SystemSetting.findOne({ key: "global" });
    if (!settings) {
      settings = await SystemSetting.create({ key: "global" });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to retrieve settings" });
  }
});

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put("/", protect, authorize("admin"), async (req, res) => {
  try {
    const updates = req.body;
    let settings = await SystemSetting.findOne({ key: "global" });
    if (!settings) {
      settings = new SystemSetting({ key: "global" });
    }

    const fields = [
      "heroTitle", "heroSubtitle", "heroPrimaryCTA", "heroSecondaryCTA",
      "satisfactionTitle", "satisfactionDescription", "caregiverTrustTitle", 
      "caregiverTrustDescription", "serviceCoverageTitle", "serviceCoverageDescription",
      "companyName", "footerDescription", "supportEmail", "supportPhone", 
      "whatsappNumber", "supportHours", "officeAddress", "emergencyContact", 
      "supportedCities", "facebookUrl", "instagramUrl", "linkedinUrl", "twitterUrl"
    ];

    fields.forEach(field => {
      if (updates[field] !== undefined) {
        settings[field] = updates[field];
      }
    });

    await settings.save();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update settings" });
  }
});

export default router;
