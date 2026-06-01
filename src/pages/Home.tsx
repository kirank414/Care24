import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity,
  UserPlus,
  ChevronRight, 
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
import carePhilosophyImg from '../assets/care-philosophy.jpg';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { normalizeEmail } from '@/src/utils/normalize';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('booking');
  const [publicReviews, setPublicReviews] = useState<any[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const [inlineQuestion, setInlineQuestion] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const { user } = useAuthStore();
  const { bookings, fetchBookings, careNotes, fetchCareNotes, caregivers, fetchCaregivers, settings, fetchSettings } = useCareStore();

  const handleInlineInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must login or signup to ask a question. Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    if (!inlineQuestion.trim()) {
      toast.error('Please enter your question.');
      return;
    }
    setIsSubmittingInquiry(true);
    try {
      await useCareStore.getState().submitInquiry({ 
        question: inlineQuestion.trim(), 
        email: user.email 
      });
      toast.success('Thank you. Our Care Support Team has received your inquiry.');
      setInlineQuestion('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

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

  const highReviews = publicReviews.filter((r: any) => r.rating >= 4 && r.rating <= 5);

  useEffect(() => {
    if (highReviews.length > 3) {
      const interval = setInterval(() => {
        setReviewIndex(prev => (prev + 1) % highReviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [highReviews.length]);

  const visibleReviews = highReviews.length >= 3
    ? highReviews.slice(reviewIndex, reviewIndex + 3).concat(
        reviewIndex + 3 > highReviews.length 
          ? highReviews.slice(0, (reviewIndex + 3) - highReviews.length) 
          : []
      ).slice(0, 3)
    : highReviews;

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
                {settings?.heroTitle || "Compassionate Elderly Care at Home"}
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-800 mb-8 max-w-lg leading-relaxed font-medium">
                {settings?.heroSubtitle || "Connect with verified caregivers, nurses, physiotherapists, and attendants who provide safe, reliable, and compassionate home healthcare services for your loved ones."}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-16">
                <Button className="bg-primary hover:bg-blue-600 text-white rounded-[20px] px-10 h-16 font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all w-full sm:w-auto" render={<Link to="/signup" />} nativeButton={false}>
                  {settings?.heroPrimaryCTA || "Book a Service"} <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-[20px] px-10 h-16 font-black text-xs uppercase tracking-widest border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all w-full sm:w-auto" render={<Link to="/services" />} nativeButton={false}>
                  {settings?.heroSecondaryCTA || "Explore Services"} <ArrowRight className="ml-3 h-5 w-5" />
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
                       {settings?.satisfactionTitle || "Patient Satisfaction"}
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       {settings?.satisfactionDescription || "Verified Family Reviews"}
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
                       {settings?.caregiverTrustTitle || "Verified Caregivers"}
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       {settings?.caregiverTrustDescription || "Background Checked Professionals"}
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
                       {settings?.serviceCoverageTitle || "Available Across Service Regions"}
                     </h4>
                     <p className="text-xs text-slate-500 font-bold mb-2">
                       {settings?.serviceCoverageDescription || "Multi-City Service Coverage"}
                     </p>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <Clock size={12} className="text-slate-400 animate-pulse" />
                       <span>Compassionate Care Network</span>
                     </div>
                   </>
                 )}
              </div>
            </motion.div>
          </div>
        </div>


      </section>


      {/* Care Philosophy & Emotional Storytelling */}
      <section className="bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl">
         <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[500px]">
            {/* Left Image Column - Cover Left, Top, and Bottom */}
            <div className="relative w-full min-h-[300px] lg:min-h-full overflow-hidden group">
               <img 
                  src={carePhilosophyImg} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt="Care Philosophy"
               />
            </div>
            
            {/* Right Content Column - Padded and Centered */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-20">
               <Badge className="bg-rose-50 text-rose-600 mb-4 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] self-start">The Human Element</Badge>
               <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-6">care philosophy <br /><span className="text-slate-400 italic">rooted in empathy.</span></h2>
               <p className="text-xl text-slate-700 font-medium leading-relaxed mb-6">
                  At Care24, we believe that compassionate care is only half the battle. True comfort happens when a loved one feels seen, heard, and respected in their own home. Our philosophy merges high standards of home care with genuine empathy and respect.
               </p>
               <div className="space-y-8">
                  {[
                    { t: 'Dignity First', d: 'Every care service is provided with the utmost respect for senior privacy and autonomy.', icon: Heart },
                    { t: 'Family Inclusion', d: 'We treat the family as an integral partner in care planning and updates.', icon: Users },
                    { t: 'Care Coordination', d: 'We help coordinate care schedules, updates, and caregiver matches to ensure your loved one gets the best attention.', icon: ShieldCheck }
                  ].map((val, i) => (
                    <div key={i} className="flex gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-rose-500 shrink-0">
                          <val.icon size={24} />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-slate-950 mb-1 tracking-tight">{val.t}</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">{val.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Everything You Need to Manage Elderly Care */}
      <section className="min-h-screen py-16 sm:py-24 scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
               <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 mb-8 text-[11px] font-bold uppercase tracking-[0.2em]">Manage Care</Badge>
               <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tighter leading-[0.95] mb-4">Everything You Need <br /><span className="text-slate-400 italic">to Manage Elderly Care.</span></h2>
               <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">Care24 helps families coordinate home care, view verified caregiver profiles, track active schedules, and access daily caregiver updates.</p>
               
               <div className="space-y-4 mb-14">
                  {[
                    { id: 'booking', t: 'Easy Online Booking', d: 'Book nursing care, elderly attendants, physiotherapy, and post-hospital support in a few simple steps.' },
                    { id: 'profiles', t: 'Verified Caregiver Profiles', d: 'Review caregiver qualifications, experience, ratings, and verification status before booking.' },
                    { id: 'tracking', t: 'Service Tracking', d: 'Stay informed with booking updates and service progress throughout the care journey.' },
                    { id: 'history', t: 'Care Notes & History', d: 'Access visit summaries and care notes to stay connected with your loved one\'s care.' }
                  ].map((tab) => (
                    <div 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-6 rounded-[24px] cursor-pointer transition-all border-2 ${activeTab === tab.id ? 'bg-white border-primary shadow-2xl scale-[1.02]' : 'border-transparent hover:bg-white/50'}`}
                    >
                      <h4 className={`text-lg font-bold mb-1 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`}>{tab.t}</h4>
                      <p className={`text-xs font-medium ${activeTab === tab.id ? 'text-slate-600' : 'text-slate-400'}`}>{tab.d}</p>
                    </div>
                  ))}
               </div>
               
               <Button size="lg" variant="ghost" className="mt-10 mb-8 h-16 px-10 rounded-2xl font-bold text-slate-900 border border-slate-200 hover:bg-white shadow-sm" render={<Link to="/services" />} nativeButton={false}>
                  EXPLORE SERVICES <ArrowRight className="ml-3 h-4 w-4" />
               </Button>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative rounded-[48px] bg-slate-900 p-4 shadow-3xl overflow-hidden border-[12px] border-slate-800">
                  <div className="bg-white rounded-[32px] overflow-hidden aspect-[4/5] relative">
                     {/* Care App Simulation */}
                     <div className="absolute top-0 w-full h-[160px] bg-primary p-10 text-white">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-10 h-10 rounded-full bg-white/20"></div>
                           <Bell size={24} className="opacity-60" />
                         </div>
                         <h3 className="text-2xl font-bold">Care Portal</h3>
                      </div>
                      <div className="mt-[130px] p-8 space-y-6">
                         <AnimatePresence mode="wait">
                           {activeTab === 'booking' && (
                             <motion.div key="booking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Select Care Service</p>
                               <div className="grid grid-cols-2 gap-3">
                                 {[
                                   'Nursing Care',
                                   'Elderly Attendant',
                                   'Physiotherapy',
                                   'Post-Hospital Care'
                                 ].map((srv, idx) => (
                                   <div key={idx} className={`p-3.5 rounded-xl border text-center transition-all ${idx === 1 ? 'bg-blue-50 border-primary text-primary font-bold shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                                     <span className="text-xs">{srv}</span>
                                   </div>
                                 ))}
                               </div>
                               <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                 <h5 className="text-xs font-bold text-slate-800">Care Duration</h5>
                                 <div className="flex gap-2">
                                   <span className="text-[10px] bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-bold">Hourly Shift</span>
                                   <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-full font-bold shadow-sm">Daily (24h)</span>
                                   <span className="text-[10px] bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 font-bold">Long-term</span>
                                 </div>
                               </div>
                             </motion.div>
                           )}
                           {activeTab === 'profiles' && (
                             <motion.div key="profiles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                               <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200" alt="Sarah Jenkins" />
                                 <div>
                                   <h4 className="font-bold text-slate-900 leading-none">Sarah Jenkins</h4>
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1.5 inline-block">Verified Caregiver</span>
                                 </div>
                               </div>
                               <div className="p-6 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-sm">
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Caregiver Profile Vetting</p>
                                 <div className="space-y-1.5">
                                   <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                     <Check className="text-emerald-500 w-3.5 h-3.5" /> Verified Badge: Background Verified
                                   </div>
                                   <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                     <Check className="text-emerald-500 w-3.5 h-3.5" /> Qualifications: GNM Nursing Degree
                                   </div>
                                   <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                     <Check className="text-emerald-500 w-3.5 h-3.5" /> Experience: 5+ Years Experience
                                   </div>
                                   <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                     <Check className="text-emerald-500 w-3.5 h-3.5" /> Ratings: 4.9 / 5 Stars (120+ Bookings)
                                   </div>
                                 </div>
                               </div>
                             </motion.div>
                           )}
                           {activeTab === 'tracking' && (
                             <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                               <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                 <div className="flex justify-between items-center">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Tracking</span>
                                   <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">Care In Progress</span>
                                 </div>
                                 <div className="space-y-2 relative pl-4 border-l border-slate-200">
                                   <div className="relative">
                                     <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                     <h5 className="text-xs font-bold text-slate-800">Request Submitted</h5>
                                   </div>
                                   <div className="relative">
                                     <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                     <h5 className="text-xs font-bold text-slate-800">Caregiver Assigned</h5>
                                   </div>
                                   <div className="relative">
                                     <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                     <h5 className="text-xs font-bold text-slate-800">Service Confirmed</h5>
                                   </div>
                                   <div className="relative">
                                     <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse"></span>
                                     <h5 className="text-xs font-bold text-slate-900">Care In Progress</h5>
                                   </div>
                                   <div className="relative">
                                     <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                                     <h5 className="text-xs font-bold text-slate-400">Completed</h5>
                                   </div>
                                 </div>
                               </div>
                             </motion.div>
                           )}
                           {activeTab === 'history' && (
                             <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Care Notes & History</p>
                               {[
                                 { t: 'Morning Visit Completed', d: 'Sarah J. checked in at 08:30 AM' },
                                 { t: 'Medication Assistance', d: 'Assisted with prescribed schedule & fluid intake' },
                                 { t: 'Mobility Support', d: 'Supported with light exercises & indoor walking' },
                                 { t: 'Visit Summary Logged', d: 'Daily care record submitted to family dashboard' }
                               ].map((item, idx) => (
                                 <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                   <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                                     <Check className="w-3 h-3 stroke-[3px]" />
                                   </div>
                                   <div>
                                     <h6 className="text-xs font-bold text-slate-900">{item.t}</h6>
                                     <p className="text-[10px] font-medium text-slate-500">{item.d}</p>
                                   </div>
                                 </div>
                               ))}
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
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-[0.9] mb-8">What Families Say <br /><span className="text-slate-400 italic">About Care24.</span></h2>
          </div>

          {(() => {
            const reviewsToDisplay = visibleReviews;

            if (reviewsToDisplay.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center p-16 rounded-[48px] bg-slate-50 border border-slate-100 text-center max-w-xl mx-auto shadow-inner">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6 shadow-sm">
                    <Heart size={28} className="fill-rose-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-950 mb-2">No Reviews Yet</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    Reviews will appear here as families share their Care24 experiences.
                  </p>
                </div>
              );
            }

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
                           <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               Verified Patient
                             </span>
                             {r.createdAt && (
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                 • {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                               </span>
                             )}
                           </div>
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


      {/* FAQ Section */}
      <section id="faq" className="min-h-screen scroll-mt-12 flex items-center justify-center bg-white overflow-hidden rounded-[48px] mx-4 sm:mx-8 shadow-xl mb-12">

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
              { q: "What services are available through Care24?", a: "Nursing Care, Elderly Attendant Services, Physiotherapy, Post-Hospital Care, and Long-Term Care." },
              { q: "Can I schedule long-term care services?", a: "Yes. Care24 supports hourly, daily, and long-term care arrangements based on your family's needs." },
              { q: "Can I change or cancel a booking?", a: "Yes. Users can manage bookings and request changes through their dashboard." },
              { q: "How can I track my service status?", a: "Once your booking is confirmed, you can log into your dashboard to track service progress, caregiver information, care updates, and booking history." },
              { q: "How are service charges calculated?", a: "Pricing depends on service type, duration, caregiver qualifications, and care requirements." },
              { q: "Do you provide services in my area?", a: "Service availability depends on caregiver coverage in your region. Please contact our team or submit a booking request to check availability." },
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
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
               <div className="lg:col-span-5 max-w-md text-left">
                  <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">Still Need Help?</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Send your question to our Care Support Team and we will assist you with bookings, caregiver selection, service availability, and care planning.</p>
               </div>
               <div className="lg:col-span-7 w-full">
                  {user ? (
                    <form onSubmit={handleInlineInquirySubmit} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
                        <textarea
                          placeholder="Type your question here..."
                          value={inlineQuestion}
                          onChange={(e) => setInlineQuestion(e.target.value)}
                          className="flex-grow p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 transition-all text-sm font-medium resize-none min-h-[56px] h-14 outline-none focus:ring-2 focus:ring-primary/20 w-full"
                          required
                        />
                        <Button 
                          type="submit"
                          disabled={isSubmittingInquiry}
                          className="h-14 rounded-2xl px-8 bg-primary hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-95 transition-all shrink-0 w-full sm:w-auto"
                        >
                          {isSubmittingInquiry ? 'Sending...' : 'Send Inquiry'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 text-center gap-6 w-full">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary shrink-0">
                          <Lock size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Authentication Required</h4>
                          <p className="text-[11px] text-slate-400 mt-2 max-w-[280px]">Sign in or sign up to submit inquiries to our Care Support Team.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full max-w-[280px] justify-center">
                        <Button className="flex-1 h-12 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs uppercase tracking-widest" render={<Link to="/login" />} nativeButton={false}>
                          Login
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest" render={<Link to="/signup" />} nativeButton={false}>
                          Sign Up
                        </Button>
                      </div>
                    </div>
                  )}
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
                    const email = eInput ? normalizeEmail(eInput.value) : undefined;

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
