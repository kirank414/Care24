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
  CreditCard,
  Lock,
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
        '8-Hour Clinical Oversight',
        'Basic Vital Monitoring',
        'Daily Compliance Reports',
        'CareHub platform access'
      ],
      cta: 'SELECT PLAN',
      popular: false
    },
    {
      name: 'Clinical Nursing',
      tagline: 'Precision ICU recovery protocol',
      price: billingCycle === 'weekly' ? '549' : '1999',
      unit: billingCycle === 'weekly' ? '/wk' : '/mo',
      features: [
        'Registered Nurse (RN) Lead',
        '12-Hour Critical Care',
        'Real-time Telemetry Sync',
        'IV & clinical management',
        'Bi-weekly MD Tele-Consult',
        'Priority SOS Escalation'
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
        'Home ICU infrastructure',
        'Infinite Telemetry retention',
        'Institutional Governance',
        'Global Insurance Concierge',
        'Tier-1 Medical Hotline'
      ],
      cta: 'TALK TO SALES',
      popular: false
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
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
            <Card className={`h-full border-none rounded-[56px] p-2 transition-all duration-700 hover:shadow-4xl ${plan.popular ? 'bg-slate-950 text-white shadow-3xl scale-105 relative z-10' : 'bg-slate-50 text-slate-950 hover:bg-white border-slate-100 shadow-xl'}`}>
              <CardContent className="p-12 flex flex-col h-full bg-inherit rounded-[50px]">
                 {plan.popular && (
                   <div className="absolute top-10 right-10">
                      <Badge className="bg-primary text-white border-none px-6 py-2 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">RECOMMENDED</Badge>
                   </div>
                 )}
                 
                 <div className="mb-14">
                    <h3 className="text-3xl font-bold mb-3 tracking-tight">{plan.name}</h3>
                    <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.tagline}</p>
                 </div>

                 <div className="mb-16 flex items-baseline gap-3">
                    <span className="text-6xl font-black tracking-[-0.05em]">{plan.price !== 'Contact' && '$'}{plan.price}</span>
                    <span className={`text-sm font-black uppercase tracking-[0.2em] ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>{plan.unit}</span>
                 </div>

                 <div className="space-y-6 mb-20 flex-grow">
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

      {/* Institutional Network Section */}
      <section className="mt-60 border-t border-slate-50 py-40 overflow-hidden bg-slate-50 shadow-inner rounded-[80px] mx-4 sm:mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-24">Institutional Network Access</h3>
           <div className="flex flex-wrap justify-center items-center gap-24 opacity-30 grayscale saturate-0 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> AETNA HEALTH</div>
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> CIGNA GLOBAL</div>
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> ALLIANZ CARE</div>
              <div className="flex items-center gap-4 font-black text-2xl tracking-tighter text-slate-900"><Building2 size={40} /> UNITED CLINICAL</div>
           </div>
           
           <div className="mt-40 p-20 rounded-[64px] bg-white border border-slate-100 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 shadow-4xl group">
              <div className="flex items-center gap-10">
                 <div className="w-24 h-24 rounded-[32px] bg-slate-950 text-white flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
                    <Globe size={48} />
                 </div>
                 <div className="text-left">
                    <h4 className="text-3xl font-bold text-slate-950 tracking-tight mb-2">Enterprise Protocols</h4>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">Bespoke pricing architectures for hospital groups and institutional care mandates.</p>
                 </div>
              </div>
              <Button size="lg" className="h-20 px-12 rounded-[24px] bg-slate-950 text-white hover:bg-slate-900 font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                 GOVERNANCE DESK
              </Button>
           </div>
        </div>
      </section>

      {/* Security Governance Floor */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-20 text-slate-400 font-black uppercase tracking-[0.35em] text-[9px]">
            <div className="flex items-center gap-3 transition-colors hover:text-slate-950"><Lock size={18} /> 2048-BIT ENCRYPTION</div>
            <div className="flex items-center gap-3 transition-colors hover:text-slate-950"><ShieldCheck size={18} /> HIPAA LEVEL III</div>
            <div className="flex items-center gap-3 transition-colors hover:text-slate-950"><CreditCard size={18} /> PCI-DSS COMPLIANT</div>
            <div className="flex items-center gap-3 transition-colors hover:text-slate-950"><Check size={18} /> ZERO-TRUST LOGGING</div>
         </div>
      </section>
    </div>
  );
}
