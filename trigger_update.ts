import mongoose from "mongoose";
import dotenv from "dotenv";
import Caregiver from "./models/Caregiver.js";
import ServiceCategory from "./models/ServiceCategory.js";

dotenv.config({ path: "c:/Users/Dell/Documents/Dell/OneDrive/Desktop/Care24/Care24/.env" });

mongoose.connect(process.env.MONGODB_URI!).then(async () => {
  const services = await ServiceCategory.find({});
  for (const service of services) {
    const caregivers = await Caregiver.find({ 
      isVerified: true, 
      specialties: { $regex: new RegExp(service.title, "i") } 
    });
    
    if (caregivers.length > 0) {
      const minPrice = Math.min(...caregivers.map((cg: any) => cg.hourlyRate || 9999));
      if (minPrice !== 9999 && minPrice !== Infinity) {
        service.priceRange = "From $" + minPrice + "/hr";
        await service.save();
        console.log("Updated", service.title, service.priceRange);
      }
    }
  }
  process.exit(0);
});
