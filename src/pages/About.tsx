import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCareStore } from '../stores/careStore';
import { 
  ShieldCheck, 
  Users, 
  Heart,
  Clock,
  ClipboardList,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AboutPage() {
  const { caregivers, bookings, settings, fetchCaregivers, fetchBookings, fetchSettings } = useCareStore();

  useEffect(() => {
    fetchCaregivers();
    fetchBookings();
    fetchSettings();
  }, []);

  const pillars = [
    {
      title: 'Caregiver Verification',
      description: 'Every caregiver undergoes thorough credential checks, background screening, and reference verification before joining our platform.',
      icon: ShieldCheck,
      stats: 'Strict Verification'
    },
    {
      title: 'Compassionate Support',
      description: "We focus on matching your family with a caregiver who fits your loved one's specific needs, daily routines, and personality.",
      icon: Heart,
      stats: 'Personalized Care'
    },
    {
      title: 'Family Peace of Mind',
      description: "We respect your family's privacy and manage all care details securely, keeping you informed at every step of the care journey.",
      icon: Users,
      stats: 'Safe & Secure'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Create Elder Profile',
      description: "Tell us about your loved one's needs, schedule, and care requirements.",
      icon: ClipboardList
    },
    {
      step: '02',
      title: 'Select Required Service',
      description: 'Choose from nursing care, caregiver assistance, or physiotherapy.',
      icon: Heart
    },
    {
      step: '03',
      title: 'Browse Verified Caregivers',
      description: 'Review credentials, experience, ratings, and availability.',
      icon: ShieldCheck
    },
    {
      step: '04',
      title: 'Choose Schedule',
      description: 'Select hourly visits, daily shifts, or long-term care plans.',
      icon: Calendar
    },
    {
      step: '05',
      title: 'Submit Booking Request',
      description: 'Confirm and submit your schedule request to our support team.',
      icon: Users
    },
    {
      step: '06',
      title: 'Receive Updates & Care History',
      description: 'Stay informed with visit summaries and care progress notes.',
      icon: Clock
    }
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
              How It Works
            </Badge>
            <h1 className="text-7xl lg:text-[130px] font-black text-slate-950 tracking-[-0.07em] leading-[0.8] mb-6">
              Trusted home care <br />
              <span className="text-slate-400 font-medium italic">for every family.</span>
            </h1>
            <p className="text-xl lg:text-3xl text-slate-500 leading-relaxed font-medium max-w-4xl mx-auto tracking-tight">
              Care24 connects families with verified caregivers, nurses, physiotherapists, and attendants through a simple and transparent process. Quality home care starts with the right support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How Care24 Works - 6-Step Timeline */}
      <section className="scroll-mt-12 bg-white rounded-[48px] mx-4 sm:mx-8 shadow-xl py-20 px-8 sm:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-4 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm">Process Flow</Badge>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-[-0.05em] leading-[0.9] mb-4">How Care24 Works</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">A simple and transparent process designed for families.</p>
          </div>

          <div className="relative">
            {/* Connected horizontal timeline line on desktop */}
            <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 relative z-10">
              {processSteps.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Icon Capsule with timeline point wrapper */}
                  <div className="relative mb-6">
                    {/* Circle Indicator */}
                    <div className="w-20 h-20 rounded-[30px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1">
                      <p.icon size={32} strokeWidth={1.5} />
                    </div>
                    {/* Step Number Tag */}
                    <span className="absolute -top-2 -right-2 bg-slate-950 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      {p.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-950 mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-[200px]">
                    {p.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How we verify our caregivers */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-24 mb-8">
              <div className="lg:w-1/2">
                <Badge className="bg-emerald-100 text-emerald-700 mb-8 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">Verified & Safe</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-4">How we verify <br /><span className="text-slate-400 italic">our caregivers.</span></h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">Every caregiver undergoes identity verification, profile review, and qualification checks before being approved to provide care services through Care24.</p>
                <div className="grid grid-cols-2 gap-8">
                   {[
                     { t: 'Background Verification', d: 'Identity & Credential Checks' },
                     { t: 'Qualified Professionals', d: 'Experienced & Verified' },
                     { t: 'Family Support', d: 'Care Assistance Available' },
                     { t: 'Experienced Caregivers', d: 'Compassionate Elderly Assistance' }
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
                       <p className="text-sm font-bold text-slate-950 leading-relaxed">Care24 verified professionals undergo continuous review to help maintain high standards of safety, reliability, and compassionate care.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
             <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-1.5 mb-8 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">Core Principles</Badge>
             <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-[-0.04em]">Why Families Trust Care24</h2>
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
    </div>
  );
}
