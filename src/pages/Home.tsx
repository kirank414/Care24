import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Activity,
  UserPlus,
  ChevronRight, 
  CheckCircle2, 
  Star,
  ShieldCheck,
  Clock,
  Heart,
  Users,
  Shield,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  Zap,
  Check,
  Building2,
  Lock,
  Headphones,
  Smartphone,
  Play,
  Bell,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HomePage() {
  const [activeTab, setActiveTab] = React.useState('track');

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/10 bg-slate-50 pb-12 space-y-12">

      {/* Hero Section - Elite Polish */}
      <section className="!mt-0 relative w-full pt-4 pb-8 px-0 overflow-hidden bg-white">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000" 
            alt="Healthcare Background" 
            className="w-full h-full object-cover object-[80%_center]"
          />
          {/* Gradient overlay to make text readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-white/80 to-transparent w-full"></div>
          
          {/* Medical Overlay Icons (mimicking Image 2) */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 text-primary/20"
          >
            <Heart size={120} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-1/3 right-1/3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white/40"
          >
            <Activity size={40} />
            <p className="text-sm font-bold mt-2">72 BPM</p>
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center pt-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="bg-blue-50 text-slate-800 px-4 py-2 mb-6 rounded-full text-xs font-bold border border-blue-100 shadow-sm inline-flex items-center gap-2">
                 <ShieldCheck size={14} className="text-primary" /> Trusted by 10,000+ Families
              </Badge>
              
              <h1 className="text-5xl lg:text-[80px] font-black text-slate-950 mb-6 leading-[0.8] tracking-[-0.06em]">
                Compassionate <br />Care, Right <br />
                <span className="text-primary italic font-medium">at Home</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-800 mb-8 max-w-lg leading-relaxed font-medium">
                Professional nursing and healthcare assistance for your loved ones. Because they deserve the best care.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-16">
                <Button className="bg-primary hover:bg-blue-600 text-white rounded-[20px] px-10 h-16 font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all" render={<Link to="/signup" />} nativeButton={false}>
                  Book a Service <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-[20px] px-10 h-16 font-black text-xs uppercase tracking-widest border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all" render={<Link to="/services" />} nativeButton={false}>
                  Explore Services <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-12 gap-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                       <UserPlus size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Verified Caregivers</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background Checked</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                       <Clock size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-950 uppercase tracking-tight">24/7 Support</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Available</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                       <Shield size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Safe & Secure</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Family, Our Priority</p>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Right Widgets - Mimicking Image 1 */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:flex flex-col items-end justify-center pr-8"
            >
              {/* Next Visit */}
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-4xl border border-white/50 w-72 mb-8 translate-x-12 hover:-translate-y-2 transition-transform duration-500 group">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Next Visit</p>
                 <div className="flex items-center gap-4 mb-6">
                    <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100" alt="Nurse" className="w-12 h-12 rounded-2xl bg-slate-100 object-cover shadow-lg transition-transform group-hover:scale-110" />
                    <div>
                       <p className="text-base font-black text-slate-950 leading-tight">Today, 10:30 AM</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Nurse Priya S.</p>
                    </div>
                 </div>
                 <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center justify-center gap-2 border border-emerald-100 shadow-sm">
                    <Check size={14} className="stroke-[3]" /> Confirmed
                 </div>
              </div>

              {/* Health Update */}
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-4xl border border-white/50 w-72 mb-8 hover:-translate-y-2 transition-transform duration-500">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Health Update</p>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
                          <Heart size={24} className="fill-current" />
                       </div>
                       <div>
                          <p className="text-3xl font-black text-slate-950 leading-none mb-1 tracking-tighter">72</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BPM</p>
                       </div>
                    </div>
                    {/* Tiny Chart Mockup */}
                    <div className="text-primary h-8 w-16">
                       <svg width="60" height="30" viewBox="0 0 60 30" className="overflow-visible">
                          <path d="M0 15 L10 15 L15 5 L25 25 L30 15 L40 15 L45 10 L55 20 L60 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                 </div>
              </div>

              {/* Care Plan */}
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-4xl border border-white/50 w-72 translate-x-8 hover:-translate-y-2 transition-transform duration-500">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Care Plan</p>
                 <p className="text-sm font-black text-slate-950 mb-4">3/7 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tasks Completed</span></p>
                 <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden shadow-inner">
                    <div className="bg-primary h-full rounded-full w-[43%] shadow-lg"></div>
                 </div>
                 <p className="text-right text-[10px] font-black text-primary tracking-widest uppercase">43%</p>
              </div>
            </motion.div>
          </div>
        </div>


      </section>



      {/* Services Overview - Elite Cards */}


      {/* How It Works - Refined Timeline */}
      <section className="py-20 scroll-mt-12 flex items-center justify-center bg-slate-950 text-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 relative shadow-2xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-white/10 text-white border-white/10 px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">How it works</Badge>
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.85]">Three simple steps to <br /><span className="text-primary italic font-medium">start care.</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              { step: '01', t: 'Clinical Consultation', d: 'Connect with a care coordinator to map your medical requirements and patient condition.' },
              { step: '02', t: 'Expert Matching', d: 'Our algorithm identifies the top 3 verified professionals based on specialty and proximity.' },
              { step: '03', t: 'Seamless Initiation', d: 'Digital onboarding, telemetry setup, and care shift commencement within 4 hours.' }
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-black text-white/5 absolute -top-10 -left-6 group-hover:text-primary/10 transition-colors">{s.step}</div>
                <div className="relative">
                  <h4 className="text-2xl font-bold mb-4 tracking-tight text-white">{s.t}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Consolidation of Verification */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-24 mb-8">
              <div className="lg:w-1/2">
                <Badge className="bg-emerald-100 text-emerald-700 mb-8 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">Verified & Safe</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-4">How we check <br /><span className="text-slate-400 italic">our caregivers.</span></h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">We only hire the best. Every caregiver goes through a strict 7-step check to make sure your family gets the safest care possible.</p>
                <div className="grid grid-cols-2 gap-8">
                   {[
                     { t: '100%', d: 'Background Verified' },
                     { t: 'Level 3', d: 'Clinical Proficiency' },
                     { t: '24/7', d: 'Active Oversight' },
                     { t: 'Elite', d: 'RN Certification' }
                   ].map((item, i) => (
                     <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <p className="text-2xl font-black text-slate-950 mb-1">{item.t}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.d}</p>
                     </div>
                   ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                 <div className="relative rounded-[60px] overflow-hidden shadow-4xl aspect-square bg-slate-100 group">
                    <img 
                      src="/care24_vetting_loop.jpg" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt="Verification"
                    />
                    <div className="absolute inset-0 bg-slate-950/10 mix-blend-multiply"></div>
                    <div className="absolute bottom-10 left-10 p-8 rounded-[40px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white max-w-xs">
                       <CheckCircle2 className="text-emerald-500 mb-4" size={32} />
                       <p className="text-sm font-bold text-slate-950 leading-relaxed">Care24 verified professionals are audited weekly against international geriatric care standards.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>



      {/* Real-time Care Platform Preview */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
               <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 mb-8 text-[11px] font-bold uppercase tracking-[0.2em]">Technology</Badge>
               <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tighter leading-[0.95] mb-4">Care management <br /><span className="text-slate-400 italic">without friction.</span></h2>
               
               <div className="space-y-4 mb-14">
                  {[
                    { id: 'track', t: 'Live Shift Tracking', d: 'GPS-verified attendance and real-time activity logging.' },
                    { id: 'vitals', t: 'Health Telemetry', d: 'Automated vitals monitoring with medical alarm systems.' },
                    { id: 'digital', t: 'e-Prescription Hub', d: 'Digital medication mapping and dosing reminders.' }
                  ].map((tab) => (
                    <div 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-8 rounded-[32px] cursor-pointer transition-all border-2 ${activeTab === tab.id ? 'bg-white border-primary shadow-2xl scale-[1.02]' : 'border-transparent hover:bg-white/50'}`}
                    >
                      <h4 className={`text-xl font-bold mb-2 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`}>{tab.t}</h4>
                      <p className={`text-sm font-medium ${activeTab === tab.id ? 'text-slate-600' : 'text-slate-400'}`}>{tab.d}</p>
                    </div>
                  ))}
               </div>
               
               <Button size="lg" variant="ghost" className="h-16 px-10 rounded-2xl font-bold text-slate-900 border border-slate-200 hover:bg-white shadow-sm">
                  EXPLORE THE TECH STACK <Play className="ml-3 h-4 w-4" />
               </Button>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative rounded-[48px] bg-slate-900 p-4 shadow-3xl overflow-hidden border-[12px] border-slate-800">
                  <div className="bg-white rounded-[32px] overflow-hidden aspect-[4/5] relative">
                     {/* Dashboard Simulation */}
                     <div className="absolute top-0 w-full h-[160px] bg-primary p-10 text-white">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-10 h-10 rounded-full bg-white/20"></div>
                           <Bell size={24} className="opacity-60" />
                        </div>
                        <h3 className="text-2xl font-bold">Patient Monitor</h3>
                     </div>
                     <div className="mt-[130px] p-8 space-y-6">
                        <AnimatePresence mode="wait">
                          {activeTab === 'track' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                               {[1,2,3].map(i => (
                                 <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="h-2 w-1/3 bg-slate-200 rounded-full"></div>
                                    <div className="ml-auto h-2 w-5 bg-slate-100 rounded-full"></div>
                                 </div>
                               ))}
                            </motion.div>
                          )}
                          {activeTab === 'vitals' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                               <div className="h-48 rounded-3xl bg-blue-50 border-2 border-blue-100 p-6">
                                  <div className="flex justify-between items-center mb-6">
                                     <Activity className="text-primary" />
                                     <span className="text-4xl font-black text-primary">72</span>
                                  </div>
                                  <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                     <div className="h-full bg-primary w-2/3"></div>
                                  </div>
                               </div>
                            </motion.div>
                          )}
                          {activeTab === 'digital' && (
                             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 font-bold text-slate-400 text-center py-20">
                                   Digital Records Hub
                                </div>
                             </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
               
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Refined Quotes */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 max-w-3xl mx-auto">
            <Badge className="bg-rose-50 text-rose-500 border-none px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">The Care Experience</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-[0.9] mb-8">Clinical outcomes, <br /><span className="text-slate-400 italic">human healing.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "The ICU nurses from Care24 didn't just monitor vitals. They brought a sense of clinical calm to our home that I didn't think was possible outside a hospital.", a: "Sarah Johnson", t: "Recovery Case #421 • Post-Op Nursing" },
              { q: "Finally, a health-tech platform that actually understands operational rigor. The real-time telemetry gave our family the data we needed to feel safe.", a: "Dr. Arvind Mehta", t: "Institutional Client • Family Support" },
              { q: "It's rare to find such high-level dementia expertise. The caregiver matching was eerily accurate, bringing someone who truly connected with my mother.", a: "Mark Williams", t: "Memory Care Support • Long-term Care" }
            ].map((t, i) => (
              <div key={i} className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex gap-1 mb-4">
                   {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-primary text-primary" />)}
                </div>
                <p className="text-xl font-medium text-slate-700 leading-relaxed mb-4 tracking-tight">"{t.q}"</p>
                <div>
                   <p className="text-xl font-black text-slate-950 tracking-tight">{t.a}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{t.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOS Banner - Redesign */}
      <section className="py-12 scroll-mt-12 flex items-center justify-center mx-4 sm:mx-8 p-1 rounded-[48px] bg-gradient-to-br from-red-600 via-rose-600 to-rose-700 shadow-2xl shadow-rose-500/30 overflow-hidden">

         <div className="bg-white/5 backdrop-blur-2xl p-10 lg:p-16 rounded-[56px] flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
               <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse text-white ring-8 ring-white/10 shrink-0">
                  <PhoneCall size={36} />
               </div>
               <div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3 leading-none">Emergency Intervention</h3>
                  <p className="text-rose-100 text-lg font-medium max-w-lg">Standard 30-second response time for all clinical escalations. Our directors are on standby.</p>
               </div>
            </div>
            <div className="flex flex-col items-center gap-6">
               <span className="text-5xl font-black text-white tracking-tighter">1-800-SOS-24</span>
               <Button size="lg" className="rounded-2xl h-16 px-12 bg-white text-rose-600 hover:bg-rose-50 font-black text-xl shadow-2xl active:scale-95 transition-all">
                  CALL NOW
               </Button>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-primary/5 text-primary border-none px-6 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Frequently Asked Questions</Badge>
            <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-none mb-8">Service <br /><span className="text-slate-400 italic">Clarifications.</span></h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">Specific answers to operational and clinical questions regarding our home healthcare services.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-6">
            {[
              { q: "How fast can I get a caregiver?", a: "For emergency critical care, we can mobilize specialized staff within 4 hours. For standard nursing or physiotherapy, matches are usually ready within 24 hours." },
              { q: "What certifications do your caregivers hold?", a: "All our nurses are Registered Nurses (RN) with at least 5 years of critical care experience. Every professional also undergoes mandatory BLS and ACLS certification audits." },
              { q: "Can I track care progress remotely?", a: "Yes. Our Family Dashboard provides real-time telemetry, GPS-verified attendance, medication logs, and a 24/7 direct secure link to the active caregiver." },
              { q: "How do you handle medical emergencies?", a: "Every Care24 assignment is linked to our 24/7 Clinical Command Center. In case of vital sign deviation, our system triggers an automatic doctor-led intervention protocol." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-[40px] px-10 py-4 bg-white shadow-sm hover:shadow-xl transition-all">
                <AccordionTrigger className="text-2xl font-bold text-slate-950 hover:no-underline text-left tracking-tight py-6">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 font-medium text-lg leading-relaxed pt-2 pb-10">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 p-12 rounded-[48px] bg-slate-950 text-white shadow-3xl relative overflow-hidden group"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="max-w-md">
                  <h3 className="text-3xl font-bold tracking-tight mb-4 italic">Still have questions?</h3>
                  <p className="text-slate-400 font-medium">Send your query directly to our clinical concierge team. We respond within 15 minutes.</p>
               </div>
               <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-full sm:w-80 group/input">
                     <Input 
                        placeholder="Type your question here..." 
                        className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 pl-6 pr-12 focus:bg-white/10 transition-all"
                     />
                     <Send size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary transition-colors" />
                  </div>
                  <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                     ASK NOW
                  </Button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
