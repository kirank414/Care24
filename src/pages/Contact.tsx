import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MapPin, 
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
import { useCareStore } from '../stores/careStore';

export function ContactPage() {
  const { settings, fetchSettings } = useCareStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const supportEmail = settings?.supportEmail || 'Information will be updated by the administrator.';
  const displayCities = settings?.serviceCoverageDescription || (settings?.supportedCities && settings.supportedCities.length > 0 
    ? settings.supportedCities.join(', ')
    : 'Information will be updated by the administrator.');
  const displayPhone = settings?.supportPhone || 'Information will be updated by the administrator.';

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-primary/10 pb-12 space-y-12">

      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.04),transparent_50%)]"></div>
      
      {/* Header + Form Section */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl bg-white py-24">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <Badge className="bg-primary/5 text-primary border-primary/20 px-5 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-sm">
            Care Support Center
          </Badge>
          <h1 className="text-7xl lg:text-[110px] font-black text-slate-950 tracking-[-0.06em] mb-12 leading-[0.8]">
            Need <br />
            <span className="text-slate-400 font-medium italic">Assistance?</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-medium">
            Our team is committed to helping families find the right care solution for their loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          {/* Contact Details - Left Side */}
          <div className="lg:col-span-5 space-y-6">
             <div className="space-y-6">
                <h2 className="text-4xl font-black text-slate-950 tracking-tight">Direct Support.</h2>
                <div className="space-y-4">
                    {[
                      { t: 'Support Email', d: supportEmail, icon: Mail, color: 'text-primary', bg: 'bg-primary/5', href: settings?.supportEmail ? `mailto:${settings.supportEmail}` : undefined },
                      { t: 'Emergency / Phone', d: displayPhone, icon: PhoneCall, color: 'text-rose-500', bg: 'bg-rose-50', href: settings?.supportPhone ? `tel:${settings.supportPhone}` : undefined },
                      { t: 'Service Coverage', d: displayCities, icon: Globe, color: 'text-slate-600', bg: 'bg-slate-100' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className={`w-16 h-16 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                            <item.icon size={28} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{item.t}</p>
                            {item.href ? (
                              <a href={item.href} className="text-xl font-bold text-slate-950 hover:text-primary transition-colors tracking-tight block">{item.d}</a>
                            ) : (
                              <p className="text-xl font-bold text-slate-950 tracking-tight leading-snug">{item.d}</p>
                            )}
                         </div>
                      </div>
                    ))}
                </div>
             </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-7">
             <Card className="rounded-[60px] border-slate-100 shadow-4xl p-2 bg-slate-50/50">
                <CardContent className="bg-white rounded-[56px] p-12 lg:p-20">
                   <h3 className="text-3xl font-black text-slate-950 tracking-tight mb-6">Send Inquiry.</h3>
                   <form className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                         <Input id="contact-name" placeholder="John Doe" className="h-16 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                            <Input id="contact-email" placeholder="john@example.com" type="email" className="h-16 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                            <Input id="contact-phone" placeholder="+1 (555) 000-0000" type="tel" className="h-16 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message</label>
                         <Textarea id="contact-message" placeholder="Please describe your specific care requirements..." className="min-h-[180px] p-6 rounded-[28px] bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-lg font-medium" />
                      </div>

                      <Button 
                        type="button" 
                        onClick={() => {
                          const name = (document.getElementById('contact-name') as HTMLInputElement)?.value;
                          const email = (document.getElementById('contact-email') as HTMLInputElement)?.value;
                          const phone = (document.getElementById('contact-phone') as HTMLInputElement)?.value;
                          const msg = (document.getElementById('contact-message') as HTMLTextAreaElement)?.value;
                          if (!name || !email || !msg) {
                            import('react-hot-toast').then(m => m.default.error('Please fill in Name, Email, and Message.'));
                            return;
                          }
                          import('react-hot-toast').then(m => m.default.success('Inquiry dispatched successfully to Care Support!'));
                        }}
                        className="w-full h-20 rounded-[28px] bg-slate-950 hover:bg-slate-900 text-white font-black text-lg uppercase tracking-widest shadow-3xl shadow-slate-200 active:scale-[0.98] transition-all"
                      >
                         SEND INQUIRY <Send size={20} className="ml-4" />
                      </Button>
                      
                      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> HIPAA SECURED PIPELINE
                      </p>
                   </form>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
      </section>

      {/* Service Coverage Section */}
      <section className="h-full snap-start scroll-mt-12 flex items-center justify-center overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl bg-white py-24 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <h2 className="text-5xl font-black text-slate-950 tracking-tighter mb-8 italic">Care Services <br /><span className="text-slate-300 not-italic">Near You.</span></h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                   {settings?.serviceCoverageDescription || 'Information will be updated by the administrator.'}
                 </p>
                 <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                       <ShieldCheck size={14} />
                     </div>
                     <span className="text-sm font-bold text-slate-700">Caregiver availability matched dynamically</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                       <ShieldCheck size={14} />
                     </div>
                     <span className="text-sm font-bold text-slate-700">Dedicated service areas covering regional networks</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                       <ShieldCheck size={14} />
                     </div>
                     <span className="text-sm font-bold text-slate-700">Continuous regional expansion based on safety standards</span>
                   </div>
                 </div>
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
                    <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1">Service Coverage</p>
                    <p className="text-sm font-medium text-slate-500">
                      {settings?.serviceCoverageDescription || (settings?.supportedCities && settings.supportedCities.length > 0 
                        ? `Serving: ${settings.supportedCities.slice(0, 3).join(', ')}${settings.supportedCities.length > 3 ? ' & more' : ''}`
                        : 'Information will be updated by the administrator.')}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
