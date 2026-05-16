import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/src/store';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Expert Network', href: '/caregivers' },
    { name: 'Methodology', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <>
      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
         <Button 
            className="w-full h-16 rounded-[24px] bg-primary text-white font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(37,99,235,0.4)] border-none active:scale-[0.98] transition-all"
            render={<Link to="/caregivers" />}
            nativeButton={false}
         >
            Find a Specialist Now <ArrowRight className="ml-2 h-4 w-4" />
         </Button>
      </div>

      {/* Upper Top Bar */}
      <div className="bg-slate-900 overflow-hidden relative z-[60] hidden lg:block">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-10">
               <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                     <ShieldCheck size={14} className="text-primary" />
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">ISO 9001:2015 Certified Healthcare Provider</span>
                  </div>
               </div>
               <div className="flex items-center space-x-6">
                  <a href="tel:180024224" className="flex items-center space-x-2 text-white hover:text-primary transition-colors">
                     <Phone size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Medical Support: 1-800-CARE-24</span>
                  </a>
                  <Link to="/partners" className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Corporate Solutions</Link>
               </div>
            </div>
         </div>
      </div>

      <nav className="relative w-full z-50 flex-none bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-700 rounded-[32px] ${isScrolled ? 'bg-white/80 backdrop-blur-2xl shadow-4xl shadow-blue-500/10 border border-white/50 py-3 px-8' : 'bg-transparent py-4 px-4'}`}>
            <div className="flex justify-between items-center gap-4">
              <Link to="/" className="flex items-center space-x-4 group flex-shrink-0">
                <div className="bg-primary p-2.5 rounded-2xl shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Heart className="h-6 w-6 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tighter text-slate-900 transition-colors">Care<span className="text-primary group-hover:text-slate-900 transition-colors">24</span></span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none hidden sm:block">Elderly Healthcare Support</span>
                </div>
              </Link>

              {/* Desktop Nav - Centered */}
              <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    className={`px-3 py-2 text-sm font-bold transition-all rounded-xl relative group whitespace-nowrap ${location.pathname === link.href ? 'text-primary' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4 flex-shrink-0 ml-auto">
                <div className="hidden xl:flex flex-col items-end mr-2">
                   <div className="flex items-center gap-2 text-slate-900">
                      <Phone size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Emergency Support</span>
                   </div>
                   <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">24/7 Available</span>
                </div>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <Button className="rounded-2xl bg-slate-950 hover:bg-black px-6 h-12 font-bold shadow-xl shadow-slate-900/20 text-xs uppercase tracking-widest text-white whitespace-nowrap" render={<Link to="/dashboard" />} nativeButton={false}>
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl border-slate-200 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 px-6 h-12 font-bold text-xs uppercase tracking-widest text-slate-600 transition-all whitespace-nowrap" 
                      onClick={() => logout()}
                      nativeButton={true}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button className="rounded-2xl bg-primary hover:bg-primary/90 px-8 h-12 font-bold shadow-xl shadow-blue-500/20 text-sm whitespace-nowrap" render={<Link to="/signup" />} nativeButton={false}>
                    Book a Service
                  </Button>
                )}
              </div>

              {/* Mobile Nav Button */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger render={<button className="p-2 inline-flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors" />} nativeButton={true}>
                    <Menu className="h-7 w-7" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md border-l-0 p-0">
                    <div className="flex flex-col h-full bg-white">
                      <div className="p-8 border-b border-slate-50">
                        <Link to="/" className="flex items-center space-x-4">
                           <div className="bg-primary p-2.5 rounded-2xl">
                             <Heart className="h-6 w-6 text-white fill-white" />
                           </div>
                           <span className="text-2xl font-bold tracking-tighter text-slate-900">Care<span className="text-primary">24</span></span>
                        </Link>
                      </div>
                      <div className="flex flex-col p-8 space-y-4">
                        {navLinks.map((link) => (
                          <Link key={link.name} to={link.href} className="text-3xl font-bold text-slate-900 hover:text-primary transition-colors py-2">
                            {link.name}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-auto p-8 border-t border-slate-50 bg-slate-50">
                        {isAuthenticated ? (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-12 h-12 rounded-2xl bg-white shadow-sm" alt="U" />
                               <div>
                                 <h4 className="font-bold text-slate-900">{user?.name}</h4>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
                               </div>
                            </div>
                            <Button className="w-full h-16 rounded-2xl font-bold" render={<Link to="/dashboard" />} nativeButton={false}>
                               GO TO DASHBOARD
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full h-16 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-xs" 
                              onClick={() => logout()}
                              nativeButton={true}
                            >
                               LOGOUT
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Button className="w-full h-16 rounded-2xl bg-primary font-bold text-lg" render={<Link to="/signup" />} nativeButton={false}>
                              GET STARTED
                            </Button>
                            <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-200 font-bold" render={<Link to="/login" />} nativeButton={false}>
                              MEMBER LOGIN
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
