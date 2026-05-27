import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add service title"],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
    },
    priceRange: {
      type: String,
      required: [true, "Please add price range"],
    },
    icon: {
      type: String,
      required: [true, "Please add icon identifier"],
    },
    features: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ServiceCategory = (mongoose.models.ServiceCategory || mongoose.model("ServiceCategory", serviceCategorySchema)) as any;

export default ServiceCategory;
