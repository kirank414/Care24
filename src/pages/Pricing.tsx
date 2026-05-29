import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Users, 
  Building2, 
  ArrowRight,
  Stethoscope,
  Heart,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'weekly'>('weekly');

  const plans = [
    {
      name: 'Essential Care',
      tagline: 'Ideal for basic elder assistance',
      price: billingCycle === 'weekly' ? '249' : '899',
      unit: billingCycle === 'weekly' ? '/wk' : '/mo',
      features: [
        'Certified Patient Attendant',
        '8-Hour Caregiving Support',
        'Basic Vital Monitoring',
        'Daily Compliance Reports',
        'CareHub platform access'
      ],
      cta: 'SELECT PLAN',
      popular: false
    },
    {
      name: 'Advanced Nursing',
      tagline: 'Specialized medical recovery',
      price: billingCycle === 'weekly' ? '549' : '1999',
      unit: billingCycle === 'weekly' ? '/wk' : '/mo',
      features: [
        'Registered Nurse (RN) Lead',
        '12-Hour Nursing Care',
        'Real-time Health Updates',
        'Medication management',
        'Bi-weekly MD Tele-Consult',
        'Priority Support Team'
      ],
      cta: 'GET STARTED',
      popular: true
    },
    {
      name: 'Chronic Elite',
      tagline: 'Total medical management',
      price: 'Contact',
      unit: '',
      features: [
        '24/7 Specialist Live-in',
        'Comprehensive home care setup',
        'Detailed care history',
        'Family Dashboard Access',
        'Global Insurance Concierge',
        'Dedicated Care Coordinator'
      ],
      cta: 'TALK TO SALES',
      popular: false
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
           Standardized Pricing
        </Badge>
        <h1 className="text-7xl lg:text-[110px] font-bold text-slate-950 tracking-[-0.06em] mb-12 leading-[0.8]">
          Predictable care, <br />
          <span className="text-slate-400 font-medium italic">zero surprises.</span>
        </h1>
        <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto">
          We've eliminated medical billing confusion with standardized shift fees across national healthcare networks.
        </p>
        
        {/* Billing Toggle - SaaS Elite UI */}
        <div className="mt-20 inline-flex items-center p-1.5 bg-slate-100 rounded-3xl border border-slate-200 shadow-inner">
           <button 
             onClick={() => setBillingCycle('weekly')}
             className={`px-10 h-14 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${billingCycle === 'weekly' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Weekly Shift
           </button>
           <button 
             onClick={() => setBillingCycle('monthly')}
             className={`px-10 h-14 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Monthly Hub
           </button>
        </div>
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
                      <Badge className="bg-primary text-white border-none px-6 py-2 text-[9px] font-black tracking-[0.4em] uppercase rounded-full shadow-2xl">MOST TRUSTED PLAN</Badge>
                   </div>
                 )}
                 <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-3 tracking-tight">{plan.name}</h3>
                    <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.tagline}</p>
                 </div>

                 <div className="mb-6 flex items-baseline gap-3">
                    <span className="text-6xl font-black tracking-[-0.05em]">{plan.price !== 'Contact' && '$'}{plan.price}</span>
                    <span className={`text-sm font-black uppercase tracking-[0.2em] ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>{plan.unit}</span>
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
                    render={<Link to="/login" className="w-full" />}
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

      {/* Institutional Network Section */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center overflow-hidden bg-slate-50 rounded-[48px] mx-4 sm:mx-8 shadow-inner border border-slate-100 py-32">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-24">Trusted Insurance Partners</h3>
           <div className="flex flex-wrap justify-center items-center gap-24 opacity-30 grayscale saturate-0 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> AETNA HEALTH</div>
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> CIGNA GLOBAL</div>
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> ALLIANZ CARE</div>
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> UNITED HEALTHCARE</div>
           </div>
           
           <div className="mt-40 p-20 rounded-[64px] bg-white border border-slate-100 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 shadow-4xl group">
              <div className="flex items-center gap-10">
                 <div className="w-24 h-24 rounded-[32px] bg-slate-950 text-white flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
                    <Globe size={48} />
                 </div>
                 <div className="text-left">
                    <h4 className="text-3xl font-bold text-slate-950 tracking-tight mb-2">Custom Family Plans</h4>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">Flexible pricing options designed to accommodate unique family care needs and schedules.</p>
                 </div>
              </div>
              <Button size="lg" className="h-20 px-12 rounded-[24px] bg-slate-950 text-white hover:bg-slate-900 font-black text-xs uppercase tracking-[0.2em] shadow-xl" render={<Link to="/contact" />} nativeButton={false}>
                 CARE TEAM
              </Button>
           </div>
        </div>
      </section>

    </div>
  );
}
