import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  MessageSquare, 
  MapPin, 
  User, 
  Settings, 
  Bell, 
  ArrowUpRight,
  Zap,
  MoreVertical,
  Search,
  Plus,
  AlertCircle,
  FileText,
  CreditCard,
  History,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { time: '08:00', heartRate: 72, oxygen: 98, bp: 120 },
  { time: '10:00', heartRate: 75, oxygen: 97, bp: 122 },
  { time: '12:00', heartRate: 68, oxygen: 98, bp: 118 },
  { time: '14:00', heartRate: 70, oxygen: 99, bp: 120 },
  { time: '16:00', heartRate: 74, oxygen: 98, bp: 121 },
  { time: '18:00', heartRate: 71, oxygen: 97, bp: 119 },
];

export function UserDashboard() {
  return (
    <div className="pt-24 pb-20 bg-[#F9FAFB] min-h-screen">
      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.03),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.02),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header - Elite Polish */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-8 pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl">
                  <Heart size={28} className="fill-primary text-primary" />
               </div>
               <div>
                  <div className="flex items-center gap-3">
                     <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Command Center</h1>
                     <Badge className="bg-primary/10 text-primary border-none font-black uppercase text-[8px] tracking-widest px-2 py-0.5 rounded-full">ACTIVE SESSION</Badge>
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px] mt-2 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Clinical Protocol: ISO-9001.24 • Last Sync: 2m ago
                  </p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pb-1">
             <div className="relative hidden xl:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input placeholder="Search medical records..." className="h-14 pl-12 pr-6 w-72 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm" />
             </div>
             <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm relative hover:bg-slate-50">
                <Bell size={20} className="text-slate-600" />
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
             </Button>
             <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50">
                <Settings size={20} className="text-slate-600" />
             </Button>
             <Button className="h-14 px-8 rounded-2xl bg-slate-950 text-white font-bold text-sm shadow-xl active:scale-95 transition-all">
                <Plus size={18} className="mr-2" /> NEW BOOKING
             </Button>
          </div>
        </div>

        {/* Patient Clinical Profile Card */}
        <div className="grid grid-cols-1 mb-10">
           <Card className="rounded-[40px] border-none shadow-xl bg-white p-2">
              <CardContent className="p-8 lg:p-12">
                 <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="relative shrink-0">
                       <div className="w-32 h-32 rounded-[48px] bg-slate-50 border-4 border-white shadow-2xl overflow-hidden">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" alt="Patient" />
                       </div>
                       <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2.5 rounded-2xl border-4 border-white shadow-lg text-white">
                          <ShieldCheck size={20} />
                       </div>
                    </div>
                    <div className="flex-grow text-center lg:text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Subject Individual</p>
                       <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mb-4">Robert Williams</h2>
                       <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                          <Badge variant="outline" className="rounded-xl border-slate-100 bg-slate-50 text-slate-500 font-bold px-4 py-1.5">MALE, 74 YRS</Badge>
                          <Badge variant="outline" className="rounded-xl border-slate-100 bg-slate-50 text-slate-500 font-bold px-4 py-1.5">BG: O+ POSITIVE</Badge>
                          <Badge variant="outline" className="rounded-xl border-rose-100 bg-rose-50 text-rose-500 font-bold px-4 py-1.5">HYPERTENSION</Badge>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-12 w-full lg:w-auto">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Allergies</p>
                          <p className="font-bold text-slate-900">Penicillin, Latex</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pulse Target</p>
                          <p className="font-bold text-slate-900">65 - 85 BPM</p>
                       </div>
                       <div className="col-span-2 lg:col-span-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Guardian</p>
                          <p className="font-bold text-slate-900">Sarah Williams</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Live Assignment Banner - Redefined Polish */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="group relative overflow-hidden p-1 rounded-[32px] bg-slate-950 shadow-3xl"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
               <div className="relative bg-transparent p-8 flex flex-col md:flex-row items-center justify-between text-white gap-8 font-sans">
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl transition-transform group-hover:scale-105 overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200" alt="Emily Ross" referrerPolicy="no-referrer" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-slate-950 flex items-center justify-center text-[7px] font-black">ON</div>
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-xl font-bold tracking-tight leading-none text-white">Nurse Emily Ross</h3>
                           <Badge className="bg-emerald-500 text-white border-none text-[7px] font-black tracking-[0.2em] px-2 py-0.5">ELITE RN</Badge>
                        </div>
                        <p className="text-slate-400 font-medium text-xs leading-relaxed">6h 12m On-site • Station: Home Recovery Unit 1</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Button variant="ghost" className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-black text-[10px] tracking-widest">
                        CHAT
                     </Button>
                     <Button className="h-12 px-6 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-black text-[10px] tracking-widest shadow-xl">
                        LOGS
                     </Button>
                  </div>
               </div>
            </motion.div>

            {/* Vitals Telemetry - High-fidelity visualization */}
            <Card className="enterprise-card border-none shadow-2xl shadow-slate-200/40 rounded-[40px] overflow-hidden p-2">
               <CardHeader className="p-10 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Telemetry</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                       <Zap size={12} className="text-primary" /> Live hospital-grade data streaming
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg px-4 h-9 font-bold text-[10px] items-center flex gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        DATA SYNCED
                     </Badge>
                     <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-slate-50 border border-slate-100"><Settings size={20} className="text-slate-400" /></Button>
                  </div>
               </CardHeader>
               <CardContent className="p-10">
                  <div className="h-[340px] w-full mb-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.08}/>
                            <stop offset="95%" stopColor="#0F52BA" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} dx={-10} />
                        <Tooltip 
                          contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', fontWeight: 'black', padding: '15px'}}
                          cursor={{ stroke: '#0F52BA', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="heartRate" stroke="#0F52BA" strokeWidth={4} fillOpacity={1} fill="url(#primaryGradient)" />
                        <Area type="monotone" dataKey="oxygen" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                     {[
                       { label: 'Pulse Rate', val: '72', unit: 'BPM', status: 'Optimal', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                       { label: 'Oxygen Sat.', val: '98', unit: '%', status: 'Good', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                       { label: 'Blood Pressure', val: '120/80', unit: 'mm', status: 'Stable', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                       { label: 'Temperature', val: '98.6', unit: '°F', status: 'Med', icon: Heart, color: 'text-amber-500', bg: 'bg-amber-50' },
                     ].map((stat, i) => (
                       <div key={i} className="p-6 rounded-[28px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all group">
                          <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                             <stat.icon size={20} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{stat.label}</p>
                          <div className="flex items-baseline gap-1.5">
                             <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{stat.val}</h4>
                             <span className="text-[10px] font-bold text-slate-400 leading-none">{stat.unit}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Care Log - Timelined */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary"><History size={20} /></div>
                    Clinical Care Journal
                  </h3>
                  <Button variant="ghost" className="text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-white">VIEW ARCHIVE <ChevronRight size={14} className="ml-2" /></Button>
               </div>
               <div className="space-y-2">
                  {[
                    { time: '09:00 AM', event: 'Day Shift Initiation', author: 'Emily Ross', icon: Play, status: 'verified', detail: 'ID: #SHIFT-2940' },
                    { time: '10:15 AM', event: 'Medication Delivery (Lipitor 40mg)', author: 'Emily Ross', icon: Zap, status: 'verified', detail: 'Dosage: 1 Tab Oral' },
                    { time: '11:30 AM', event: 'Passive Physio Session', author: 'Emily Ross', icon: Activity, detail: '20 mins | Heart rate stable @ 72BPM' },
                    { time: '01:00 PM', event: 'Oral Hydration Check', author: 'Emily Ross', icon: Heart, detail: '250ml intake logged | Handover complete' }
                  ].map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-100 transition-colors"
                    >
                       <div className="min-w-[70px] border-r border-slate-100 pr-6">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">{log.time.split(' ')[1]}</p>
                          <p className="text-lg font-black text-slate-950 text-center leading-none tracking-tighter">{log.time.split(' ')[0]}</p>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-primary/5 transition-colors">
                          <log.icon size={18} className="group-hover:text-primary transition-colors" />
                       </div>
                       <div className="flex-grow">
                          <h5 className="font-bold text-slate-900 tracking-tight text-sm">{log.event}</h5>
                          <p className="text-[10px] font-medium text-slate-500 mt-1">Ref: {log.author} {log.detail && `• ${log.detail}`}</p>
                       </div>
                       {log.status === 'verified' && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                             <span className="text-[8px] font-black text-emerald-600 uppercase">LOGGED</span>
                          </div>
                       )}
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-10">
             
             {/* Medication Command Center */}
             <Card className="enterprise-card border-none shadow-2xl shadow-blue-900/10 rounded-[40px] bg-slate-950 text-white p-2">
                <CardHeader className="p-8 pb-4">
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-xl font-bold tracking-tight">Rx Protocol</CardTitle>
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10">
                        <Zap size={20} />
                     </div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Dosing compliance: 100%</p>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                   <div className="space-y-8 mt-6">
                      {[
                        { name: 'Metformin HCI', dose: '500mg (Oral)', time: '02:00 PM', status: 'pending', priority: 'high' },
                        { name: 'Multivitamin S', dose: '1 Capsule', time: '06:00 PM', status: 'scheduled', priority: 'low' },
                      ].map((med, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-5">
                              <div className={`w-3 h-3 rounded-full ${med.priority === 'high' ? 'bg-primary animate-pulse' : 'bg-slate-700'}`}></div>
                              <div>
                                 <h5 className="font-bold text-base tracking-tight leading-none">{med.name}</h5>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">{med.dose}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-primary">{med.time}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">Scheduled</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   <Button className="w-full mt-12 h-16 rounded-[24px] bg-primary hover:bg-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                      VIEW MED-MAP
                   </Button>
                </CardContent>
             </Card>

             {/* Critical Emergency Trigger */}
             <div className="p-10 rounded-[40px] bg-red-50 border-2 border-red-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-16 h-16 bg-white border border-red-100 text-red-500 rounded-3xl flex items-center justify-center shadow-xl animate-pulse ring-8 ring-red-100 group-hover:scale-110 transition-transform">
                      <AlertCircle size={32} />
                   </div>
                   <div>
                      <h5 className="font-bold text-xl text-slate-900 tracking-tight">SOS Override</h5>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">Direct Command Link</p>
                   </div>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-10">Instantly trigger medical emergency escalation to our 24/7 clinical command center for ambulance or doctor dispatch.</p>
                <Button className="w-full h-16 rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-500/30 active:scale-95 transition-all">
                   NOTIFY DOCTOR NOW
                </Button>
             </div>

             {/* Notifications Feed */}
             <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">System Alerts</h3>
                   <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">3 NEW</Badge>
                </div>
                <div className="space-y-6">
                   {[
                     { t: 'Vital Sync Successful', d: 'Telemetry lock established at 08:00 AM.', time: '2h ago', level: 'info' },
                     { t: 'Shift Extension Request', d: 'Emily Ross requested +2h handover.', time: '4h ago', level: 'warning' },
                     { t: 'Payment Protocol', d: 'Renewal invoice generated for May.', time: '1d ago', level: 'info' }
                   ].map((notif, i) => (
                     <div key={i} className="flex gap-4 group">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.level === 'warning' ? 'bg-amber-500' : 'bg-primary'}`}></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">{notif.t}</p>
                           <p className="text-[11px] font-medium text-slate-500 mt-1">{notif.d}</p>
                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">{notif.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <Button variant="ghost" className="w-full mt-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                  CLEAR ALL ALERTS
                </Button>
             </div>

             {/* Active Package Widget */}
             <div className="p-1 rounded-[40px] bg-slate-50 border border-slate-100">
                <div className="bg-white p-10 rounded-[38px] shadow-sm">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                         <CreditCard size={24} />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Plan</p>
                         <h5 className="font-bold text-lg text-slate-900 tracking-tight">Post-Op Critical Care</h5>
                      </div>
                   </div>
                   
                   <div className="space-y-4 mb-10">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                         <span>Cycle Progress</span>
                         <span className="text-slate-900">18/30 Days</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "60%" }}
                           transition={{ duration: 1.5, ease: "circOut" }}
                           className="h-full bg-slate-900 rounded-full"
                         ></motion.div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <Button variant="ghost" className="rounded-2xl h-14 border border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">INVOICE</Button>
                      <Button className="rounded-2xl h-14 bg-slate-950 text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]">RENEW</Button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
