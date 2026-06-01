import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight,
  Heart,
  Globe,
  Clock,
  Lock,
  MessageSquare,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const plans = [
    {
      name: 'Essential Elderly Care',
      tagline: 'Ideal for everyday elderly assistance.',
      price: 'Standard Rates',
      unit: 'Request Service Consultation',
      features: [
        'Daily living assistance',
        'Medication reminders',
        'Companionship',
        'Family updates'
      ],
      cta: 'Request Service Consultation',
      popular: false
    },
    {
      name: 'Nursing Care Plus',
      tagline: 'Professional nursing support at home.',
      price: 'Standard Rates',
      unit: 'Request Service Consultation',
      features: [
        'Licensed nursing support',
        'Recovery assistance',
        'Vitals monitoring',
        'Care coordination'
      ],
      cta: 'Request Service Consultation',
      popular: true
    },
    {
      name: 'Premium Long-Term Care',
      tagline: 'Dedicated, continuous support for your loved one.',
      price: 'Standard Rates',
      unit: 'Request Service Consultation',
      features: [
        'Dedicated caregiver',
        'Long-term support',
        'Priority family assistance',
        'Personalized care planning'
      ],
      cta: 'Request Service Consultation',
      popular: false
    }
  ];

  const inclusions = [
    {
      title: 'Verified Caregivers',
      desc: 'All caregivers are thoroughly vetted for safety, reliability, and care quality.',
      icon: ShieldCheck
    },
    {
      title: 'Background Checks',
      desc: 'Stringent identity checks and background screening for complete safety.',
      icon: Lock
    },
    {
      title: 'Family Progress Updates',
      desc: 'Access daily summaries, caregiver notes, and updates through your dashboard.',
      icon: MessageSquare
    },
    {
      title: 'Care Coordination',
      desc: 'Dedicated coordinators to manage care schedules, updates, and caregiver matches.',
      icon: Users
    },
    {
      title: 'Dedicated Support',
      desc: 'Our support team is always available to help adjust schedules or answer questions.',
      icon: Heart
    },
    {
      title: 'Secure Care Records',
      desc: 'Your loved one\'s care history and records are stored with strict privacy.',
      icon: Clock
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-12 space-y-12">

      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

      {/* Header + Plans Section */}
      <section className="!mt-0 scroll-mt-12 flex flex-col items-center w-full pt-8 pb-16 px-0 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-sm">
           Care Consultation
        </Badge>
        <h1 className="text-7xl lg:text-[110px] font-bold text-slate-950 tracking-[-0.06em] mb-12 leading-[0.8]">
          Choosing the Right <br />
          <span className="text-slate-400 font-medium italic">Care Service.</span>
        </h1>
        <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto">
          Our care coordinators help families select the most appropriate service based on care requirements, duration, and caregiver availability.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <Card className={`h-full border-none rounded-[56px] p-2 transition-all duration-700 hover:shadow-4xl ${plan.popular ? 'bg-slate-950 text-white shadow-3xl scale-105 relative z-10 !overflow-visible ring-4 ring-primary/20' : 'bg-slate-50 text-slate-950 hover:bg-white border-slate-100 shadow-xl'}`}>
              <CardContent className="p-8 flex flex-col h-full bg-inherit rounded-[50px]">
                 {plan.popular && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="bg-primary text-white border-none px-6 py-2 text-[9px] font-black tracking-[0.4em] uppercase rounded-full shadow-2xl">RECOMMENDED</Badge>
                   </div>
                 )}
                 <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-3 tracking-tight">{plan.name}</h3>
                    <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.tagline}</p>
                 </div>

                  <div className="mb-6 flex flex-col items-start gap-1">
                     <span className="text-3xl font-black tracking-[-0.03em]">{plan.price}</span>
                     <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.unit}</span>
                  </div>

                 <div className="space-y-4 mb-8 flex-grow">
                    {plan.features.map(feat => (
                      <div key={feat} className="flex items-center gap-5 group/item">
                         <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 ${plan.popular ? 'bg-white/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                            <Check size={14} className="stroke-[3]" />
                         </div>
                         <span className={`text-xs font-black uppercase tracking-widest leading-none ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feat}</span>
                      </div>
                    ))}
                 </div>

                  <Button 
                    render={<Link to="/contact" className="w-full" />}
                    nativeButton={false}
                    className={`h-20 w-full rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all ${plan.popular ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-950 text-white hover:bg-slate-900 border-none'}`}
                   >
                      {plan.cta}
                  </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      </section>

      {/* Trust Section: Every Care24 Plan Includes */}
      <section className="scroll-mt-12 bg-white rounded-[48px] mx-4 sm:mx-8 shadow-xl py-20 px-8 sm:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-4 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm">Trust & Safety</Badge>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-[-0.05em] leading-[0.9] mb-4">Every Care24 Plan Includes</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Standard features built to support your family at every step of the care journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {inclusions.map((inc, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-3xl transition-all group relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <inc.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-3 tracking-tight">{inc.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Care Verification & Security Section */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-slate-950 text-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 relative shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-[-0.05em] mb-6">Trusted care. <br /><span className="text-primary italic">Complete peace of mind.</span></h2>
                  <div className="space-y-8">
                     {[
                        { t: 'Verified Identity', d: 'Background checks, credential verification, and reference screening for every caregiver.', icon: ShieldCheck },
                        { t: 'Care Notes & Updates', d: 'Visit summaries, care observations, and service history available for families.', icon: Clock },
                        { t: 'Dedicated Care Support', d: 'Direct access to care coordinators whenever assistance or guidance is needed.', icon: Users }
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
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Quality Standards</p>
                        <h3 className="text-3xl font-black mb-8">Trusted Care Standards</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto">Every caregiver is verified, every visit is documented, and every family stays informed throughout the care journey.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}
