const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "models", "Caregiver.ts");
let content = fs.readFileSync(p, "utf-8");

const target = `}
);

const Caregiver`;

const replacement = `}
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
    
    const services = await ServiceCategory.find({});
    for (const service of services) {
      // Find all verified caregivers that have this service as a specialty
      const caregivers = await Caregiver.find({ 
        isVerified: true, 
        specialties: { $regex: new RegExp(service.title, "i") } 
      });
      
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

const Caregiver`;

if (!content.includes("updateServicePrices")) {
  content = content.replace(target, replacement);
  fs.writeFileSync(p, content, "utf-8");
  console.log("Done");
} else {
  console.log("Already updated");
}
