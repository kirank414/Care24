import { Heart, Globe, Send, Camera, Briefcase, Mail, Phone, MapPin, Share2, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Refined Decorative Blur */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      
      {/* Newsletter Section - High Impact */}
      <div className="border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <Badge className="bg-white/5 text-slate-400 border-white/10 px-4 py-1 mb-6 text-[9px] font-black uppercase tracking-[0.4em] rounded-full">HQ UPDATES</Badge>
                 <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">The future of clinical <br />care at home.</h3>
                 <p className="text-slate-400 font-medium text-lg max-w-md">Join 50,000+ medical professionals and families receiving our elite clinical briefs.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-md lg:ml-auto">
                 <Input className="h-16 rounded-[22px] bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all px-8 font-bold text-sm" placeholder="Work email address" />
                 <Button className="h-16 rounded-[22px] px-10 bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">
                    SUBSCRIBE
                 </Button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          {/* Brand Identity */}
          <div className="space-y-12">
            <Link to="/" className="flex items-center space-x-5 group">
              <div className="bg-primary p-3 rounded-2xl shadow-2xl transition-transform group-hover:rotate-6">
                <Heart className="h-7 w-7 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white">Care<span className="text-primary">24</span></span>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">Global Standard</span>
              </div>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Care24 orchestrates the world's most advanced clinical protocols for home-based recovery, ensuring every patient receives institutional-grade nursing and monitoring.
            </p>
            <div className="flex gap-4">
              {[Globe, Send, Share2, Award].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white hover:text-slate-950 transition-all duration-500 hover:scale-110">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Solutions Architecture */}
          <div>
            <h4 className="text-white font-black mb-10 uppercase text-[9px] tracking-[0.4em] flex items-center">
              Care Architecture <div className="ml-4 h-[1px] flex-grow bg-white/10"></div>
            </h4>
            <ul className="space-y-5">
              {[
                { n: 'ICU Step-down', h: '/services' },
                { n: 'Geriatric Protocols', h: '/services' },
                { n: 'Palliative Nursing', h: '/services' },
                { n: 'Neuro Rehabilitation', h: '/services' },
                { n: 'Cardiac Management', h: '/services' },
                { n: 'Post-Surgical Care', h: '/services' },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.h} className="text-slate-500 hover:text-white hover:translate-x-2 transition-all flex items-center font-bold text-xs uppercase tracking-widest group">
                    <div className="w-2 h-2 rounded-full border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary mr-4 transition-all"></div>
                    {l.n}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h4 className="text-white font-black mb-10 uppercase text-[9px] tracking-[0.4em] flex items-center">
              Infrastructure <div className="ml-4 h-[1px] flex-grow bg-white/10"></div>
            </h4>
            <ul className="space-y-5">
              {[
                { n: 'Methodology & SOP', h: '/about' },
                { n: 'Quality Governance', h: '/about' },
                { n: 'Provider Registry', h: '/caregivers' },
                { n: 'Institutional Pricing', h: '/pricing' },
                { n: 'Security Audits', h: '/' },
                { n: 'Network Onboarding', h: '/signup' },
              ].map((l, i) => (
                <li key={i}>
                   <Link to={l.h} className="text-slate-500 hover:text-white hover:translate-x-2 transition-all flex items-center font-bold text-xs uppercase tracking-widest group">
                    <div className="w-2 h-2 rounded-full border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary mr-4 transition-all"></div>
                    {l.n}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HQ & Support */}
          <div>
            <h4 className="text-white font-black mb-10 uppercase text-[9px] tracking-[0.4em] flex items-center">
              Global Support <div className="ml-4 h-[1px] flex-grow bg-white/10"></div>
            </h4>
            <div className="space-y-10">
              <div className="flex items-start gap-5 p-6 rounded-[32px] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.06] transition-all">
                <MapPin size={24} className="text-primary shrink-0 transition-transform group-hover:scale-110" />
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Global Headquarters</p>
                   <p className="text-sm font-bold text-slate-300 leading-relaxed">International Financial Center <br />Level 42, Suite 1010 <br />Lower Manhattan, NY</p>
                </div>
              </div>
              <div className="space-y-5">
                <a href="tel:180024" className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.2em] group hover:text-white transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                    <Phone size={20} />
                  </div>
                  1-800-CARE-24
                </a>
                <a href="mailto:governance@care24.com" className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.2em] group hover:text-white transition-colors">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                    <Mail size={20} />
                  </div>
                  governance@hq.care24
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Footer */}
        <div className="border-t border-white/5 mt-32 pt-16">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
              <div className="flex flex-col items-center lg:items-start gap-2">
                 <p className="text-sm font-black text-white tracking-tight">© 2026 Care24 Health Systems Corporation.</p>
                 <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mt-1">Institutional Health Data Governance</p>
              </div>
              <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black uppercase tracking-[0.3em]">
                 <Link to="/privacy" className="text-slate-600 hover:text-primary transition-colors">Data Privacy</Link>
                 <Link to="/terms" className="text-slate-600 hover:text-primary transition-colors">SLA Agreements</Link>
                 <Link to="/cookies" className="text-slate-600 hover:text-primary transition-colors">Compliance</Link>
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
