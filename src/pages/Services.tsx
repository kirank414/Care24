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
  Thermometer

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICES } from '@/src/constants';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function ServicesPage() {
  return (
    <div className="bg-slate-50 min-h-screen selection:bg-primary/10 pb-12 space-y-12">

      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.04),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10 pointer-events-none"></div>
      
        <section className="!mt-0 scroll-mt-12 flex flex-col items-center w-full pt-8 pb-16 px-0">

          {/* Header Section - Refined */}
          <div className="text-center mb-6 w-full px-0">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 mb-8 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full shadow-sm">
              Clinical Protocols v4.2
            </Badge>
            <h1 className="text-6xl lg:text-[80px] font-black text-slate-950 tracking-tighter mb-8 leading-[0.85]">
              Healthcare <br />
              <span className="text-slate-400 font-medium italic">industrialized.</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 leading-relaxed font-medium w-full tracking-tight px-4">
              We've standardized complex geriatric and critical care into predictable, hospital-grade home services. Audited, verified, and strictly governed.
            </p>
          </div>

          {/* Categories Bar - Elite Design */}
          <div className="flex flex-wrap justify-center gap-4">
             {['All Modalities', 'ICU Step-down', 'Post-Surgical', 'Dementia Care', 'Chronic Care'].map((cat, i) => (
               <Button 
                  key={cat} 
                  variant={i === 0 ? 'default' : 'ghost'}
                  className={`h-12 px-8 rounded-[16px] font-black text-[10px] uppercase tracking-[0.2em] transition-all ${i === 0 ? 'bg-slate-950 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900 shadow-sm'}`}
               >
                  {cat}
               </Button>
             ))}
          </div>
        </section>

        {/* Simplified 4-Card Grid Section */}
        <section className="snap-start scroll-mt-12 px-4 sm:px-6 lg:px-8 pt-4 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.map((service, index) => {
                const Icon = {
                  Stethoscope,
                  Activity,
                  UserPlus,
                  Brain
                }[service.icon] || Heart;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <Card className="rounded-3xl border-slate-100 shadow-xl hover:shadow-2xl transition-all h-full bg-white overflow-hidden flex flex-col">
                      {service.image && (
                        <div className="w-full overflow-hidden relative shrink-0">
                          <img src={service.image} alt={service.title} className="w-full aspect-[2/1] object-cover object-center transition-transform hover:scale-105 duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none"></div>
                        </div>
                      )}
                      <div className="p-6 lg:p-8 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                            <Icon size={24} />
                          </div>
                          <Badge className="bg-slate-50 text-slate-400 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {service.category}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-950 mb-2 tracking-tight">
                          {service.title}
                        </h3>
                        
                        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        
                        <div className="space-y-3 mb-6 flex-grow">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <p className="text-xs font-bold text-slate-700">Hospital-grade protocols</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <p className="text-xs font-bold text-slate-700">Verified specialists</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <p className="text-xs font-bold text-slate-700">24/7 Clinical support</p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Starting from</p>
                            <p className="text-lg font-black text-slate-950">${service.startingPrice}<span className="text-xs text-slate-400 ml-1">/hr</span></p>
                          </div>
                          <Button className="h-10 px-6 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest" render={<Link to="/caregivers" />} nativeButton={false}>
                            BOOK NOW <ArrowRight className="ml-2 w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>




      {/* Security Governance Section - Refined */}
      <section className="min-h-screen scroll-mt-12 flex flex-col justify-center items-center bg-slate-950 rounded-[48px] mx-4 sm:mx-8 relative overflow-hidden shadow-2xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div>
                 <Badge className="bg-white/5 text-white border-white/10 px-6 py-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Governance Layer</Badge>
                 <h2 className="text-5xl lg:text-8xl font-bold text-white tracking-[-0.05em] leading-[0.85] mb-12">Care data <br />governed by <span className="text-primary italic">Zero-Trust.</span></h2>
                 <p className="text-xl lg:text-2xl text-slate-400 mb-6 leading-relaxed font-medium">
                   We manage patient telemetry through encrypted pipelines, ensuring that every clinical interaction is audited and every vital sign is secured at the hardware level.
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
                   { t: 'Secure Gateway', d: 'Encrypted end-to-end telemetry between carer and family hub.' },
                   { t: 'Privacy Shield', d: 'Anonymized patient profiles for initial carer matchmaking.' },
                   { t: 'Audit Trail', d: 'Immutable blockchain-inspired logging for clinical interactions.' },
                   { t: 'GDPR Vault', d: 'European-standard data sovereignty and portable health records.' }
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
           <Badge className="bg-primary/5 text-primary border-primary/20 px-4 py-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Next Steps</Badge>
           <h2 className="text-4xl lg:text-5xl font-bold text-slate-950 tracking-[-0.06em] mb-4 italic">Precision care. <br /><span className="text-slate-300 not-italic">Starting today.</span></h2>
           <p className="text-xl text-slate-500 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">Whether you need an ICU nurse for tonight or a physical therapist for a 6-month recovery, we have the specialized protocol ready.</p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Button size="lg" className="h-24 px-20 rounded-[32px] bg-slate-950 text-white hover:bg-slate-900 font-black text-xl shadow-4xl shadow-slate-200" render={<Link to="/pricing" />} nativeButton={false}>
                VIEW ARCHITECTURE
              </Button>
              <Button size="lg" variant="ghost" className="h-24 px-12 rounded-[32px] font-black text-lg uppercase tracking-widest text-slate-400 hover:text-slate-900">
                Contact Sales <ArrowRight className="ml-4" />
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
