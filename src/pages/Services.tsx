import React from 'react';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Activity, 
  UserPlus, 
  Brain, 
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  Dna,
  Thermometer,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCareStore } from '../stores/careStore';
import nursingCareImg from '../assets/nursing-care.png';
import physiotherapyImg from '../assets/physiotherapy.jpg';
import elderlyAttendantImg from '../assets/elderly-attendant.jpg';
import postHospitalCareImg from '../assets/post-hospital-care.jpg';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const serviceImages: Record<string, string> = {
  'Nursing Care': nursingCareImg,
  'Physiotherapy': physiotherapyImg,
  'Elderly Attendant': elderlyAttendantImg,
  'Post-Hospital Care': postHospitalCareImg,
  'Post-hospital Care': postHospitalCareImg,
};

const serviceDetailsMapping: Record<string, {
  suitableFor: string;
  careLevel: string;
  duration: string;
  qualification: string;
  availability: string;
}> = {
  'nursing care': {
    suitableFor: 'Post-treatment recovery and ongoing care',
    careLevel: 'Advanced',
    duration: 'Hourly / Daily',
    qualification: 'Verified Nurse',
    availability: 'Available'
  },
  'elderly attendant': {
    suitableFor: 'Daily living assistance and companionship',
    careLevel: 'Basic to Moderate',
    duration: 'Hourly / Daily / Long-Term',
    qualification: 'Verified Attendant',
    availability: 'Available'
  },
  'physiotherapy': {
    suitableFor: 'Mobility and rehabilitation support',
    careLevel: 'Specialized',
    duration: 'Session Based',
    qualification: 'Licensed Physiotherapist',
    availability: 'Available'
  },
  'post-hospital care': {
    suitableFor: 'Recovery assistance after discharge',
    careLevel: 'Moderate to Advanced',
    duration: 'Short-Term / Long-Term',
    qualification: 'Verified Healthcare Professional',
    availability: 'Available'
  }
};

function getServiceDetails(title: string) {
  const normalized = title.trim().toLowerCase();
  if (serviceDetailsMapping[normalized]) {
    return serviceDetailsMapping[normalized];
  }
  return {
    suitableFor: 'General home care support',
    careLevel: 'Moderate',
    duration: 'Hourly / Daily / Long-Term',
    qualification: 'Verified Healthcare Professional',
    availability: 'Available'
  };
}

export function ServicesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { services, loading, fetchServices } = useCareStore();

  React.useEffect(() => {
    fetchServices();
  }, []);
  
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
  ];

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-primary/10 pb-12 space-y-6">

      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.04),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10 pointer-events-none"></div>
      
        <section className="!mt-0 scroll-mt-12 flex flex-col items-center w-full pt-8 pb-4 px-0">

          {/* Header Section - Refined */}
          <div className="text-center mb-4 w-full px-0">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 mb-8 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full shadow-sm">
              Trusted Family Support
            </Badge>
            <h1 className="text-6xl lg:text-[80px] font-black text-slate-950 tracking-tighter mb-8 leading-[0.85]">
              Compassionate Care <br />
              <span className="text-slate-400 font-medium italic">at your home.</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 leading-relaxed font-medium w-full tracking-tight px-4 mb-12">
              We provide professional, personalized elderly care with compassion and warmth. Your loved ones are safe with our verified caregivers.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4">
               <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <Input 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search for a service..." 
                     className="h-16 pl-14 pr-6 bg-white border-transparent rounded-[24px] text-lg font-medium placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-primary/5 shadow-xl"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* Simplified 4-Card Grid Section */}
        <section className="snap-start scroll-mt-12 px-4 sm:px-6 lg:px-8 pt-0 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="space-y-6 animate-pulse p-6 rounded-[32px] border border-slate-100 bg-white">
                    <div className="h-48 bg-slate-100 rounded-2xl"></div>
                    <div className="h-6 w-3/4 bg-slate-100 rounded-full"></div>
                    <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
                  </div>
                ))
              ) : (() => {
                  const displayServices = (services && services.length > 0 ? services : FIXED_SERVICES)
                    .filter((service: any) => service.isActive !== false);
                  const filteredServices = displayServices.filter((service: any) => 
                    service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    service.description.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  if (filteredServices.length === 0) {
                    return (
                      <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                        No services found matching your search.
                      </div>
                    );
                  }
                  
                  return filteredServices.map((service, index) => {
                  const Icon = {
                    Stethoscope,
                    Activity,
                    UserPlus,
                    Brain
                  }[service.icon] || Heart;

                  const image = serviceImages[service.title] || nursingCareImg;

                  return (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    >
                      <Card className="rounded-3xl border-slate-100 shadow-xl hover:shadow-2xl transition-all h-full bg-white overflow-hidden flex flex-col">
                        <div className="w-full overflow-hidden relative shrink-0">
                          <img src={image} alt={service.title} className="w-full aspect-[2/1] object-cover object-center transition-transform hover:scale-105 duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none"></div>
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                              <Icon size={24} />
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                              {getServiceDetails(service.title).availability}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-slate-950 mb-2 tracking-tight">
                            {service.title}
                          </h3>
                          
                          <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">
                            {service.description}
                          </p>

                          {/* PRD Specified Attributes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl text-[10px] font-semibold text-slate-700">
                            <div>
                              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Suitable For</span>
                              <span className="text-slate-800 font-bold">{getServiceDetails(service.title).suitableFor}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Care Level</span>
                              <span className="text-slate-800 font-bold">{getServiceDetails(service.title).careLevel}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Typical Duration</span>
                              <span className="text-slate-800 font-bold">{getServiceDetails(service.title).duration}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Required Qualification</span>
                              <span className="text-slate-800 font-bold">{getServiceDetails(service.title).qualification}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-6 flex-grow">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Key Features</span>
                            {service.features?.map((f: string, iKey: number) => (
                              <div key={iKey} className="flex items-center gap-3">
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                <p className="text-xs font-bold text-slate-700">{f}</p>
                              </div>
                            )) || (
                              <>
                                <div className="flex items-center gap-3">
                                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                  <p className="text-xs font-bold text-slate-700">Compassionate Support</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                  <p className="text-xs font-bold text-slate-700">Verified specialists</p>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Care Consultation</span>
                              <p className="text-xs font-black text-slate-950 uppercase tracking-wide mt-0.5">Tailored Matching</p>
                            </div>
                            <Link 
                              to={`/caregivers?category=${service.title}`} 
                              className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest"
                            >
                              BOOK NOW <ArrowRight className="ml-2 w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>
        </section>




      {/* Security Governance Section - Refined */}
      <section className="min-h-screen scroll-mt-12 flex flex-col justify-center items-center bg-slate-950 rounded-[48px] mx-4 sm:mx-8 relative overflow-hidden shadow-2xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div>
                 <Badge className="bg-white/5 text-white border-white/10 px-6 py-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Family Protection</Badge>
                 <h2 className="text-5xl lg:text-8xl font-bold text-white tracking-[-0.05em] leading-[0.85] mb-12">Your privacy <br />protected with <span className="text-primary italic">Compassion.</span></h2>
                 <p className="text-xl lg:text-2xl text-slate-400 mb-6 leading-relaxed font-medium">
                   We manage your family's care information securely, ensuring that every detail is private and accessible only to trusted care coordinators.
                 </p>
                 <div className="grid grid-cols-3 gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="flex flex-col items-center lg:items-start gap-4">
                       <ShieldCheck size={40} className="text-white" />
                       <p className="text-[9px] font-black text-white uppercase tracking-widest">ISO-27001</p>
                    </div>
                    <div className="flex flex-col items-center lg:items-start gap-4">
                       <Dna size={40} className="text-white" />
                       <p className="text-[9px] font-black text-white uppercase tracking-widest">SOC2 TYPE II</p>
                    </div>
                    <div className="flex flex-col items-center lg:items-start gap-4">
                       <Thermometer size={40} className="text-white" />
                       <p className="text-[9px] font-black text-white uppercase tracking-widest">HIPAA READY</p>
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { t: 'Family Hub', d: 'Secure communication between your verified caregiver and your family.' },
                   { t: 'Privacy Shield', d: 'Protecting your loved one\'s details while finding the perfect match.' },
                   { t: 'Care History', d: 'Complete records of all care visits, notes, and progress updates.' },
                   { t: 'Data Protection', d: 'Strict security measures to ensure your health information is always safe.' }
                 ].map((f, i) => (
                   <div key={i} className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-colors">
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-8 shadow-inner">
                         <ShieldAlert size={28} />
                      </div>
                      <h5 className="text-xl font-bold text-white mb-4">{f.t}</h5>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.d}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Enterprise Closing Section */}
      <section className="py-24 scroll-mt-12 flex flex-col justify-center items-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <Badge className="bg-primary/5 text-primary border-primary/20 px-4 py-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Consultation</Badge>
           <h2 className="text-4xl lg:text-5xl font-bold text-slate-950 tracking-[-0.06em] mb-4">Choosing the Right Care Service</h2>
           <p className="text-xl text-slate-500 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
             Our care coordinators help families select the most appropriate service based on care requirements, duration, and caregiver availability.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Button size="lg" className="h-24 px-20 rounded-[32px] bg-slate-950 text-white hover:bg-slate-900 font-black text-xl shadow-4xl shadow-slate-200" render={<Link to="/pricing" />} nativeButton={false}>
                Request Service Consultation
              </Button>
              <Button size="lg" variant="ghost" className="h-24 px-12 rounded-[32px] font-black text-lg uppercase tracking-widest text-slate-400 hover:text-slate-900" render={<Link to="/contact" />} nativeButton={false}>
                Contact Support <ArrowRight className="ml-4" />
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
