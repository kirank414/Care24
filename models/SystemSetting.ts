import mongoose from "mongoose";

const SystemSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    
    // Homepage Content
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroPrimaryCTA: { type: String, default: "" },
    heroSecondaryCTA: { type: String, default: "" },

    // Trust & Credibility Cards
    satisfactionTitle: { type: String, default: "" },
    satisfactionDescription: { type: String, default: "" },
    caregiverTrustTitle: { type: String, default: "" },
    caregiverTrustDescription: { type: String, default: "" },
    serviceCoverageTitle: { type: String, default: "" },
    serviceCoverageDescription: { type: String, default: "" },

    // Company Information
    companyName: { type: String, default: "" },
    footerDescription: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    supportPhone: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    supportHours: { type: String, default: "" },
    officeAddress: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    supportedCities: { type: [String], default: [] },

    // Social Links
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

const SystemSetting = (mongoose.models.SystemSetting || mongoose.model("SystemSetting", SystemSettingSchema)) as any;
export default SystemSetting;
