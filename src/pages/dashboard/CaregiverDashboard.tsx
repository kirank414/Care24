import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Briefcase, 
  Star,
  History,
  Bell,
  Activity,
  ClipboardList,
  Headphones,
  User,
  Check,
  CheckCircle,
  Plus,
  Play,
  Loader2,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCareStore } from '../../stores/careStore';
import { useAuthStore } from '../../store';
import NotificationCenter from '../../components/NotificationCenter';
import { CareNoteModal } from '../../components/CareNoteModal';

export function CaregiverDashboard() {
  const { user } = useAuthStore();
  const { 
    caregiver, 
    bookings, 
    careNotes,
    loading, 
    error, 
    unreadNotificationCount,
    fetchCaregiverMe, 
    fetchBookings, 
    updateBookingStatus, 
    toggleAvailability, 
    addCareNote,
    fetchCaregiverNotes,
    fetchUnreadNotificationCount,
    revenueData,
    fetchRevenueData,
    submitInquiry
  } = useCareStore();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'week' | 'month' | 'all'>('all');


  useEffect(() => {
    fetchCaregiverMe();
    fetchBookings();
    fetchCaregiverNotes();
    fetchRevenueData();
    fetchUnreadNotificationCount();
  }, []);

  const handleToggleAvailability = async () => {
    const current = caregiver?.availability !== undefined ? caregiver.availability : true;
    await toggleAvailability(!current);
  };

  const cgName = caregiver?.name || user?.name || 'Caregiver';
  const cgTitle = caregiver?.title || 'PROVIDER';
  const cgRating = caregiver?.rating || 5.0;
  const isAvail = caregiver?.availability !== undefined ? caregiver.availability : true;

  const weeklyRevenue = revenueData?.chartData?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
  const totalVisits = bookings.length;
  const completedVisits = bookings.filter((b: any) => b.status === 'completed').length;
  const activeAssignments = bookings.filter((b: any) => ['pending','confirmed','active'].includes(b.status)).length;
  const pendingRequests = bookings.filter((b: any) => b.status === 'pending').length;
  const totalNotes = careNotes?.length || 0;

  const getFilteredHistory = () => {
    const completed = bookings.filter((b: any) => b.status === 'completed');
    if (historyFilter === 'all') return completed;
    const now = new Date();
    return completed.filter((b: any) => {
      if (!b.startDate) return false;
      const d = new Date(b.startDate);
      if (historyFilter === 'week') {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (historyFilter === 'month') {
        const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
        return d >= monthAgo;
      }
      return true;
    });
  };

  const getDuration = (b: any): string => {
    if (b.durationType === 'long-term') return 'Long-Term';
    if (b.durationType === 'daily' && b.startDate && b.endDate) {
      const days = Math.max(1, Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 86400000) + 1);
      return `${days} Day${days > 1 ? 's' : ''}`;
    }
    if (b.startTime && b.endTime) return `${b.startTime} – ${b.endTime}`;
    return b.durationType === 'hourly' ? 'Hourly' : '—';
  };

  return (
    <div className="pt-24 pb-24 bg-[#F9FAFB] min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.02),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pt-10">
          <div className="flex items-center space-x-8">
            <div className="relative group">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] bg-white shadow-2xl p-2 border border-slate-100 shrink-0 overflow-hidden">
                    {caregiver?.imageUrl ? (
                      <img src={caregiver.imageUrl} alt="Caregiver" className="w-full h-full object-cover rounded-[24px] sm:rounded-[32px]" />
                    ) : (
                      <div className="w-full h-full bg-[#dfe5e7] flex items-center justify-center overflow-hidden rounded-[24px] sm:rounded-[32px]">
                        <User className="w-full h-full text-white fill-white translate-y-1/4 scale-125" />
                      </div>
                    )}
                 </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-xl ring-4 ring-emerald-500/10">
                 <CheckCircle2 size={18} />
               </div>
            </div>
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-none">{cgName}</h1>
                <Badge className="bg-slate-900 text-white border-none font-bold uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg">{cgTitle}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-400">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                   if (caregiver?.isVerified === false) return;
                   handleToggleAvailability();
                }}>
                   <div className={`w-2 h-2 rounded-full ${!caregiver?.isVerified ? 'bg-slate-300' : isAvail ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                     {!caregiver?.isVerified ? 'Pending Admin Approval' : isAvail ? 'Live & Available (Click to toggle)' : 'On Leave / Busy (Click to toggle)'} 
                   </span>
                </div>
                <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:inline"></span>
                <span className="text-xs font-bold uppercase tracking-widest flex items-center text-slate-500"><Star size={14} className="text-yellow-400 fill-yellow-400 mr-1.5" /> {cgRating} Rating</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:inline"></span>
                <span className="text-xs font-bold uppercase tracking-widest flex items-center text-slate-500">
                  <MapPin size={14} className="text-slate-400 mr-1.5" />
                  Serves: {caregiver?.cities?.join(', ') || 'New York'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pb-2">
             <div className="text-right hidden md:block px-8 py-2 border-r border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-900 leading-none">${revenueData?.totalEarnings?.toLocaleString() || '0'}</p>
             </div>
             <div className="relative">
               <Button
                 variant="ghost"
                 size="icon"
                 id="notification-bell-caregiver"
                 className="h-14 w-14 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:bg-slate-50"
                 onClick={() => setNotifOpen(!notifOpen)}
               >
                 <Bell size={20} className="text-slate-600 transition-transform group-hover:rotate-12" />
                 {unreadNotificationCount > 0 && (
                   <div className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                     <span className="text-[9px] font-black text-white">{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</span>
                   </div>
                 )}
               </Button>
               <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
             </div>
             <Button className="h-14 rounded-2xl bg-primary text-white font-bold px-8 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={() => setIsNoteModalOpen(true)}>
                <Plus size={20} className="mr-2" /> Log Care Note
             </Button>
          </div>
        </div>

        {caregiver?.isVerified === false && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <AlertCircle size={120} />
            </div>
            <div className="flex items-start gap-4 relative z-10">
               <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                 <AlertCircle size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-1">Account Pending Approval</h3>
                  <p className="text-amber-700/80 font-medium text-sm leading-relaxed max-w-3xl">
                    Your caregiver profile has been created and is currently under review by our administration team. 
                    <strong> You will not appear on the public network and cannot receive bookings until approved.</strong> We will notify you once verified.
                  </p>
               </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Weekly Earnings', val: `$${weeklyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pct: 'This Week', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Service Requests', val: pendingRequests.toString(), pct: 'Awaiting Response', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Completed Visits', val: completedVisits.toString(), pct: 'Finished', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Care Notes Logged', val: totalNotes.toString(), pct: 'Submitted', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((stat, i) => (
             <Card key={i} className="enterprise-card border-none shadow-xl shadow-slate-200/50 rounded-[32px] p-2 hover:translate-y-[-4px] transition-all">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-10">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                         <stat.icon size={28} />
                      </div>
                      <Badge variant="outline" className="bg-white border-slate-100 text-[10px] font-bold text-slate-400 px-3 py-1">{stat.pct}</Badge>
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-1 leading-none">{stat.val}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </CardContent>
             </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="requests" className="space-y-8">
              <TabsList className="bg-white p-1.5 rounded-2xl h-14 w-full justify-start border border-slate-100 shadow-sm flex-wrap gap-1">
                <TabsTrigger value="requests" className="rounded-xl px-5 sm:px-6 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-white flex items-center gap-2">
                  Service Requests
                  {pendingRequests > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 data-[state=active]:bg-white/30 text-white text-[9px] font-black flex items-center justify-center">
                      {pendingRequests}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="shifts" className="rounded-xl px-5 sm:px-6 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Active Assignments
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-xl px-5 sm:px-6 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Care Notes Log
                </TabsTrigger>
                <TabsTrigger value="earnings" className="rounded-xl px-5 sm:px-6 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Earnings & History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-6">
                <div className="flex items-center justify-between px-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Service Requests</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Incoming booking requests awaiting your response</p>
                  </div>
                  <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                    {pendingRequests} PENDING
                  </Badge>
                </div>

                {pendingRequests === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <Briefcase size={28} className="text-slate-200" />
                    </div>
                    <p className="font-bold text-slate-400 text-base">No Pending Requests</p>
                    <p className="text-xs text-slate-300 mt-1.5 max-w-xs">New service requests from patients will appear here. Make sure your availability is set to active.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings
                      .filter((b: any) => b.status === 'pending')
                      .map((req: any, i: number) => {
                        const reqDate = req.startDate ? new Date(req.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                        const reqTime = req.startTime || (req.durationType === 'daily' ? 'Full Day' : 'Flexible');
                        return (
                          <motion.div
                            key={req._id || i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="p-1 rounded-[32px] bg-amber-50/60 border border-amber-100 hover:border-amber-200 transition-all shadow-sm"
                          >
                            <div className="bg-white rounded-[28px] p-6 flex flex-col md:flex-row md:items-center gap-6">

                              <div className="w-full md:w-28 rounded-2xl bg-amber-500 text-white p-4 flex flex-col justify-center text-center shrink-0">
                                <p className="text-[8px] font-bold uppercase tracking-widest mb-1 text-amber-100">Status</p>
                                <p className="text-xs font-black uppercase">PENDING</p>
                                <p className="text-[9px] font-bold text-amber-200 uppercase mt-1">{req.durationType || 'hourly'}</p>
                              </div>

                              <div className="flex-grow space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">{req.patient?.name || 'Patient'}</h4>
                                  <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase px-2 py-0.5">
                                    {req.service?.title || 'Care Service'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <Calendar size={14} className="text-slate-300 shrink-0" />
                                    <span>{reqDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <Clock size={14} className="text-slate-300 shrink-0" />
                                    <span>{reqTime}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <MapPin size={14} className="text-slate-300 shrink-0" />
                                    <span className="truncate">{req.patient?.address || 'Location not specified'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 md:border-l border-slate-100 md:pl-6">
                                <Button
                                  className="h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                                  onClick={() => updateBookingStatus(req._id, 'confirmed')}
                                >
                                  <CheckCircle size={15} /> Accept
                                </Button>
                                <Button
                                  className="h-12 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
                                  onClick={() => updateBookingStatus(req._id, 'cancelled')}
                                >
                                  <XCircle size={15} /> Reject
                                </Button>
                              </div>

                            </div>
                          </motion.div>
                        );
                      })
                    }
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shifts" className="space-y-6">
                 <div className="flex items-center justify-between px-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Active Assignments</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accepted and in-progress care bookings</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                       <Calendar size={14} /> <span>Live Feed</span>
                    </div>
                 </div>
                 
                 {bookings.filter((b: any) => ['confirmed','active'].includes(b.status)).length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                     <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                       <Briefcase size={28} className="text-slate-200" />
                     </div>
                     <p className="font-bold text-slate-400 text-base">No Active Assignments</p>
                     <p className="text-xs text-slate-300 mt-1.5 max-w-xs">Accept a service request to begin an assignment. Accepted bookings will appear here.</p>
                   </div>
                 ) : bookings.filter((b: any) => ['confirmed','active'].includes(b.status)).map((shift: any, i: number) => (
                   <motion.div 
                     key={shift._id || i}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className={`p-1 rounded-[32px] border-2 transition-all ${shift.status === 'active' ? 'bg-white border-blue-100 shadow-2xl shadow-blue-500/5' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                   >
                     <div className="bg-white rounded-[30px] p-8 flex flex-col md:flex-row items-stretch gap-10">
                        <div className="md:w-32 rounded-3xl bg-slate-950 text-white p-6 flex flex-col justify-center text-center shrink-0">
                           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                           <p className="text-base font-black uppercase text-primary">{shift.status}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">${shift.totalAmount}</p>
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-center">
                           <div className="flex items-center gap-4 mb-3">
                              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{shift.patient?.name || 'Patient'}</h4>
                              <span className="text-xs font-bold text-slate-300">•</span>
                              <span className="text-sm font-bold text-primary uppercase tracking-widest">{shift.service?.title || 'Care Service'}</span>
                           </div>
                           <div className="flex flex-wrap items-center gap-8 text-slate-500 font-medium">
                              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-300" /> <span className="text-sm">{shift.patient?.address || 'Location N/A'}</span></div>
                              <div className="flex items-center gap-2"><Calendar size={16} className="text-slate-300" /> <span className="text-sm">{shift.startDate ? new Date(shift.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</span></div>
                              <div className="flex items-center gap-2"><Clock size={16} className="text-slate-300" /> <span className="text-sm">{shift.startTime || shift.durationType || 'Flexible'}</span></div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 md:border-l border-slate-100 pl-0 md:pl-6 lg:pl-10 w-full md:w-auto">
                           {shift.status === 'confirmed' ? (
                             <div className="flex w-full">
                               <Button className="h-16 w-full md:w-auto px-6 lg:px-10 rounded-2xl bg-primary hover:bg-blue-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl" onClick={() => updateBookingStatus(shift._id, 'active')}>
                                  <Play size={18} className="mr-2 sm:mr-3 shrink-0" /> COMMENCE
                               </Button>
                             </div>
                           ) : shift.status === 'active' ? (
                             <div className="flex flex-col sm:flex-row flex-wrap w-full gap-3">
                                <Button className="h-16 w-full sm:w-auto flex-grow px-4 lg:px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-xl" onClick={() => { setSelectedBookingId(shift._id); setIsNoteModalOpen(true); }}>
                                   <Activity size={18} className="mr-2 shrink-0" /> <span className="truncate">LOG OBSERVATIONS</span>
                                </Button>
                               <Button className="h-16 w-full sm:w-auto flex-grow px-4 lg:px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-xl" onClick={() => updateBookingStatus(shift._id, 'completed')}>
                                  <CheckCircle size={18} className="mr-2 text-emerald-400 shrink-0" /> <span className="truncate">COMPLETE</span>
                               </Button>
                             </div>
                           ) : (
                             <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Actions</div>
                           )}
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                 <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Care Notes Log</h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                       <ClipboardList size={14} /> <span>care Journal</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                   {careNotes && careNotes.length > 0 ? (
                     careNotes.map((log: any, i: number) => {
                       const pName = log.booking?.patient?.name || 'Unknown Patient';
                       const timeStr = log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A';
                       const bpVal = log.bloodPressure || log.vitalSigns?.bloodPressure || 'N/A';
                       const hrVal = log.heartRate ?? log.vitalSigns?.heartRate ?? 'N/A';
                       const spo2Val = log.spo2 ?? log.vitalSigns?.oxygenSaturation ?? 'N/A';
                       const tempVal = log.temperature ?? log.vitalSigns?.temperature ?? 'N/A';

                       return (
                         <motion.div 
                           key={log._id || i}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                         >
                           <div className="flex-grow space-y-2">
                             <div className="flex items-center gap-3">
                               <Badge className={`border-none font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                                 log.isAlert ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                               }`}>
                                 {pName}
                               </Badge>
                               {log.isAlert && <Badge className="bg-red-500 text-white border-none text-[9px] font-bold uppercase">⚠ ALERT</Badge>}
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{timeStr}</span>
                             </div>
                             <p className="text-slate-800 font-bold text-sm leading-relaxed">{log.note}</p>
                             {log.isAlert && log.alertReason && (
                               <p className="text-xs text-red-600 font-semibold">Alert: {log.alertReason}</p>
                             )}
                           </div>
                           
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                             <div className="text-center md:text-left">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">BP</p>
                               <p className="font-bold text-slate-900 text-xs">{bpVal}</p>
                             </div>
                             <div className="text-center md:text-left">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pulse</p>
                               <p className="font-bold text-slate-900 text-xs">{hrVal} BPM</p>
                             </div>
                             <div className="text-center md:text-left">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">SpO2</p>
                               <p className="font-bold text-slate-900 text-xs">{spo2Val}%</p>
                             </div>
                             <div className="text-center md:text-left">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Temp</p>
                               <p className="font-bold text-slate-900 text-xs">{tempVal}°F</p>
                             </div>
                           </div>
                         </motion.div>
                       );
                     })
                   ) : (
                     <div className="flex flex-col items-center justify-center py-16 text-center">
                       <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                         <FileText size={28} className="text-slate-200" />
                       </div>
                       <p className="font-bold text-slate-400 text-base">No Care Notes Yet</p>
                       <p className="text-xs text-slate-300 mt-1.5 max-w-xs">Log your first care note by clicking "LOG care NOTE" above.</p>
                     </div>
                   )}
                 </div>
              </TabsContent>

              <TabsContent value="earnings">
                 <div className="space-y-8">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Earnings</p>
                       <p className="text-3xl font-bold text-slate-900">${revenueData?.totalEarnings?.toLocaleString() || '0'}</p>
                       <p className="text-xs text-slate-400 font-medium mt-1">All completed visits</p>
                     </div>
                     <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Weekly Earnings</p>
                       <p className="text-3xl font-bold text-emerald-600">${weeklyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                       <p className="text-xs text-slate-400 font-medium mt-1">This week</p>
                     </div>
                     <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Assignments</p>
                       <p className="text-3xl font-bold text-blue-600">{activeAssignments}</p>
                       <p className="text-xs text-slate-400 font-medium mt-1">Pending, confirmed or active</p>
                     </div>
                   </div>

                    <Card className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white">
                      <CardHeader className="p-8 pb-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900">Work History</CardTitle>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completed care services record</p>
                          </div>
                          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
                            {(['week', 'month', 'all'] as const).map((f) => (
                              <button
                                key={f}
                                onClick={() => setHistoryFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                  historyFilter === f
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                            {getFilteredHistory().length} SERVICE{getFilteredHistory().length !== 1 ? 'S' : ''}
                          </Badge>
                          {historyFilter !== 'all' && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {historyFilter === 'week' ? 'Last 7 days' : 'Last 30 days'}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0">
                        {getFilteredHistory().length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-14 text-center">
                            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                              <History size={24} className="text-slate-200" />
                            </div>
                            <p className="font-bold text-slate-400">
                              {historyFilter === 'week' ? 'No completed visits this week' : historyFilter === 'month' ? 'No completed visits this month' : 'No Completed Visits Yet'}
                            </p>
                            <p className="text-xs text-slate-300 mt-1 max-w-xs">
                              {historyFilter !== 'all' ? 'Try switching to a wider time range.' : 'Completed bookings will appear here once a service is marked complete.'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-4 pb-2 border-b border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Type</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                            </div>

                            {getFilteredHistory().map((b: any, i: number) => {
                              const dateStr = b.startDate
                                ? new Date(b.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                                : 'N/A';
                              const duration = getDuration(b);
                              return (
                                <motion.div
                                  key={b._id || i}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 md:gap-4 items-center p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-white transition-all group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                                      <CheckCircle2 size={16} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{b.service?.title || 'Care Service'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:hidden">Patient</p>
                                    <p className="text-sm font-semibold text-slate-700">{b.patient?.name || 'Patient'}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar size={13} className="text-slate-300 shrink-0" />
                                    <p className="text-xs font-semibold text-slate-600">{dateStr}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={13} className="text-slate-300 shrink-0" />
                                    <p className="text-xs font-semibold text-slate-600 whitespace-nowrap">{duration}</p>
                                  </div>
                                  <div>
                                    <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase px-2.5 py-1 whitespace-nowrap">
                                      ✓ Completed
                                    </Badge>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                 </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <Card className="enterprise-card border-none shadow-xl rounded-[40px] bg-white overflow-hidden p-2">
                <CardHeader className="p-8 pb-4">
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-lg font-bold text-slate-900">Current Session Tasks</CardTitle>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Visit</p>
                   </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                   <div className="space-y-6">
                       {[
                         { t: 'Visit Check-In', d: 'Confirm arrival and begin session log', s: 'completed' },
                         { t: 'Daily Care Notes', d: 'Record patient observations and vitals', s: 'pending' },
                         { t: 'Mobility Assistance Session', d: '20 mins supported movement drill', s: 'pending' },
                         { t: 'Wellness Observation', d: 'Monitor comfort and general well-being', s: 'pending' },
                       ].map((task, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${task.s === 'completed' ? 'bg-primary border-primary text-white' : 'border-slate-200'}`}>
                              {task.s === 'completed' && <Check size={12} strokeWidth={4} />}
                           </div>
                           <div>
                              <h5 className={`font-bold text-sm ${task.s === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.t}</h5>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{task.d}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </CardContent>
             </Card>

             {/* Care Support Assistance */}
             <div className="p-8 rounded-[40px] bg-blue-50/60 border border-blue-100 shadow-sm">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">Care Support Assistance</p>
                <div className="flex justify-center mb-8">
                   <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-600 border border-blue-100 shadow-lg">
                      <Headphones size={36} />
                   </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2 text-center">Contact Coordinator</h4>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed text-center px-2">Contact the care coordination team regarding scheduling issues, booking concerns, caregiver availability updates, or service-related questions.</p>
                <Button 
                   onClick={async () => {
                     try {
                       await submitInquiry({
                         question: `Support call requested by caregiver: ${caregiver?.name || "Unknown Caregiver"}`,
                         email: user?.email || "N/A"
                       });
                       const toast = (await import('react-hot-toast')).default;
                       toast.success('Request sent. A care coordinator will be in touch shortly.');
                     } catch (err: any) {
                       const toast = (await import('react-hot-toast')).default;
                       toast.error('Failed to submit support request: ' + (err.response?.data?.message || err.message));
                     }
                   }}
                   className="w-full h-16 rounded-[24px] bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                 >
                    CONTACT COORDINATOR
                 </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Log care Note Modal */}
      <CareNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        bookings={bookings}
        selectedBookingId={selectedBookingId}
        setSelectedBookingId={setSelectedBookingId}
        onSuccess={async () => {
          try {
            await fetchCaregiverNotes();
          } catch (err) {
            console.error("Error refreshing caregiver notes:", err);
          }
        }}
      />


    </div>
  );
}
