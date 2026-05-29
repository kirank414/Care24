import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Award, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Stethoscope,
  Microscope,
  Database,
  Search,
  ArrowRight,
  Heart,
  Smile,
  Zap,
  Leaf,
  Target,
  Home,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AboutPage() {
  const pillars = [
    {
      title: 'care Rigor',
      description: 'Every caregiver undergoes 48 hours of Specialized simulation testing and government database background sweeps before onboarding.',
      icon: Microscope,
      stats: '4.8% Acceptance Rate'
    },
    {
      title: 'Smart monitoring',
      description: 'Proprietary monitoring algorithms analyze heart rate and sleep patterns to predict medical escalations before they happen.',
      icon: Activity,
      stats: '99.9% Prediction Accuracy'
    },
    {
      title: 'Global Compliance',
      description: 'Our standardized care workflows are audited daily for reliability, transparency, and HIPAA-level privacy mandates.',
      icon: ShieldCheck,
      stats: 'Zero Breaches Since 2018'
    }
  ];

  const timeline = [
    { year: '2020', event: 'Care24 Protocol v1.0 launched in NYC.' },
    { year: '2022', event: 'Reached 10,000 verified caregivers milestone.' },
    { year: '2024', event: 'Integrated predictive AI for elder fall prevention.' },
    { year: '2026', event: 'Designated as Global Health Standard Partner.' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-12 space-y-12">

      {/* Premium Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-[600px] bg-slate-950 -z-10 transform -skew-y-6 -translate-y-48"></div>

      {/* Hero Section */}
      <section className="!mt-0 scroll-mt-12 flex flex-col items-center w-full pt-8 pb-16 px-4 sm:px-10 relative overflow-hidden bg-white">

        <div className="w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center text-slate-950"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 mb-4 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
            Our Methodology
          </Badge>
          <h1 className="text-7xl lg:text-[130px] font-black text-slate-950 tracking-[-0.07em] leading-[0.8] mb-6">
            Precision care, <br />
            <span className="text-slate-400 font-medium italic">compassionate.</span>
          </h1>
          <p className="text-xl lg:text-3xl text-slate-500 leading-relaxed font-medium max-w-4xl mx-auto tracking-tight">
            We are a care intelligence platform redefining how the world cares for its elderly. No compromises. Just standardized compassionate care.
          </p>
        </motion.div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
           <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-1.5 mb-8 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Core Principles</Badge>
           <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-[-0.04em]">Our care foundation.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pillars.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="p-12 rounded-[56px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-4xl transition-all group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
               
               <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-primary mb-4 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <p.icon size={36} strokeWidth={1.5} />
               </div>
               <Badge className="bg-emerald-50 text-emerald-600 border-none mb-6 font-black uppercase text-[9px] tracking-widest">{p.stats}</Badge>
               <h3 className="text-3xl font-black text-slate-950 mb-6 tracking-tight">{p.title}</h3>
               <p className="text-slate-500 font-medium leading-relaxed text-lg">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      </section>

      {/* Care Philosophy & Emotional Storytelling */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="lg:w-1/2 relative">
                 <div className="relative rounded-[80px] overflow-hidden aspect-[4/5] bg-slate-100 shadow-4xl group">
                    <img 
                      src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt="Care Philosophy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                    <div className="absolute bottom-16 left-16 right-16">
                       <p className="text-white text-3xl font-bold leading-tight tracking-tight italic">"The technology is invisible, but the care is undeniably human."</p>
                    </div>
                 </div>
              </div>
              <div className="lg:w-1/2">
                 <Badge className="bg-rose-50 text-rose-600 mb-4 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">The Human Element</Badge>
                 <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-6">care philosophy <br /><span className="text-slate-400 italic">rooted in empathy.</span></h2>
                 <p className="text-xl text-slate-700 font-medium leading-relaxed mb-6">
                   At Care24, we believe that compassionate care is only half the battle. True healing happens when a patient feels seen, heard, and respected in their own home. Our philosophy merges rigorous care protocols with deep emotional intelligence.
                 </p>
                 <div className="space-y-8">
                    {[
                      { t: 'Dignity First', d: 'Every procedure is performed with the utmost respect for patient privacy and autonomy.', icon: Heart },
                      { t: 'Family Inclusion', d: 'We treat the family as an integral part of the care team, not just observers.', icon: Users },
                      { t: 'Patient Advocacy', d: 'Our caregivers are trained to advocate for patient needs within the larger healthcare system.', icon: ShieldCheck }
                    ].map((val, i) => (
                      <div key={i} className="flex gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-rose-500 shrink-0">
                            <val.icon size={24} />
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-slate-950 mb-1 tracking-tight">{val.t}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">{val.d}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Impact Metrics - High Density */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-slate-50 relative overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-inner">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-4">
              <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-4 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm">Scale & Impact</Badge>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-950 tracking-[-0.07em] leading-[0.8] italic">Quantifiable <br /><span className="text-slate-300 not-italic">Healthcare Transformation.</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: 'Families Healed', val: '250,000+', icon: Home },
                { label: 'Care Shifts Logged', val: '1.2M+', icon: Clock },
                { label: 'Avg Medical Recovery', val: '18% Faster', icon: TrendingUp },
                { label: 'Active RN Staff', val: '14,200', icon: Users }
              ].map((m, i) => (
                <div key={i} className="p-12 rounded-[56px] bg-white border border-slate-100 shadow-sm hover:shadow-3xl transition-all group">
                   <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <m.icon size={32} />
                   </div>
                   <h3 className="text-5xl font-black text-slate-950 mb-2 tracking-tighter">{m.val}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Enterprise Governance Section */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-slate-950 text-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 relative shadow-2xl">

         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-[-0.05em] mb-6">Total governance. <br /><span className="text-primary italic">No blind spots.</span></h2>
                  <div className="space-y-8">
                     {[
                       { t: 'Verified Identity', d: 'Biometric multi-factor authentication for every caregiver visit.', icon: Database },
                       { t: 'Immutable Logs', d: 'Blockchain-inspired ledger for all vital signs and medication administration.', icon: Lock },
                       { t: 'Instant Arbitration', d: 'Direct 24/7 access to care supervisors via high-priority audio links.', icon: Stethoscope }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-6 group">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                             <item.icon size={28} />
                          </div>
                          <div>
                             <h4 className="text-xl font-bold mb-1 tracking-tight">{item.t}</h4>
                             <p className="text-slate-400 font-medium leading-relaxed">{item.d}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"></div>
                  <div className="relative rounded-[60px] border border-white/10 overflow-hidden shadow-4xl aspect-square bg-slate-900 flex items-center justify-center p-20 group">
                     <div className="text-center">
                        <div className="w-32 h-32 rounded-[40px] bg-primary mx-auto mb-4 flex items-center justify-center shadow-3xl shadow-primary/20 group-hover:scale-110 transition-transform duration-700">
                           <Award size={64} className="text-white" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Accreditation</p>
                        <h3 className="text-3xl font-black mb-8">ISO 27001:2022</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto">Certified for Information Security Management Systems in Senior Healthcare Ops.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* History Timeline */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
           <Badge className="bg-primary/5 text-primary border-none px-6 py-1.5 mb-8 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Evolution</Badge>
           <h2 className="text-5xl font-black text-slate-950 tracking-[-0.04em]">Our trajectory to standard.</h2>
        </div>
        <div className="space-y-20 relative before:absolute before:left-0 lg:before:left-1/2 before:w-px before:h-full before:bg-slate-100 before:top-0">
          {timeline.map((t, i) => (
            <div key={i} className={`relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
               <div className="absolute left-0 lg:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-xl -translate-x-[7.5px] lg:-translate-x-2 z-10"></div>
               <div className="flex-1 text-center lg:text-right hidden lg:block">
                  {i % 2 === 0 ? <p className="text-4xl font-black text-slate-100">{t.year}</p> : null}
               </div>
               <div className={`flex-1 p-10 rounded-[40px] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all ${i % 2 === 0 ? 'text-left' : 'lg:text-right text-left'}`}>
                  <p className="text-2xl font-black text-slate-950 mb-3">{t.year}</p>
                  <p className="text-slate-500 font-medium text-lg italic">{t.event}</p>
               </div>
               <div className="flex-1 hidden lg:block">
                  {i % 2 !== 0 ? <p className="text-4xl font-black text-slate-100">{t.year}</p> : null}
               </div>
            </div>
          ))}
        </div>
      </div>
      </section>

      {/* Final CTA */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="p-20 rounded-[80px] bg-primary relative overflow-hidden text-center group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] pointer-events-none"></div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 relative z-10">Experience the <br />new standard.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-8 relative z-10">
               <Button className="h-20 px-12 rounded-[28px] bg-white text-primary font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all" render={<Link to="/contact" />} nativeButton={false}>
                  BOOK CONSULTATION
               </Button>
               <Button variant="outline" className="h-20 px-12 rounded-[28px] border-white/60 bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 active:scale-95 transition-all" render={<Link to="/services" />} nativeButton={false}>
                  VIEW CASE STUDIES <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
      </section>
    </div>
  );
}
