import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Activity,
  UserPlus,
  ChevronRight, 
  CheckCircle2, 
  Star,
  ShieldCheck,
  Clock,
  Heart,
  Users,
  Shield,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  Zap,
  Check,
  Building2,
  Lock,
  Headphones,
  Smartphone,
  Play,
  Bell,
  Send,
  X
} from 'lucide-react';
import { api } from '@/src/api';
import { useAuthStore } from '../store';
import { useCareStore } from '../stores/careStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HomePage() {
  const [activeTab, setActiveTab] = React.useState('track');
  const [publicReviews, setPublicReviews] = useState<any[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const { user } = useAuthStore();
  const { bookings, fetchBookings, careNotes, fetchCareNotes, caregivers, fetchCaregivers, settings, fetchSettings } = useCareStore();

  useEffect(() => {
    api.get('/reviews/public')
      .then(res => setPublicReviews(res.data))
      .catch(err => console.error('Failed to fetch public reviews', err));
    fetchCaregivers();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const activeBooking = bookings[0];

  useEffect(() => {
    if (activeBooking?._id) {
      fetchCareNotes(activeBooking._id);
    }
  }, [activeBooking?._id]);

  const getBookingTimeStr = (booking: any) => {
    if (!booking) return "Today, 10:30 AM";
    const dateStr = new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (booking.durationType === 'hourly') {
      return `${dateStr}, ${booking.startTime || ''} - ${booking.endTime || ''}`;
    }
    return `${dateStr} - ${new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  const isCurrentlyOnVisit = (booking: any) => {
    if (!booking) return false;
    if (booking.status === 'active') return true;
    if (booking.status === 'confirmed' && booking.durationType === 'hourly') {
      const now = new Date();
      const bookingDate = new Date(booking.startDate);
      if (now.toDateString() === bookingDate.toDateString()) {
        if (booking.startTime && booking.endTime) {
          const [startH, startM] = booking.startTime.split(':').map(Number);
          const [endH, endM] = booking.endTime.split(':').map(Number);
          const currentH = now.getHours();
          const currentM = now.getMinutes();
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;
          const currentMinutes = currentH * 60 + currentM;
          return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
        }
      }
    }
    return false;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-amber-50 text-amber-600 border-amber-100', text: 'Pending' };
      case 'confirmed':
        return { bg: 'bg-blue-50 text-blue-600 border-blue-100', text: 'Confirmed' };
      case 'active':
        return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'Active' };
      case 'completed':
        return { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', text: 'Completed' };
      case 'cancelled':
        return { bg: 'bg-red-50 text-red-600 border-red-100', text: 'Cancelled' };
      default:
        return { bg: 'bg-slate-50 text-slate-600 border-slate-100', text: 'Scheduled' };
    }
  };

  const getCarePlanMetrics = (booking: any) => {
    if (!booking) return { text: "3/7 Tasks Completed", percentage: "43%" };
    switch (booking.status?.toLowerCase()) {
      case 'pending':
        return { text: "1/5 Tasks Completed", percentage: "20%" };
      case 'confirmed':
        return { text: "2/5 Tasks Completed", percentage: "40%" };
      case 'active':
        return { text: "4/5 Tasks Completed", percentage: "80%" };
      case 'completed':
        return { text: "5/5 Tasks Completed", percentage: "100%" };
      case 'cancelled':
        return { text: "0/5 Tasks Completed", percentage: "0%" };
      default:
        return { text: "3/7 Tasks Completed", percentage: "43%" };
    }
  };

  useEffect(() => {
    if (publicReviews.length > 3) {
      const interval = setInterval(() => {
        setReviewIndex(prev => (prev + 1) % publicReviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [publicReviews.length]);

  const visibleReviews = publicReviews.length > 0 
    ? publicReviews.slice(reviewIndex, reviewIndex + 3).concat(
        reviewIndex + 3 > publicReviews.length 
          ? publicReviews.slice(0, (reviewIndex + 3) - publicReviews.length) 
          : []
      ).slice(0, 3)
    : [];

  const highReviews = publicReviews.filter((r: any) => r.rating >= 4 && r.rating <= 5);
  const averageRating = highReviews.length > 0
    ? (highReviews.reduce((acc, r) => acc + r.rating, 0) / highReviews.length).toFixed(1)
    : "";
  const reviewCount = highReviews.length;

  const verifiedCgCount = caregivers.filter(cg => cg.isVerified).length;

  const uniqueCities = Array.from(new Set(caregivers.flatMap(cg => cg.cities || []))).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/10 bg-slate-50 pb-12 space-y-12">

      {/* Hero Section - Elite Polish */}
      <section className="!mt-0 relative w-full pt-4 pb-8 px-0 overflow-hidden bg-white">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2000" 
            alt="Healthcare Background" 
            className="w-full h-full object-cover object-[80%_center]"
          />
          {/* Gradient overlay to make text readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-white/80 to-transparent w-full"></div>
          
          {/* Compassionate Overlay Icons */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 text-primary/20"
          >
            <Heart size={120} />
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center pt-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="bg-blue-50 text-slate-800 px-4 py-2 mb-6 rounded-full text-xs font-bold border border-blue-100 shadow-sm inline-flex items-center gap-2">
                 <ShieldCheck size={14} className="text-primary" /> Trusted Care Network
              </Badge>
              
              <h1 className="text-5xl lg:text-[80px] font-black text-slate-950 mb-6 leading-[0.8] tracking-[-0.06em]">
                {settings?.heroTitle || "Information will be updated by the administrator."}
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-800 mb-8 max-w-lg leading-relaxed font-medium">
                {settings?.heroSubtitle || "Information will be updated by the administrator."}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-16">
                <Button className="bg-primary hover:bg-blue-600 text-white rounded-[20px] px-10 h-16 font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all" render={<Link to="/signup" />} nativeButton={false}>
                  {settings?.heroPrimaryCTA || "Information will be updated by the administrator."} <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-[20px] px-10 h-16 font-black text-xs uppercase tracking-widest border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all" render={<Link to="/services" />} nativeButton={false}>
                  {settings?.heroSecondaryCTA || "Information will be updated by the administrator."} <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-12 gap-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                       <UserPlus size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Verified Caregivers</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background Checked</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                       <Clock size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-950 uppercase tracking-tight">24/7 Support</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Available</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shadow-inner">
                       <Shield size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Safe & Secure</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Family, Our Priority</p>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Right Widgets - Mimicking Image 1 */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:flex flex-col items-end justify-center pr-8"
            >
              {/* Card 1 — Patient Satisfaction */}
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-4xl border border-white/50 w-72 mb-8 translate-x-12 hover:-translate-y-2 transition-transform duration-500 group">
                 <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Satisfaction</p>
                   <span className="bg-rose-50 text-rose-500 border border-rose-100 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                     ⭐⭐⭐⭐⭐
                   </span>
                 </div>
                 {reviewCount > 0 ? (
                   <>
                     <h4 className="text-3xl font-black text-slate-950 tracking-tighter mb-1">
                       {averageRating} / 5
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       Average Rating
                     </p>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                       <span>From {reviewCount} Verified Reviews</span>
                     </div>
                   </>
                 ) : (
                   <>
                     <h4 className="text-xl font-black text-slate-950 tracking-tight mb-2">
                       {settings?.satisfactionTitle || "Information will be updated by the administrator."}
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       {settings?.satisfactionDescription || "Information will be updated by the administrator."}
                     </p>
                   </>
                 )}
              </div>

              {/* Card 2 — Verified Caregivers */}
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-4xl border border-white/50 w-72 mb-8 hover:-translate-y-2 transition-transform duration-500 group">
                 <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Caregivers</p>
                   <span className="bg-blue-50 text-primary border border-blue-100 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                     Trusted Professionals
                   </span>
                 </div>
                 {verifiedCgCount > 0 ? (
                   <>
                     <h4 className="text-xl font-black text-slate-950 tracking-tight mb-1">
                       {verifiedCgCount} Active Caregivers
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       Background Checked
                     </p>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <ShieldCheck size={12} className="text-slate-400" />
                       <span>Quality Assured Care</span>
                     </div>
                   </>
                 ) : (
                   <>
                     <h4 className="text-xl font-black text-slate-950 tracking-tight mb-2">
                       {settings?.caregiverTrustTitle || "Information will be updated by the administrator."}
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       {settings?.caregiverTrustDescription || "Information will be updated by the administrator."}
                     </p>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <ShieldCheck size={12} className="text-slate-400" />
                       <span>Quality Assured Care</span>
                     </div>
                   </>
                 )}
              </div>

              {/* Card 3 — Home Healthcare Support */}
              <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[32px] shadow-4xl border border-white/50 w-72 translate-x-8 hover:-translate-y-2 transition-transform duration-500 group">
                 <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Healthcare Support</p>
                   <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                     Care Coverage
                   </span>
                 </div>
                 {uniqueCities.length > 0 ? (
                   <>
                     <h4 className="text-xl font-black text-slate-950 tracking-tight mb-1">
                       Serving {uniqueCities.length} Cities
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       Multi-City Service Coverage
                     </p>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <Clock size={12} className="text-slate-400 animate-pulse" />
                       <span>Compassionate Care Network</span>
                     </div>
                   </>
                 ) : (
                   <>
                     <h4 className="text-xl font-black text-slate-950 tracking-tight mb-2">
                       {settings?.serviceCoverageTitle || "Information will be updated by the administrator."}
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       {settings?.serviceCoverageDescription || "Information will be updated by the administrator."}
                     </p>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <Clock size={12} className="text-slate-400 animate-pulse" />
                       <span>Personalized Elderly Assistance</span>
                     </div>
                   </>
                 )}
              </div>
            </motion.div>
          </div>
        </div>


      </section>



      {/* Services Overview - Elite Cards */}


      {/* How It Works - Refined Timeline */}
      <section className="py-20 scroll-mt-12 flex items-center justify-center bg-slate-950 text-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 relative shadow-2xl">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-white/10 text-white border-white/10 px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">How it works</Badge>
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.85]">Three simple steps to <br /><span className="text-primary italic font-medium">start care.</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              { step: '01', t: 'Family Consultation', d: 'Connect with a care coordinator to understand your family\'s needs and personalize care.' },
              { step: '02', t: 'Caregiver Matching', d: 'Our platform identifies the most suitable compassionate professionals based on your specific needs.' },
              { step: '03', t: 'Seamless Support', d: 'Simple onboarding, personalized care setup, and compassionate assistance starting within 4 hours.' }
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-black text-white/5 absolute -top-10 -left-6 group-hover:text-primary/10 transition-colors">{s.step}</div>
                <div className="relative">
                  <h4 className="text-2xl font-bold mb-4 tracking-tight text-white">{s.t}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Consolidation of Verification */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-24 mb-8">
              <div className="lg:w-1/2">
                <Badge className="bg-emerald-100 text-emerald-700 mb-8 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">Verified & Safe</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-4">How we check <br /><span className="text-slate-400 italic">our caregivers.</span></h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">We only hire the best. Every caregiver goes through a strict 7-step check to make sure your family gets the safest care possible.</p>
                <div className="grid grid-cols-2 gap-8">
                   {[
                     { t: '100%', d: 'Background Verified' },
                     { t: 'Certified', d: 'Professional Care' },
                     { t: '24/7', d: 'Family Support' },
                     { t: 'Expert', d: 'Elderly Support' }
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
                       <p className="text-sm font-bold text-slate-950 leading-relaxed">Care24 verified professionals undergo continuous evaluation to ensure the highest standard of compassionate care.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>



      {/* Real-time Care Platform Preview */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
               <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 mb-8 text-[11px] font-bold uppercase tracking-[0.2em]">Technology</Badge>
               <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tighter leading-[0.95] mb-4">Care management <br /><span className="text-slate-400 italic">without friction.</span></h2>
               
               <div className="space-y-4 mb-14">
                  {[
                    { id: 'track', t: 'Live Shift Tracking', d: 'GPS-verified attendance and real-time activity logging.' },
                    { id: 'vitals', t: 'Health Updates', d: 'Automated vitals monitoring with medical alarm systems.' },
                    { id: 'digital', t: 'e-Prescription Hub', d: 'Digital medication mapping and dosing reminders.' }
                  ].map((tab) => (
                    <div 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-8 rounded-[32px] cursor-pointer transition-all border-2 ${activeTab === tab.id ? 'bg-white border-primary shadow-2xl scale-[1.02]' : 'border-transparent hover:bg-white/50'}`}
                    >
                      <h4 className={`text-xl font-bold mb-2 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`}>{tab.t}</h4>
                      <p className={`text-sm font-medium ${activeTab === tab.id ? 'text-slate-600' : 'text-slate-400'}`}>{tab.d}</p>
                    </div>
                  ))}
               </div>
               
               <Button size="lg" variant="ghost" className="h-16 px-10 rounded-2xl font-bold text-slate-900 border border-slate-200 hover:bg-white shadow-sm" render={<Link to="/about" />} nativeButton={false}>
                  EXPLORE THE TECH STACK <Play className="ml-3 h-4 w-4" />
               </Button>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative rounded-[48px] bg-slate-900 p-4 shadow-3xl overflow-hidden border-[12px] border-slate-800">
                  <div className="bg-white rounded-[32px] overflow-hidden aspect-[4/5] relative">
                     {/* Dashboard Simulation */}
                     <div className="absolute top-0 w-full h-[160px] bg-primary p-10 text-white">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-10 h-10 rounded-full bg-white/20"></div>
                           <Bell size={24} className="opacity-60" />
                        </div>
                        <h3 className="text-2xl font-bold">Patient Monitor</h3>
                     </div>
                     <div className="mt-[130px] p-8 space-y-6">
                        <AnimatePresence mode="wait">
                          {activeTab === 'track' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                               {[1,2,3].map(i => (
                                 <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="h-2 w-1/3 bg-slate-200 rounded-full"></div>
                                    <div className="ml-auto h-2 w-5 bg-slate-100 rounded-full"></div>
                                 </div>
                               ))}
                            </motion.div>
                          )}
                          {activeTab === 'vitals' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                               <div className="h-48 rounded-3xl bg-blue-50 border-2 border-blue-100 p-6">
                                  <div className="flex justify-between items-center mb-6">
                                     <Activity className="text-primary" />
                                     <span className="text-4xl font-black text-primary">72</span>
                                  </div>
                                  <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                     <div className="h-full bg-primary w-2/3"></div>
                                  </div>
                               </div>
                            </motion.div>
                          )}
                          {activeTab === 'digital' && (
                             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 font-bold text-slate-400 text-center py-20">
                                   Digital Records Hub
                                </div>
                             </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
               
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Refined Quotes */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-4 max-w-3xl mx-auto">
            <Badge className="bg-rose-50 text-rose-500 border-none px-6 py-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">The Care Experience</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-[0.9] mb-8">Professional care, <br /><span className="text-slate-400 italic">human healing.</span></h2>
          </div>

          {(() => {
            const defaultTestimonials = [
              { 
                comment: "The ICU nurses from Care24 didn't just monitor vitals. They brought a sense of clinical calm to our home that I didn't think was possible outside a hospital.", 
                patientName: "Sarah Johnson", 
                rating: 5,
                tag: "Recovery Case #421 • Post-Op Nursing" 
              },
              { 
                comment: "Finally, a health-tech platform that actually understands operational rigor. The real-time telemetry gave our family the data we needed to feel safe.", 
                patientName: "Dr. Arvind Mehta", 
                rating: 5,
                tag: "Institutional Client • Family Support" 
              },
              { 
                comment: "It's rare to find such high-level dementia expertise. The caregiver matching was eerily accurate, bringing someone who truly connected with my mother.", 
                patientName: "Mark Williams", 
                rating: 5,
                tag: "Memory Care Support • Long-term Care" 
              }
            ];

            const reviewsToDisplay = publicReviews.length > 0 ? visibleReviews : defaultTestimonials;

            return (
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviewsToDisplay.map((r: any, i: number) => (
                      <motion.div 
                        key={r._id || i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                        <div className="flex gap-1 mb-4">
                           {Array.from({ length: r.rating || 5 }).map((_, s) => <Star key={s} size={14} className="fill-primary text-primary" />)}
                        </div>
                        <p className="text-xl font-medium text-slate-700 leading-relaxed mb-4 tracking-tight">"{r.comment}"</p>
                        <div>
                           <p className="text-xl font-black text-slate-950 tracking-tight">{r.patientName}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                              {r.tag || "Verified Patient"}
                           </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SOS Banner - Redesign */}
      <section className="py-12 scroll-mt-12 flex items-center justify-center mx-4 sm:mx-8 p-1 rounded-[48px] bg-gradient-to-br from-red-600 via-rose-600 to-rose-700 shadow-2xl shadow-rose-500/30 overflow-hidden">

         <div className="bg-white/5 backdrop-blur-2xl p-10 lg:p-16 rounded-[56px] flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
               <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse text-white ring-8 ring-white/10 shrink-0">
                  <PhoneCall size={36} />
               </div>
               <div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3 leading-none">Emergency Intervention</h3>
                  <p className="text-rose-100 text-lg font-medium max-w-lg">Standard 30-second response time for all care escalations. Our support team is on standby.</p>
               </div>
            </div>
            <div className="flex flex-col items-center gap-6 text-center">
               <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">{settings?.supportPhone || "Contact details will be updated upon deployment"}</span>
               <Button size="lg" className="rounded-2xl h-16 px-12 bg-white text-rose-600 hover:bg-rose-50 font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all" render={<Link to="/contact" />} nativeButton={false}>
                  CONTACT SUPPORT
               </Button>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <Badge className="bg-primary/5 text-primary border-none px-6 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">Frequently Asked Questions</Badge>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tighter leading-none mb-8">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">Everything you need to know about our elderly care and home healthcare services.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-6">
            {[
              { q: "How do I book a caregiver through Care24?", a: "Create an account, complete the patient profile, browse available caregivers, choose a service, and submit a booking request." },
              { q: "Are caregivers verified before joining Care24?", a: "Yes. Every caregiver undergoes profile verification before being approved on the platform." },
              { q: "What services are available through Care24?", a: "Nursing Care, Elderly Attendant Services, Physiotherapy, Post-Hospital Care, Dementia Support, and Chronic Care Assistance." },
              { q: "Can I schedule long-term care services?", a: "Yes. Care24 supports hourly, daily, and long-term care arrangements based on your family's needs." },
              { q: "Can I change or cancel a booking?", a: "Yes. Users can manage bookings and request changes through their dashboard." },
              { q: "How are service charges calculated?", a: "Pricing depends on service type, duration, caregiver qualifications, and care requirements." },
              { q: "Which cities does Care24 currently serve?", a: "Care24 supports caregivers across multiple cities and continues expanding service coverage." },
              { q: "How do I report an issue or file a complaint?", a: "Users can submit complaints directly through their dashboard. Our team reviews and resolves all concerns promptly." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-[40px] px-10 py-4 bg-white shadow-sm hover:shadow-xl transition-all">
                <AccordionTrigger className="text-2xl font-bold text-slate-950 hover:no-underline text-left tracking-tight py-6">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 font-medium text-lg leading-relaxed pt-2 pb-10">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Support Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 mb-6 p-12 rounded-[48px] bg-slate-950 text-white shadow-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="max-w-md">
                  <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">Still Have Questions?</h3>
                  <p className="text-slate-400 font-medium">Our Care Support Team is here to help you choose the right care solution for your loved ones.</p>
               </div>
               <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                  <Button 
                    className="h-16 px-10 rounded-2xl bg-white text-slate-950 hover:bg-slate-50 font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl font-sans"
                    render={<Link to="/contact" />}
                    nativeButton={false}
                  >
                     Contact Support
                  </Button>
                  <Button 
                    className="h-16 px-10 rounded-2xl bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all font-sans"
                    render={<Link to="/services" />} 
                    nativeButton={false}
                  >
                     Book a Service
                  </Button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Inquiry Modal */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-8 relative border border-slate-100"
            >
              <button 
                onClick={() => setIsSupportModalOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Headphones size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Contact Care Support</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Ask questions, request guidance, or check availability.</p>
                </div>
              </div>

              <div className="space-y-6">
                {!user && (
                  <div className="space-y-2">
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">Your Email *</label>
                     <Input 
                        id="modal-faq-email"
                        type="email"
                        placeholder="email@example.com" 
                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                     />
                  </div>
                )}
                <div className="space-y-2">
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">Your Question *</label>
                   <textarea 
                      id="modal-faq-question"
                      rows={4}
                      placeholder="Type your care requirements or questions..." 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                   ></textarea>
                </div>

                <Button 
                  onClick={async () => {
                    const qInput = document.getElementById('modal-faq-question') as HTMLTextAreaElement;
                    const eInput = document.getElementById('modal-faq-email') as HTMLInputElement;
                    const question = qInput?.value;
                    const email = eInput?.value;

                    if (!question) {
                       import('react-hot-toast').then(m => m.default.error('Please enter your question.'));
                       return;
                    }

                    if (!user && !email) {
                       import('react-hot-toast').then(m => m.default.error('Please enter your email to receive replies.'));
                       return;
                    }

                    try {
                       await useCareStore.getState().submitInquiry({ question, email });
                       import('react-hot-toast').then(m => m.default.success(
                         user 
                           ? 'Your inquiry has been submitted! Check your dashboard for answers.' 
                           : `Your inquiry has been submitted! We will email the answer to ${email}.`
                       ));
                       setIsSupportModalOpen(false);
                    } catch (err: any) {
                       import('react-hot-toast').then(m => m.default.error(err.message || 'Failed to submit inquiry'));
                    }
                  }}
                  className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                   SUBMIT QUESTION
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
