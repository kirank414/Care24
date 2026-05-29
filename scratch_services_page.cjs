const fs = require("fs");
const path = require("path");
const p = path.join(__dirname, "src", "pages", "Services.tsx");
let content = fs.readFileSync(p, "utf-8");

const target1 = `    const loading = false;
    
    const FIXED_SERVICES = [
       {
         _id: '1',
         title: 'Nursing Care',
         description: 'Professional nursing care and medical management by certified RNs.',
         icon: 'Activity',
         priceRange: 'Standard Rates',
         features: ['Certified RNs', 'Vitals Monitoring', 'Medication Management']
       },
       {
         _id: '2',
         title: 'Physiotherapy',
         description: 'Expert physical rehabilitation and mobility support at home.',
         icon: 'Activity',
         priceRange: 'Standard Rates',
         features: ['Certified PTs', 'Mobility Exercises', 'Pain Management']
       },
       {
         _id: '3',
         title: 'Elderly Attendant',
         description: 'Compassionate daily living assistance and companionship.',
         icon: 'UserPlus',
         priceRange: 'Standard Rates',
         features: ['Daily Assistance', 'Hygiene Care', 'Companionship']
       },
       {
         _id: '4',
         title: 'Post-hospital Care',
         description: 'Specialized recovery care and compassionate support protocols.',
         icon: 'Activity',
         priceRange: 'Standard Rates',
         features: ['Recovery Support', 'Vitals Care', 'Safety Monitoring']
       }
    ];`;

const replacement1 = `    const { services, loading } = useCareStore();`;

content = content.replace(target1, replacement1);

const target2 = `const filteredServices = FIXED_SERVICES.filter(service =>`;
const replacement2 = `const filteredServices = services.filter((service: any) =>`;

content = content.replace(target2, replacement2);

fs.writeFileSync(p, content, "utf-8");
console.log("Done");
