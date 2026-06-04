import { Heart, Globe, Send, Camera, Briefcase, Mail, Phone, MapPin, Share2, Award, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCareStore } from '../../stores/careStore';
import { useEffect } from 'react';

export function Footer() {
  const { settings, services, fetchSettings, fetchServices } = useCareStore();

  useEffect(() => {
    fetchSettings();
    fetchServices();
  }, []);

  const servicesToDisplay = services && services.length > 0 
    ? services.slice(0, 5).map(s => ({ n: s.title, h: '/services' }))
    : [
        { n: 'Nursing Care', h: '/services' },
        { n: 'Elderly Attendant', h: '/services' },
        { n: 'Physiotherapy', h: '/services' },
        { n: 'Post-Hospital Care', h: '/services' },
        { n: 'Long-Term Care', h: '/services' },
      ];

  const quickLinks = [
    { n: 'Home', h: '/' },
    { n: 'Services', h: '/services' },
    { n: 'Expert Network', h: '/caregivers' },
    { n: 'How It Works', h: '/#how-it-works' },
    { n: 'Pricing', h: '/pricing' },
    { n: 'FAQ', h: '/#faq' },
  ];

  return (
    <footer id="footer" className="bg-[#071225] text-slate-300 relative overflow-hidden snap-start">
      {/* Refined Decorative Blur */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-36 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-5 group">
              <div className="bg-primary p-3 rounded-2xl shadow-2xl transition-transform group-hover:rotate-6">
                <Heart className="h-7 w-7 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white">
                  <span className="text-white">Care</span><span className="text-primary">24</span>
                </span>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">Elderly Care Platform</span>
              </div>
            </Link>
            <div>
              <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">About Care24</p>
              <p className="text-slate-500 font-medium leading-relaxed text-xs">
                Compassionate elderly nursing and home healthcare assistance. Connecting families with verified caregivers, nurses, physiotherapists, and attendants for quality care at home.
              </p>
            </div>
            <div className="flex gap-4">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white hover:text-slate-950 transition-all duration-500 hover:scale-110" title="Facebook">
                  <Globe size={20} />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white hover:text-slate-950 transition-all duration-500 hover:scale-110" title="Instagram">
                  <Camera size={20} />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white hover:text-slate-950 transition-all duration-500 hover:scale-110" title="LinkedIn">
                  <Briefcase size={20} />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white hover:text-slate-950 transition-all duration-500 hover:scale-110" title="Twitter">
                  <MessageSquare size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black mb-10 uppercase text-[9px] tracking-[0.4em] flex items-center">
              Services <div className="ml-4 h-[1px] flex-grow bg-white/10"></div>
            </h4>
            <ul className="space-y-5">
              {servicesToDisplay.map((l, i) => (
                <li key={i}>
                  <Link to={l.h} className="text-slate-500 hover:text-white hover:translate-x-2 transition-all flex items-center font-bold text-xs uppercase tracking-widest group">
                    <div className="w-2 h-2 rounded-full border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary mr-4 transition-all"></div>
                    {l.n}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black mb-10 uppercase text-[9px] tracking-[0.4em] flex items-center">
              Quick Links <div className="ml-4 h-[1px] flex-grow bg-white/10"></div>
            </h4>
            <ul className="space-y-5">
              {quickLinks.map((l, i) => (
                <li key={i}>
                   <a href={l.h} className="text-slate-500 hover:text-white hover:translate-x-2 transition-all flex items-center font-bold text-xs uppercase tracking-widest group">
                    <div className="w-2 h-2 rounded-full border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary mr-4 transition-all"></div>
                    {l.n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-black mb-10 uppercase text-[9px] tracking-[0.4em] flex items-center">
              Contact & Support <div className="ml-4 h-[1px] flex-grow bg-white/10"></div>
            </h4>
            <div className="space-y-6">
              {settings?.officeAddress && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Office Address</p>
                     <p className="text-xs font-bold text-slate-300 leading-relaxed">{settings.officeAddress}</p>
                  </div>
                </div>
              )}
              {settings?.supportPhone && (
                <a href={`tel:${settings.supportPhone.replace(/[^\d+]/g, '')}`} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all w-full">
                  <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 group-hover:text-primary/70 transition-colors">Support Phone</p>
                     <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{settings.supportPhone}</span>
                  </div>
                </a>
              )}
              {settings?.supportEmail && (
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${settings.supportEmail}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all w-full">
                  <Mail size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 group-hover:text-primary/70 transition-colors">Support Email</p>
                     <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{settings.supportEmail}</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Legal & Compliance Footer */}
        <div className="border-t border-white/5 mt-16 md:mt-32 pt-8 md:pt-16">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12">
              <div className="flex flex-col items-center lg:items-start gap-2">
                 <p className="text-sm font-black text-white tracking-tight">© 2026 Care24</p>
              </div>
              <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black uppercase tracking-[0.3em]">
                 <Link to="/privacy" className="text-slate-600 hover:text-primary transition-colors">Privacy Policy</Link>
                 <Link to="/terms" className="text-slate-600 hover:text-primary transition-colors">Terms & Conditions</Link>
                 <Link to="/" className="text-slate-600 hover:text-primary transition-colors">Contact Support</Link>
              </div>
              <div className="flex items-center gap-8 text-slate-800">
                 <ShieldCheck size={36} className="transition-colors hover:text-primary" />
                 <Award size={36} className="transition-colors hover:text-primary" />
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}
