import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Activity, 
  UserPlus, 
  Brain, 
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
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICES } from '@/src/constants';
import { Badge } from '@/components/ui/badge';
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
    <div className="flex flex-col min-h-screen selection:bg-primary/10">
      {/* Hero Section - Elite Polish */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-white">
        {/* Animated Mesh Background - Refined for breathing space */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-50/50 rounded-full blur-[160px]"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-50/30 rounded-full blur-[140px]"
          ></motion.div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center space-x-3 bg-slate-50 text-slate-900 px-4 py-2 rounded-2xl mb-8 border border-slate-200/50 shadow-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=verified${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">842 Specialists available in your region</span>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-[0.92] mb-6 tracking-[-0.05em]">
                Better care, <br />
                <span className="text-primary italic font-medium">at home.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-xl font-medium">
                Care24 delivers clinical-grade healthcare to your doorstep. We combine hospital-standard protocols with elite nursing experts to ensure recovery and comfort.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl px-12 h-16 text-sm font-black uppercase tracking-widest bg-slate-950 hover:bg-primary transition-all shadow-2xl shadow-slate-200 active:scale-95" render={<Link to="/caregivers" className="flex items-center" />} nativeButton={false}>
                  ACTIVATE CARE <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                
                <Button variant="ghost" className="w-full sm:w-auto h-16 px-10 rounded-2xl font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-50" render={<Link to="/services" />} nativeButton={false}>
                   VIEW PROTOCOLS
                </Button>
              </div>

              <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6 opacity-30 grayscale saturate-0">
                <div className="text-lg font-black tracking-tighter text-slate-950">APOLLO LUXE</div>
                <div className="text-lg font-black tracking-tighter text-slate-950">FORTIS PLUS</div>
                <div className="text-lg font-black tracking-tighter text-slate-950">MAX ELITE</div>
                <div className="text-lg font-black tracking-tighter text-slate-950">MEDANTA </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              <div className="relative rounded-[48px] overflow-hidden bg-slate-50 p-2 border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
                <div className="rounded-[40px] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1584515933487-78271d44b944?auto=format&fit=crop&q=80&w=1200" 
                    alt="Care Specialist" 
                    className="w-full aspect-[4/5] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Micro-Animation Widget: Live Vitals */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -right-8 frosted-glass p-6 rounded-3xl shadow-2xl border border-white/50 min-w-[200px]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LIVE VITALS</p>
                      <p className="text-lg font-black text-slate-950">72 BPM</p>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["20%", "80%", "20%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-full bg-primary"
                    ></motion.div>
                  </div>
                </motion.div>

                {/* Micro-Animation Widget: Trust Badge */}
                <motion.div 
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -left-12 bg-slate-950 text-white p-6 rounded-3xl shadow-2xl min-w-[240px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">HIPAA Secure</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">Encrypted Data Hub</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Stats - Grid Layout */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
              {[
                { label: 'Verified Experts', val: '12,500+', icon: UserPlus },
                { label: 'Patient Retention', val: '98.2%', icon: Heart },
                { label: 'Avg Latency', val: '< 2 Hours', icon: Clock },
                { label: 'Direct Oversight', val: '24/7', icon: ShieldCheck }
              ].map((s, i) => (
                <div key={i} className="group text-center lg:text-left">
                   <div className="w-10 h-10 mx-auto lg:mx-0 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 shadow-sm border border-slate-100/50">
                      <s.icon size={20} />
                   </div>
                   <h3 className="text-3xl font-black text-slate-950 mb-1 tracking-tight">{s.val}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Services Overview - Elite Cards */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Medical Modalities</Badge>
            <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-[0.9] mb-8">Clinical protocols <br /><span className="text-slate-400 italic font-medium">for institutional care.</span></h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">Hospital-grade pathways designed by senior clinical experts to ensure measurable patient outcomes and safety at home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = {
                Stethoscope,
                Activity,
                UserPlus,
                Brain
              }[service.icon] || Heart;
              
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full rounded-[32px] border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all group overflow-hidden bg-slate-50/30">
                    <CardContent className="p-10 flex flex-col h-full">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <Icon size={28} />
                      </div>
                      <Badge className="w-fit bg-white text-slate-400 border-slate-100 mb-6 font-bold uppercase text-[8px] tracking-[0.2em]">{service.category}</Badge>
                      <h3 className="text-xl font-bold text-slate-950 mb-3 tracking-tight">{service.title}</h3>
                      <p className="text-slate-500 font-medium text-xs leading-relaxed mb-8 flex-grow line-clamp-3">{service.description}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">From ${service.startingPrice}/hr</p>
                        <Link to="/services" className="text-primary hover:translate-x-1 transition-transform">
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Refined Timeline */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden rounded-[80px] mx-4 sm:mx-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-white/10 text-white border-white/10 px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Streamlined Onboarding</Badge>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.85]">Zero friction care <br /><span className="text-primary italic font-medium">mapping.</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {[
              { step: '01', t: 'Clinical Consultation', d: 'Connect with a care coordinator to map your medical requirements and patient condition.' },
              { step: '02', t: 'Expert Matching', d: 'Our algorithm identifies the top 3 verified professionals based on specialty and proximity.' },
              { step: '03', t: 'Seamless Initiation', d: 'Digital onboarding, telemetry setup, and care shift commencement within 4 hours.' }
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl font-black text-white/5 absolute -top-16 -left-8 group-hover:text-primary/10 transition-colors">{s.step}</div>
                <div className="relative">
                  <h4 className="text-3xl font-bold mb-6 tracking-tight text-white">{s.t}</h4>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Consolidation of Verification */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-24 mb-24">
              <div className="lg:w-1/2">
                <Badge className="bg-emerald-100 text-emerald-700 mb-8 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">Institutional Safety</Badge>
                <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-none mb-10">The Care24 <br /><span className="text-slate-400 italic">Vetting Loop.</span></h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">We filter out 98% of applicants through a rigorous 7-stage clinical and behavioral assessment. If they're not fit for an ICU, they're not on Care24.</p>
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
                      src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt="Verification"
                      referrerPolicy="no-referrer"
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

      {/* Featured Caregivers - Elite Grid */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-sm">Elite Network</Badge>
              <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-none">Verified experts <br /><span className="text-slate-400 italic">available now.</span></h2>
            </div>
            <Button size="lg" variant="ghost" className="h-16 px-10 rounded-2xl font-bold text-slate-900 border border-slate-200 hover:bg-white shadow-sm" render={<Link to="/caregivers" />} nativeButton={false}>
              VIEW FULL NETWORK <ChevronRight className="ml-3 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Nurse Priya S.', spec: 'ICU & Critical Care', exp: '8+ Years', rating: 4.9, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400' },
              { name: 'Dr. Michael C.', spec: 'Geriatric Physio', exp: '12+ Years', rating: 4.8, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400' },
              { name: 'Nurse Emily R.', spec: 'Dementia Care', exp: '6+ Years', rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400' }
            ].map((c, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white p-3 rounded-[48px] shadow-sm hover:shadow-3xl transition-all border border-slate-100 overflow-hidden">
                  <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] mb-8">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-6 right-6">
                       <Badge className="bg-white/95 backdrop-blur-md text-slate-950 border-none shadow-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                          <CheckCircle2 size={12} className="mr-2 text-primary" /> Verified
                       </Badge>
                    </div>
                  </div>
                  <div className="px-6 pb-6 text-center">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-500" />)}
                      <span className="text-xs font-bold text-slate-900 ml-2">{c.rating}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-1">{c.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{c.spec}</p>
                    <div className="flex items-center justify-center gap-8 py-6 border-t border-slate-50 italic text-slate-500 text-sm">
                       <span>{c.exp} Experience</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                       <span>Available</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Care Platform Preview */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
               <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 mb-8 text-[11px] font-bold uppercase tracking-[0.2em]">Technology</Badge>
               <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-[0.95] mb-10">Care management <br /><span className="text-slate-400 italic">without friction.</span></h2>
               
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
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <Badge className="bg-rose-50 text-rose-500 border-none px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">The Care Experience</Badge>
            <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-[0.9] mb-8">Clinical outcomes, <br /><span className="text-slate-400 italic">human healing.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "The ICU nurses from Care24 didn't just monitor vitals. They brought a sense of clinical calm to our home that I didn't think was possible outside a hospital.", a: "Sarah Johnson", t: "Recovery Case #421 • Post-Op Nursing" },
              { q: "Finally, a health-tech platform that actually understands operational rigor. The real-time telemetry gave our family the data we needed to feel safe.", a: "Dr. Arvind Mehta", t: "Institutional Client • Family Support" },
              { q: "It's rare to find such high-level dementia expertise. The caregiver matching was eerily accurate, bringing someone who truly connected with my mother.", a: "Mark Williams", t: "Memory Care Support • Long-term Care" }
            ].map((t, i) => (
              <div key={i} className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex gap-1 mb-10">
                   {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-primary text-primary" />)}
                </div>
                <p className="text-xl font-medium text-slate-700 leading-relaxed mb-10 tracking-tight">"{t.q}"</p>
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
      <section className="mx-4 sm:mx-8 mb-40 p-1 rounded-[60px] bg-gradient-to-br from-red-600 via-rose-600 to-rose-700 shadow-2xl shadow-rose-500/30">
         <div className="bg-white/5 backdrop-blur-2xl p-16 lg:p-24 rounded-[56px] flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
               <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse text-white ring-8 ring-white/10 shrink-0">
                  <PhoneCall size={44} />
               </div>
               <div>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-none">Emergency Intervention</h3>
                  <p className="text-rose-100 text-xl font-medium max-w-xl">Standard 30-second response time for all clinical escalations. Our directors are on standby.</p>
               </div>
            </div>
            <div className="flex flex-col items-center gap-8">
               <span className="text-6xl font-black text-white tracking-tighter">1-800-SOS-24</span>
               <Button size="lg" className="rounded-2xl h-20 px-16 bg-white text-rose-600 hover:bg-rose-50 font-black text-2xl shadow-2xl active:scale-95 transition-all">
                  CALL COMMAND CENTER
               </Button>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white mb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="bg-slate-100 text-slate-500 border-none px-5 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Common Queries</Badge>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tighter">Questions? <br /><span className="text-slate-400 italic">Clear answers.</span></h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "How fast can I get a caregiver?", a: "For emergency critical care, we can mobilize specialized staff within 4 hours. For standard nursing or physiotherapy, matches are usually ready within 24 hours." },
              { q: "What certifications do your caregivers hold?", a: "All our nurses are Registered Nurses (RN) with at least 5 years of critical care experience. Every professional also undergoes mandatory BLS and ACLS certification audits." },
              { q: "Can I track care progress remotely?", a: "Yes. Our Family Dashboard provides real-time telemetry, GPS-verified attendance, medication logs, and a 24/7 direct secure link to the active caregiver." },
              { q: "How do you handle medical emergencies?", a: "Every Care24 assignment is linked to our 24/7 Clinical Command Center. In case of vital sign deviation, our system triggers an automatic doctor-led intervention protocol." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-slate-100 rounded-3xl px-8 py-4 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all">
                <AccordionTrigger className="text-xl font-bold text-slate-900 hover:no-underline text-left tracking-tight">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 font-medium text-lg leading-relaxed pt-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </div>
  );
}
