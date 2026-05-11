import React from 'react';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Activity, 
  UserPlus, 
  Brain, 
  Heart, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Award,
  CheckCircle2,
  Calendar,
  Check,
  Layers,
  Thermometer,
  ShieldAlert,
  Dna,
  Smartphone,
  UserCheck,
  ListChecks,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICES } from '@/src/constants';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function ServicesPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen selection:bg-primary/10">
      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.04),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Refined */}
        <div className="text-center mb-24 max-w-5xl mx-auto">
          <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 mb-10 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full shadow-sm">
            Clinical Protocols v4.2
          </Badge>
          <h1 className="text-7xl lg:text-[100px] font-black text-slate-950 tracking-tighter mb-10 leading-[0.85]">
            Healthcare <br />
            <span className="text-slate-400 font-medium italic">industrialized.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto tracking-tight">
            We've standardized complex geriatric and critical care into predictable, hospital-grade home services. Audited, verified, and strictly governed.
          </p>
        </div>

        {/* Categories Bar - Elite Design */}
        <div className="flex flex-wrap justify-center gap-4 mb-32">
           {['All Modalities', 'ICU Step-down', 'Post-Surgical', 'Dementia Care', 'Chronic Care'].map((cat, i) => (
             <Button 
                key={cat} 
                variant={i === 0 ? 'default' : 'ghost'}
                className={`h-14 px-10 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] transition-all ${i === 0 ? 'bg-slate-950 text-white shadow-2xl' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900 shadow-sm'}`}
             >
                {cat}
             </Button>
           ))}
        </div>

        {/* Services Listing with Depth */}
        <div className="grid grid-cols-1 gap-40">
          {SERVICES.map((service, index) => {
            const Icon = {
              Stethoscope,
              Activity,
              UserPlus,
              Brain
            }[service.icon] || Heart;

            const isEven = index % 2 === 0;
            
            // Artificial detailed data for realism
            const details = {
              qualification: service.category === 'NURSING' ? 'Registered Nurse (RN) with ICU specialization' : service.category === 'PHYSIO' ? 'Masters in Physiotherapy (MPT) - Neurology' : service.category === 'DEMENTIA' ? 'Certified Dementia Care Specialist' : 'Certified Geriatric Assistant',
              forWhom: service.category === 'NURSING' ? 'Patients requiring post-op or critical monitoring' : service.category === 'PHYSIO' ? 'Stroke survivors or chronic pain patients' : service.category === 'DEMENTIA' ? 'Patients with cognitive decline or Alzheimers' : 'Elderly individuals needing daily living support',
              timeline: [
                { s: 'Assessment', d: 'Clinical evaluation within 2 hours' },
                { s: 'Matching', d: 'Specialist deployment in 24 hours' },
                { s: 'Shift Start', d: 'Immediate protocol initiation' }
              ]
            };

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col lg:flex-row items-start gap-20 lg:gap-32 ${isEven ? '' : 'lg:flex-row-reverse'}`}
              >
                {/* Visual Area - High Depth */}
                <div className="lg:w-1/2 relative group sticky top-32">
                  <div className="relative rounded-[72px] overflow-hidden p-5 bg-white ring-1 ring-slate-100 shadow-4xl transition-all duration-1000 group-hover:scale-[1.03]">
                    <div className="relative rounded-[56px] overflow-hidden aspect-[16/11]">
                       <img 
                          src={`https://images.unsplash.com/photo-${index === 0 ? '1576765608535-5f04d1e3f289' : index === 1 ? '1581056316605-40172e8fa4f2' : index === 2 ? '1584515933487-779824d29309' : '1516549655169-df83a0774514'}?auto=format&fit=crop&q=80&w=1200`}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply"></div>
                    </div>
                  </div>
                  
                  {/* Floating Performance Widget */}
                  <motion.div 
                    initial={{ x: isEven ? 40 : -40, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`absolute -bottom-16 h-40 w-64 bg-white/95 backdrop-blur-2xl p-10 rounded-[40px] shadow-3xl border border-white flex flex-col justify-center transform ${isEven ? '-right-12' : '-left-12'}`}
                  >
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Clinical SLA</p>
                     </div>
                     <p className="text-4xl font-black text-slate-950 leading-none mb-3 tracking-tighter">99.2%</p>
                     <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-500" />)}
                        <span className="text-[10px] font-bold text-slate-400 ml-2">VERIFIED</span>
                     </div>
                  </motion.div>
                </div>

                {/* Content Area - Enterprise Typography */}
                <div className="lg:w-1/2 flex flex-col">
                  <div className="mb-12">
                    <div className="flex items-center gap-5 mb-10">
                       <div className="w-20 h-20 bg-slate-50 text-slate-950 rounded-[28px] flex items-center justify-center border border-slate-100 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Icon size={40} />
                       </div>
                       <div>
                          <Badge className="bg-primary/5 text-primary border-primary/20 font-black uppercase text-[9px] tracking-[0.3em] px-5 py-2 rounded-full mb-2">
                             {service.category}
                          </Badge>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Check size={14} className="text-emerald-500" /> Institutional Protocols
                          </p>
                       </div>
                    </div>

                    <h3 className="text-5xl lg:text-7xl font-bold text-slate-950 tracking-[-0.05em] leading-[0.9] mb-10">
                      {service.title}
                    </h3>
                    
                    <p className="text-xl text-slate-500 leading-relaxed font-medium mb-12">
                      {service.description}. Our {service.category.toLowerCase()} pathways are designed by senior clinical experts to deliver measurable patient improvements with hospital-grade rigor.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Required Credential</p>
                          <div className="flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 border border-slate-100">
                             <UserCheck size={20} className="text-primary" />
                             <span className="text-sm font-bold text-slate-900">{details.qualification}</span>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Target Patient</p>
                          <div className="flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 border border-slate-100">
                             <ListChecks size={20} className="text-emerald-600" />
                             <span className="text-sm font-bold text-slate-900">{details.forWhom}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8 mb-16">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Care Process Timeline</p>
                       <div className="grid grid-cols-1 gap-6">
                          {details.timeline.map((step, i) => (
                             <div key={i} className="flex items-start gap-6 group/step">
                                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover/step:border-primary group-hover/step:text-primary transition-all">0{i+1}</div>
                                <div className="flex-grow pt-1.5">
                                   <h5 className="font-bold text-slate-950 mb-1">{step.s}</h5>
                                   <p className="text-sm font-medium text-slate-500">{step.d}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-16 p-8 rounded-[40px] bg-slate-950 text-white">
                    <div className="border-r border-white/10 pr-8">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Timer size={12} /> Standard Shift</p>
                       <p className="text-2xl font-bold">{service.duration}</p>
                    </div>
                    <div className="pl-8">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={12} /> Pricing Model</p>
                       <p className="text-2xl font-bold">${service.startingPrice}<span className="text-xs text-slate-500 ml-1">/ hour</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <Button size="lg" className="w-full sm:w-auto h-16 px-12 rounded-[22px] text-sm font-black uppercase tracking-widest shadow-2xl bg-primary hover:bg-blue-600 group/btn active:scale-95 transition-all" render={<Link to="/caregivers" />} nativeButton={false}>
                      ACTIVATE CARE <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                    <div className="text-left">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">NETWORK OVERSIGHT</p>
                       <p className="text-xs font-black text-slate-900 leading-none">ISO-27001 AUDITED</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section - Enterprise Class */}
      <section className="py-60 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32">
            <Badge className="bg-primary/5 text-primary border-none px-6 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Modalities FAQ</Badge>
            <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-none mb-8">Service <br /><span className="text-slate-400 italic">Clarifications.</span></h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">Specific answers to operational and clinical questions regarding our home healthcare services.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-6">
            {[
              { q: "Is home nursing identical to hospital care?", a: "We aim for hospital-grade rigor. While physical infrastructure differs, the clinical protocols, medical monitoring, and staff qualification (RNs) are identical to institutional standards." },
              { q: "How is billing calculated for long-term care?", a: "We offer daily, weekly, and monthly packages with sliding scales. For post-op recovery lasting over 14 days, institutional discounts are automatically applied through the dashboard." },
              { q: "Can I swap my caregiver if it's not a match?", a: "Yes. Our 'Personality Match' guarantee allows for a zero-friction swap within 24 hours if you feel the interpersonal connection isn't optimal, at no extra cost." },
              { q: "What happens during a power failure with telemetry?", a: "Our telemetry hubs are equipped with 48-hour battery backups and dual-SIM technology to ensure vital monitoring never disconnects from the Clinical Command Center." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-[40px] px-10 py-4 bg-white shadow-sm hover:shadow-xl transition-all">
                <AccordionTrigger className="text-2xl font-bold text-slate-950 hover:no-underline text-left tracking-tight py-6">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 font-medium text-lg leading-relaxed pt-2 pb-10">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Security Governance Section - Refined */}
      <section className="mt-60 py-40 bg-slate-950 rounded-[100px] mx-4 sm:mx-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div>
                 <Badge className="bg-white/5 text-white border-white/10 px-6 py-2 mb-12 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Governance Layer</Badge>
                 <h2 className="text-5xl lg:text-8xl font-bold text-white tracking-[-0.05em] leading-[0.85] mb-12">Care data <br />governed by <span className="text-primary italic">Zero-Trust.</span></h2>
                 <p className="text-xl lg:text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
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
      <section className="py-60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <Badge className="bg-primary/5 text-primary border-primary/20 px-4 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Next Steps</Badge>
           <h2 className="text-6xl lg:text-[100px] font-bold text-slate-950 tracking-[-0.06em] mb-12 italic">Precision care. <br /><span className="text-slate-300 not-italic">Starting today.</span></h2>
           <p className="text-2xl text-slate-500 mb-20 max-w-3xl mx-auto font-medium leading-relaxed">Whether you need an ICU nurse for tonight or a physical therapist for a 6-month recovery, we have the specialized protocol ready.</p>
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
