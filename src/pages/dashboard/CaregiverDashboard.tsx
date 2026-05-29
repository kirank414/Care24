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
  Users,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  History,
  Settings,
  Bell,
  Heart,
  Activity,
  ArrowUpRight,
  ClipboardList,
  ShieldAlert,
  Zap,
  MoreVertical,
  LogOut,
  User,
  Check,
  CheckCircle,
  Plus,
  Play,
  Loader2,
  X,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCareStore } from '../../stores/careStore';
import { useAuthStore } from '../../store';
import NotificationCenter from '../../components/NotificationCenter';
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
    fetchRevenueData
  } = useCareStore();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState(72);
  const [ox, setOx] = useState(98);
  const [temp, setTemp] = useState(98.6);
  const [noteSuccess, setNoteSuccess] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);


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

  const handleAddCareNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !noteContent) return;

    const payload = {
      booking: selectedBookingId,
      caregiver: caregiver?._id,
      note: noteContent,
      bloodPressure: bp,
      heartRate: hr,
      spo2: ox,
      temperature: temp,
    };

    console.log("Outgoing Care Note payload:", JSON.stringify(payload, null, 2));

    await addCareNote(payload);

    setNoteSuccess(true);
    try {
      await fetchCaregiverNotes();
    } catch (err) {
      console.error("Error refreshing caregiver notes:", err);
    }

    setTimeout(() => {
      setNoteSuccess(false);
      setIsNoteModalOpen(false);
      setNoteContent('');
    }, 2000);
  };

  const cgName = caregiver?.name || user?.name || 'Caregiver';
  const cgTitle = caregiver?.title || 'PROVIDER';
  const cgRating = caregiver?.rating || 5.0;
  const isAvail = caregiver?.availability !== undefined ? caregiver.availability : true;

  const weeklyRevenue = revenueData?.chartData?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
  const totalVisits = bookings.length;
  const cancelledCount = bookings.filter((b: any) => b.status === 'cancelled').length;
  const successRate = bookings.length > 0 ? `${(((bookings.length - cancelledCount) / bookings.length) * 100).toFixed(1)}%` : '100%';
  const totalNotes = careNotes?.length || 0;

  // Real-time calculations:
  // Tax estimated at 15% of Month-to-Date pay
  const taxEst = (revenueData?.mtdPay || 0) * 0.15;
  // Bonus: $50 for each completed care session
  const completedShifts = bookings.filter((b: any) => b.status === 'completed').length;
  const bonus = completedShifts * 50;

  return (
    <div className="pt-24 pb-24 bg-[#F9FAFB] min-h-screen">
      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.02),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Enterprise Polish */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pt-10">
          <div className="flex items-center space-x-8">
            <div className="relative group">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] bg-white shadow-2xl p-2 border border-slate-100 shrink-0 overflow-hidden">
                    {caregiver?.imageUrl ? (
                      <img src={caregiver.imageUrl} alt="Caregiver" className="w-full h-full object-cover rounded-[24px] sm:rounded-[32px]" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 rounded-[24px] sm:rounded-[32px] flex items-center justify-center text-slate-400">
                        <User size={48} />
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
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleToggleAvailability}>
                   <div className={`w-2 h-2 rounded-full ${isAvail ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                     {isAvail ? 'Live & Available' : 'On Leave / Busy'} (Click to toggle)
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
             <Button className="h-14 rounded-2xl bg-primary text-white font-bold px-8 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={() => { setSelectedBookingId(bookings[0]?._id); setIsNoteModalOpen(true); }}>
                <Plus size={20} className="mr-2" /> LOG care NOTE
             </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-3">
            <ShieldAlert size={20} /> {error}
          </div>
        )}

        {/* Top-line Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Weekly Revenue', val: `$${weeklyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pct: 'This Week', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Total Visits', val: totalVisits.toString(), pct: 'Assigned', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Success Rate', val: successRate, pct: 'System Active', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Care Notes Logged', val: totalNotes.toString(), pct: 'care Notes', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
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
          {/* Main Dashboard Section */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="shifts" className="space-y-8">
              <TabsList className="bg-white p-1.5 rounded-2xl h-14 w-full justify-start max-w-xl border border-slate-100 shadow-sm">
                <TabsTrigger value="shifts" className="rounded-xl px-6 sm:px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Active Shifts ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-xl px-6 sm:px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Care Notes Log
                </TabsTrigger>
                <TabsTrigger value="earnings" className="rounded-xl px-6 sm:px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Revenue Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shifts" className="space-y-6">
                 <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Assigned Booking Requests</h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                       <Calendar size={14} /> <span>Live Feed</span>
                    </div>
                 </div>
                 
                 {bookings.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-16 text-center">
                     <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                       <Briefcase size={28} className="text-slate-200" />
                     </div>
                     <p className="font-bold text-slate-400 text-base">No Bookings Yet</p>
                     <p className="text-xs text-slate-300 mt-1.5 max-w-xs">Booking requests from patients will appear here when your availability is active.</p>
                   </div>
                 ) : bookings.map((shift: any, i: number) => (
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
                              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{shift.patient?.name || 'Robert Williams'}</h4>
                              <span className="text-xs font-bold text-slate-300">•</span>
                              <span className="text-sm font-bold text-primary uppercase tracking-widest">{shift.service?.title || 'Nursing Care'}</span>
                           </div>
                           <div className="flex flex-wrap items-center gap-8 text-slate-500 font-medium">
                              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-300" /> <span className="text-sm">{shift.patient?.address || '123 Carewood Ave'}</span></div>
                              <div className="flex items-center gap-2"><Clock size={16} className="text-slate-300" /> <span className="text-sm">5 Days Care</span></div>
                              <div className="flex items-center gap-2"><User size={16} className="text-slate-300" /> <span className="text-sm">Age: {shift.patient?.age || 74}</span></div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 md:border-l border-slate-100 pl-0 md:pl-10">
                           {shift.status === 'pending' ? (
                             <div className="flex items-center gap-2">
                               <Button className="h-14 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl" onClick={() => updateBookingStatus(shift._id, 'confirmed')}>
                                 ACCEPT
                               </Button>
                               <Button className="h-14 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl" onClick={() => updateBookingStatus(shift._id, 'cancelled')}>
                                 DECLINE
                               </Button>
                             </div>
                           ) : shift.status === 'confirmed' ? (
                             <div className="flex gap-2">
                               <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-xl" onClick={() => updateBookingStatus(shift._id, 'active')}>
                                  <Play size={18} className="mr-3" /> COMMENCE
                               </Button>
                             </div>
                           ) : shift.status === 'active' ? (
                             <div className="flex gap-2">
                               <Button className="h-16 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest shadow-xl" onClick={() => { setSelectedBookingId(shift._id); setIsNoteModalOpen(true); }}>
                                  <Activity size={18} className="mr-3" /> LOG VITALS
                               </Button>
                               <Button className="h-16 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest shadow-xl" onClick={() => updateBookingStatus(shift._id, 'completed')}>
                                  <CheckCircle size={18} className="mr-3 text-emerald-400" /> COMPLETE
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
                 <Card className="enterprise-card border-none shadow-xl rounded-[40px] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-0">
                       <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Revenue Trajectory</CardTitle>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Earnings based on verified care hours</p>
                    </CardHeader>
                    <CardContent className="p-10">
                       <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height={300}>
                             <AreaChart data={revenueData?.chartData || []}>
                                <defs>
                                   <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dx={-10} />
                                <Tooltip 
                                   contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', fontWeight: 'bold', padding: '15px'}}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEarning)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                       
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mtd Pay</p>
                             <p className="text-2xl font-bold text-slate-900">${revenueData?.mtdPay?.toLocaleString() || '0'}</p>
                          </div>
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tax Est.</p>
                             <p className="text-2xl font-bold text-slate-900">${taxEst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          </div>
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bonus</p>
                             <p className="text-2xl font-bold text-emerald-500">+${bonus.toLocaleString()}</p>
                          </div>
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                             <p className="text-2xl font-bold text-slate-900 flex items-center gap-2">Verified <CheckCircle2 size={18} className="text-blue-500" /></p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* care Guidelines / Task List */}
             <Card className="enterprise-card border-none shadow-xl rounded-[40px] bg-white overflow-hidden p-2">
                <CardHeader className="p-8 pb-4">
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-lg font-bold text-slate-900">Immediate Tasks</CardTitle>
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Shift AP-452</p>
                   </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                   <div className="space-y-6">
                      {[
                        { t: 'Log Morning Vitals', d: 'Due before 10:00 AM', s: 'pending' },
                        { t: 'Medication Admin (Metformin)', d: '11:00 AM Dosage', s: 'completed' },
                        { t: 'Physio Session', d: '20 mins movement drill', s: 'pending' },
                        { t: 'Hydration Check', d: 'Log hourly intake', s: 'pending' }
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
                   <Button 
                     onClick={() => import('react-hot-toast').then(m => m.default.success('Shift log submitted successfully.'))}
                     className="w-full mt-10 h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black transition-all"
                   >
                      SUBMIT SHIFT LOG
                   </Button>
                </CardContent>
             </Card>

             {/* Emergency SOS Override */}
             <div className="p-8 rounded-[40px] bg-red-50 border border-red-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-6">Security & Emergency</p>
                <div className="flex justify-center mb-8">
                   <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse border-8 border-red-50">
                      <ShieldAlert size={36} />
                   </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Escalation Trigger</h4>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed px-4">Instantly alert the support team for medical assistance or emergency services.</p>
                <Button 
                  onClick={() => import('react-hot-toast').then(m => m.default.success('SOS Alert Activated: Support team notified!'))}
                  className="w-full h-16 rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                >
                   NOTIFY SUPPORT SOS
                </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Log care Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && (
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
                onClick={() => setIsNoteModalOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Post-Visit Log</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Record care updates and visit notes for the current session.</p>
                </div>
              </div>

              {noteSuccess ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-100 animate-pulse">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 tracking-tight">Vitals Logged Successfully!</h4>
                  <p className="text-xs text-emerald-700 font-medium">Care updates synchronized with the family dashboard.</p>
                </div>
              ) : (
                <form onSubmit={handleAddCareNote} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Select Active Booking</label>
                    <select 
                      value={selectedBookingId} 
                      onChange={(e) => setSelectedBookingId(e.target.value)} 
                      required 
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    >
                      {bookings.map(b => (
                        <option key={b._id} value={b._id}>{b.patient?.name || 'Robert Williams'} - {b.service?.title || 'Nursing Care'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Blood Pressure</label>
                      <input 
                        type="text" 
                        value={bp} 
                        onChange={(e) => setBp(e.target.value)} 
                        required 
                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Heart Rate (BPM)</label>
                      <input 
                        type="number" 
                        value={hr} 
                        onChange={(e) => setHr(Number(e.target.value))} 
                        required 
                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Oxygen Saturation (%)</label>
                      <input 
                        type="number" 
                        value={ox} 
                        onChange={(e) => setOx(Number(e.target.value))} 
                        required 
                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Temperature (°F)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={temp} 
                        onChange={(e) => setTemp(Number(e.target.value))} 
                        required 
                        className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">care Note / Observations</label>
                    <textarea 
                      value={noteContent} 
                      onChange={(e) => setNoteContent(e.target.value)} 
                      required 
                      rows={3} 
                      placeholder="Patient resting comfortably. Hydration normal."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'SUBMIT CARE UPDATE'}
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
