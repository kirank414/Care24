import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Filter, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  Stethoscope,
  Award,
  Heart,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  UserCheck,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CAREGIVERS = [
  {
    id: 'C-101',
    name: 'Nurse Priya Sharma',
    specialty: 'ICU Specialist & Critical Care',
    experience: '8+ Years',
    rating: 4.9,
    reviews: 124,
    location: 'Mumbai, MH',
    availability: 'Available Today',
    status: 'online',
    certifications: ['RN', 'BLS', 'ACLS'],
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    verified: true,
    languages: ['English', 'Hindi', 'Marathi']
  },
  {
    id: 'C-102',
    name: 'Dr. Michael Chen',
    specialty: 'Geriatric Physiotherapist',
    experience: '12+ Years',
    rating: 4.8,
    reviews: 89,
    location: 'New York, NY',
    availability: 'Next: Monday',
    status: 'offline',
    certifications: ['DPT', 'OCS'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    verified: true,
    languages: ['English', 'Mandarin']
  },
  {
    id: 'C-103',
    name: 'Nurse Emily Ross',
    specialty: 'Palliative & Dementia Care',
    experience: '6 Years',
    rating: 4.9,
    reviews: 156,
    location: 'San Francisco, CA',
    availability: 'Available Now',
    status: 'online',
    certifications: ['RN', 'CHPN'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
    verified: true,
    languages: ['English', 'Spanish']
  },
  {
    id: 'C-104',
    name: 'Rajesh Kumar',
    specialty: 'Patient Care Attendant',
    experience: '5 Years',
    rating: 4.7,
    reviews: 45,
    location: 'Delhi, NCR',
    availability: 'On Shift',
    status: 'busy',
    certifications: ['First Aid', 'Patient Handling'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    verified: true,
    languages: ['Hindi', 'Punjabi']
  }
];

export function CaregiversPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 space-y-12">

      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-50/40 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-emerald-50/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_0.8px,transparent_0.8px)] [background-size:32px_32px] opacity-10"></div>
      </div>

      {/* Header Section */}
      <section className="!mt-0 snap-start scroll-mt-12 flex flex-col justify-center w-full pt-8 pb-16 px-0">

        <div className="w-full px-4 sm:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
            <div className="w-full">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-4 py-2 mb-8 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">Medical Network Protocol</Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[0.9] mb-8">
                Verified experts <br /><span className="text-slate-400 italic font-medium">on demand.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium w-full leading-relaxed">
                Every expert on Care24 is vetted through our 7-step clinical verification loop, ensuring the highest standard of ICU and geriatric care.
              </p>
            </div>
            <div className="flex items-center gap-10 pb-2">
               <div className="text-center px-8 border-r border-slate-100">
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">14k+</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">ACTIVE RNs</p>
               </div>
               <div className="text-center">
                 <p className="text-3xl font-black text-emerald-600 tracking-tighter">99.8%</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">SAFETY SCORE</p>
               </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="frosted-glass p-2 rounded-[28px] premium-shadow border border-slate-100 flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-grow w-full md:w-auto">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search specialty or condition..." 
                  className="h-14 pl-12 pr-6 bg-white border-transparent rounded-[20px] text-base font-medium placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-primary/5 shadow-inner"
               />
            </div>
            <div className="flex items-center gap-1.5 w-full md:w-auto scroll-smooth overflow-x-auto no-scrollbar pb-1 md:pb-0 px-1 lg:px-0">
               {['All', 'Critical Care', 'Physio', 'Memory Care'].map((f) => (
                 <Button 
                  key={f}
                  variant={activeFilter === f ? 'default' : 'ghost'}
                  onClick={() => setActiveFilter(f)}
                  className={`h-14 px-6 rounded-[18px] font-black text-[9px] uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   {f}
                 </Button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Warmth Section - Patient Snippets */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { quote: "Nurse Sarah didn't just manage the ICU equipment; she brought a sense of calm that helped our father heal faster than we expected.", author: "Jameson Family", role: "Neuro-Rehab Patient" },
                { quote: "The level of professionalism is matched only by the deep empathy these caregivers show every single day.", author: "Dr. Elena Chen", role: "Primary Care Physician" },
                { quote: "For the first time in months, I felt like my mother was in safe, compassionate hands. They truly care about the person, not just the patient.", author: "Michael R.", role: "Family Member" }
              ].map((s, i) => (
                <div key={i} className="space-y-6">
                   <div className="text-primary/40"><Heart size={32} className="mx-auto" /></div>
                   <p className="text-lg font-medium text-slate-700 italic leading-relaxed">"{s.quote}"</p>
                   <div>
                      <p className="text-sm font-black text-slate-950 uppercase tracking-widest">{s.author}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.role}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Caregiver Grid Section */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-inner bg-slate-50 pt-4 pb-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Enhanced Loading Skeletons
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse p-4 rounded-[40px] border border-slate-100">
                  <div className="h-64 bg-slate-100 rounded-[32px]"></div>
                  <div className="h-4 w-1/2 bg-slate-100 rounded-full mx-2"></div>
                  <div className="h-6 w-3/4 bg-slate-100 rounded-full mx-2"></div>
                  <div className="h-20 bg-slate-50 rounded-[24px]"></div>
                </div>
              ))
            ) : (
              CAREGIVERS.map((caregiver) => (
                <motion.div
                  key={caregiver.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Card className="enterprise-card group h-full overflow-hidden border-transparent shadow-sm hover:shadow-3xl bg-white p-2">
                    <CardContent className="p-0 flex flex-col h-full bg-white rounded-[30px]">
                      {/* Image Area - Elite Polish */}
                      <div className="relative h-48 overflow-hidden rounded-[28px] mt-1 mx-1">
                         <img 
                            src={caregiver.avatar} 
                            alt={caregiver.name} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                         <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                            <div className="frosted-glass p-2.5 rounded-2xl shadow-xl border border-white/30 hover:scale-110 transition-transform">
                               <Heart size={18} className="text-white hover:text-rose-500 transition-colors" />
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg ${
                               caregiver.status === 'online' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
                               caregiver.status === 'busy' ? 'bg-amber-500/90 border-amber-400 text-white' :
                               'bg-slate-500/90 border-slate-400 text-white'
                            }`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${caregiver.status === 'online' ? 'bg-white animate-pulse' : 'bg-white/50'}`}></div>
                               {caregiver.availability}
                            </div>
                         </div>
                         
                         {caregiver.verified && (
                            <div className="absolute bottom-5 left-5">
                               <Badge className="bg-white/95 backdrop-blur-md text-slate-950 border-none shadow-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] rounded-full">
                                  <ShieldCheck size={12} className="mr-2 text-primary" /> ELITE VERIFIED 
                               </Badge>
                            </div>
                         )}
                      </div>

                      {/* Content Area - Refined Spacing */}
                      <div className="p-4 pb-6">
                         <div className="flex items-center gap-2 mb-4">
                            <div className="flex -space-x-1">
                               {[1, 2, 3, 4, 5].map(s => (
                                 <Star key={s} size={12} className={s <= Math.floor(caregiver.rating) ? "fill-yellow-400 text-yellow-500" : "text-slate-200"} />
                               ))}
                            </div>
                            <span className="text-xs font-bold text-slate-900 ml-1">{caregiver.rating}</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-2">({caregiver.reviews} Reviews)</span>
                         </div>

                         <h3 className="text-xl font-bold text-slate-950 mb-1 tracking-tight">{caregiver.name}</h3>
                         <div className="flex flex-wrap gap-1.5 mb-6">
                            {caregiver.specialty.split('&').map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                                 {tag.trim()}
                              </Badge>
                            ))}
                         </div>

                         <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 focus:">Exp.</p>
                               <p className="text-xs font-black text-slate-950">{caregiver.experience}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Loc.</p>
                               <p className="text-xs font-black text-slate-950">{caregiver.location.split(',')[0]}</p>
                            </div>
                         </div>

                         <div className="space-y-2 mb-6">
                            <div>
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Clinical Stack</p>
                               <div className="flex flex-wrap gap-1.5">
                                  {caregiver.certifications.map(cert => (
                                    <Badge key={cert} variant="outline" className="text-[9px] border-slate-100 text-slate-500 bg-white font-bold h-6">
                                       {cert}
                                    </Badge>
                                  ))}
                               </div>
                            </div>
                            <div>
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Linguistic Proficiency</p>
                               <p className="text-[10px] font-medium text-slate-600 px-1">{caregiver.languages.join(' • ')}</p>
                            </div>
                         </div>

                         <Button className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl group/btn active:scale-95 transition-all">
                            BOOK CONSULTATION <ArrowRight size={14} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Elite CTA - Subscription Pitch */}
      <section className="h-full snap-start scroll-mt-12 relative overflow-hidden p-1 rounded-[48px] mx-4 sm:mx-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl group mb-12">

           <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 rounded-full blur-[160px] group-hover:scale-125 transition-transform duration-1000 opacity-50"></div>
           <div className="relative p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="max-w-2xl">
                 <Badge className="bg-white/10 text-white border-white/10 px-5 py-2 rounded-full mb-10 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Protocol</Badge>
                 <h2 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.05em] leading-[0.95] mb-10">Institutional grade <br /><span className="text-primary italic font-medium">Care Matchmaking.</span></h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl mb-12">
                   Contact our clinical directors for a custom-mapped recovery plan, including ICU step-down and comprehensive geri-atric protocol design.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center gap-8">
                    <Button size="lg" className="w-full sm:w-auto h-20 px-12 rounded-[24px] bg-white text-slate-950 hover:bg-slate-50 font-black text-lg shadow-2xl">
                       TALK TO A DIRECTOR
                    </Button>
                    <div className="flex items-center gap-4 text-white">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl">
                          <CheckCircle2 size={24} />
                       </div>
                       <div className="text-left leading-none">
                          <p className="text-sm font-bold">HIPAA Compliant</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">SECURE NETWORK</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="relative lg:w-1/3 hidden lg:block">
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Stethoscope, label: 'CLINICAL' },
                      { icon: ShieldCheck, label: 'VETTED' },
                      { icon: Users, label: 'TRUSTED' },
                      { icon: Award, label: 'ELITE' }
                    ].map((idx, i) => (
                      <div key={i} className="aspect-square rounded-[32px] bg-white/5 border border-white/10 p-8 flex flex-col justify-center text-center transition-transform hover:scale-105 duration-500">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mx-auto mb-4 group-hover:rotate-6 transition-transform">
                            <idx.icon size={28} />
                         </div>
                         <p className="text-[10px] font-black text-slate-500 tracking-[0.3em]">{idx.label}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
      </section>
    </div>
  );
}
