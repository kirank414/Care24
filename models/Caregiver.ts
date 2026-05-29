import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add caregiver name"],
    },
    title: {
      type: String,
      required: [true, "Please add professional title (e.g., Elite RN)"],
    },
    imageUrl: {
      type: String,
    },
    experienceYears: {
      type: Number,
      required: [true, "Please add years of experience"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Please add hourly rate"],
    },
    bio: {
      type: String,
      required: [true, "Please add professional bio"],
    },
    specialties: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    cities: [
      {
        type: String,
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Unverified caregivers remain hidden from public Expert Network until admin approval
    },
    rating: {
      type: Number,
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

caregiverSchema.post("save", async function () {
  await updateServicePrices();
});

caregiverSchema.post("findOneAndUpdate", async function () {
  await updateServicePrices();
});

caregiverSchema.post("findOneAndDelete", async function () {
  await updateServicePrices();
});

async function updateServicePrices() {
  try {
    const ServiceCategory = mongoose.model("ServiceCategory");
    const Caregiver = mongoose.model("Caregiver");
    
    const services = await ServiceCategory.find({}) as any[];
    for (const service of services) {
      // Find all verified caregivers that have this service as a specialty
      const caregivers = await Caregiver.find({ 
        isVerified: true, 
        specialties: { $regex: new RegExp(service.title, "i") } 
      }) as any[];
      
      if (caregivers.length > 0) {
        const minPrice = Math.min(...caregivers.map(cg => cg.hourlyRate || 9999));
        if (minPrice !== 9999 && minPrice !== Infinity) {
          service.priceRange = "From $" + minPrice + "/hr";
          await service.save();
        }
      }
    }
  } catch (error) {
    console.error("Error dynamically updating service prices:", error);
  }
}

const Caregiver = (mongoose.models.Caregiver || mongoose.model("Caregiver", caregiverSchema)) as any;

export default Caregiver;
