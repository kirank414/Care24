import mongoose from "mongoose";

const SystemSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    
    // Support Information
    supportEmail: { type: String, default: "" },
    supportPhone: { type: String, default: "" },
    officeAddress: { type: String, default: "" },

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
