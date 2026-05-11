import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  ChevronRight,
  ArrowRight,
  Send,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export function ContactPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen selection:bg-primary/10">
      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.04),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-32 max-w-4xl mx-auto">
          <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm">
            Command Center
          </Badge>
          <h1 className="text-7xl lg:text-[110px] font-black text-slate-950 tracking-[-0.06em] mb-12 leading-[0.8]">
            We're here <br />
            <span className="text-slate-400 font-medium italic">always.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium">
            Whether it's a routine query or a critical clinical escalation, our multi-modal support network is active 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          {/* Contact Details - Left Side */}
          <div className="lg:col-span-5 space-y-16">
             <div className="space-y-12">
                <h2 className="text-4xl font-black text-slate-950 tracking-tight">Direct Channels.</h2>
                <div className="space-y-10">
                   {[
                     { t: 'Emergency Hotline', d: '1-800-SOS-24', icon: PhoneCall, color: 'text-rose-600', bg: 'bg-rose-50' },
                     { t: 'Clinical Support', d: 'support@care24.health', icon: Mail, color: 'text-primary', bg: 'bg-primary/5' },
                     { t: 'Global Headquarters', d: '24th Floor, Empire State Building, NY 10118', icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-100' }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-8 group">
                        <div className={`w-16 h-16 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                           <item.icon size={28} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{item.t}</p>
                           <p className="text-xl font-bold text-slate-950 tracking-tight">{item.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Dynamic Availability Widget */}
             <div className="p-10 rounded-[48px] bg-slate-950 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
                   <p className="text-xs font-black uppercase tracking-[0.3em]">Command Center Active</p>
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tight">Real-time status.</h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-10">All clinical supervisors are currently online. Average response time for live chat is ~45 seconds.</p>
                <Button className="w-full h-16 rounded-[24px] bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
                   START SECURE CHAT
                </Button>
             </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-7">
             <Card className="rounded-[60px] border-slate-100 shadow-4xl p-2 bg-slate-50/50">
                <CardContent className="bg-white rounded-[56px] p-12 lg:p-20">
                   <h3 className="text-4xl font-black text-slate-950 tracking-tight mb-12">Send a Message.</h3>
                   <form className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Patient/Family Name</label>
                            <Input placeholder="John Doe" className="h-16 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verified Email</label>
                            <Input placeholder="john@example.com" type="email" className="h-16 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Case Modality</label>
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {['Nursing', 'Physio', 'Memory', 'General'].map(m => (
                              <div key={m} className="p-4 rounded-xl border border-slate-100 text-center text-xs font-bold text-slate-500 hover:border-primary hover:text-primary cursor-pointer transition-all bg-white shadow-sm">
                                 {m}
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">How can we assist?</label>
                         <Textarea placeholder="Please describe your specific care requirements..." className="min-h-[180px] p-6 rounded-[28px] bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                      </div>

                      <Button className="w-full h-20 rounded-[28px] bg-slate-950 hover:bg-slate-900 text-white font-black text-lg uppercase tracking-widest shadow-3xl shadow-slate-200 active:scale-[0.98] transition-all">
                         DISPATCH MESSAGE <Send size={20} className="ml-4" />
                      </Button>
                      
                      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> HIPAA SECURED PIPELINE
                      </p>
                   </form>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Global Reach & FAQ Shortlink */}
        <section className="mt-48 py-40 border-t border-slate-100">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <h2 className="text-5xl font-black text-slate-950 tracking-tighter mb-8 italic">Instant <br /><span className="text-slate-300 not-italic">Resolutions.</span></h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">Looking for immediate answers regarding pricing, protocols, or caregiver vetting? Our clinical knowledge base is open.</p>
                 <Button variant="ghost" className="h-16 px-10 rounded-2xl border border-slate-100 font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 group" render={<Link to="/services" />} nativeButton={false}>
                   VIEW SERVICE FAQ <HelpCircle size={20} className="ml-3 group-hover:rotate-12 transition-transform" />
                 </Button>
              </div>
              <div className="relative rounded-[60px] overflow-hidden aspect-video bg-slate-100 shadow-4xl group">
                 {/* Map Placeholder */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale opacity-80 group-hover:scale-105 transition-transform duration-1000"></div>
                 <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 rounded-full bg-white border-[12px] border-primary flex items-center justify-center shadow-4xl animate-bounce">
                       <MapPin size={32} className="text-primary" />
                    </div>
                 </div>
                 <div className="absolute bottom-10 left-10 p-6 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white">
                    <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1">Regional HQ</p>
                    <p className="text-sm font-medium text-slate-500">Corporate Tower, Floor 42, New York Hub</p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
