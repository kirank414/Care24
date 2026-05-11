import React from 'react';
import { motion } from 'motion/react';
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
  Play,
  User,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const earningsData = [
  { day: 'Mon', amount: 320 },
  { day: 'Tue', amount: 450 },
  { day: 'Wed', amount: 280 },
  { day: 'Thu', amount: 590 },
  { day: 'Fri', amount: 410 },
  { day: 'Sat', amount: 620 },
  { day: 'Sun', amount: 510 },
];

export function CaregiverDashboard() {
  return (
    <div className="pt-24 pb-24 bg-[#F9FAFB] min-h-screen">
      {/* Background Polish */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.02),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Enterprise Polish */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pt-10">
          <div className="flex items-center space-x-8">
            <div className="relative group">
               <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105">
                  <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200" alt="Sarah Johnson" referrerPolicy="no-referrer" />
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-xl ring-4 ring-emerald-500/10">
                 <CheckCircle2 size={18} />
               </div>
            </div>
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-none">Nurse Sarah Johnson</h1>
                <Badge className="bg-slate-900 text-white border-none font-bold uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg">ELITE PROVIDER</Badge>
              </div>
              <div className="flex items-center space-x-6 text-slate-400">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live & Ready</span>
                </div>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-xs font-bold uppercase tracking-widest flex items-center text-slate-500"><Star size={14} className="text-yellow-400 fill-yellow-400 mr-1.5" /> 4.95 Rating</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pb-2">
             <div className="text-right hidden md:block px-8 py-2 border-r border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Earnings</p>
                <p className="text-2xl font-bold text-slate-900 leading-none">$420.00</p>
             </div>
             <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:bg-slate-50">
                <Bell size={20} className="text-slate-600 transition-transform group-hover:rotate-12" />
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
             </Button>
             <Button className="h-14 rounded-2xl bg-primary text-white font-bold px-8 shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                <Settings size={20} className="mr-2" /> PORTAL CONFIG
             </Button>
          </div>
        </div>

        {/* Top-line Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Weekly Revenue', val: '$3,840.00', pct: '+12.5%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Total Visits', val: '862', pct: 'Top 1%', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Success Rate', val: '99.8%', pct: 'Perfect', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Care Points', val: '4,280', pct: 'Elite', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
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
              <TabsList className="bg-white p-1.5 rounded-2xl h-14 w-full justify-start max-w-md border border-slate-100 shadow-sm">
                <TabsTrigger value="shifts" className="rounded-xl px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Active Shifts
                </TabsTrigger>
                <TabsTrigger value="earnings" className="rounded-xl px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Revenue Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shifts" className="space-y-6">
                 <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Today's Clinical Roster</h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                       <Calendar size={14} /> <span>Monday, May 11</span>
                    </div>
                 </div>
                 
                 {[
                   { id: 'S-901', patient: 'Robert Williams', age: 72, condition: 'Post-Op ICU Recovery', time: '09:00 AM - 05:00 PM', location: 'Upper East Side, NY', status: 'IN PROGRESS', priority: 'high' },
                   { id: 'S-902', patient: 'Martha Stewart', age: 84, condition: 'General Support', time: '06:00 PM - 09:00 PM', location: 'Brooklyn Heights, NY', status: 'COMMIRMED', priority: 'normal' }
                 ].map((shift, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className={`p-1 rounded-[32px] border-2 transition-all ${shift.status === 'IN PROGRESS' ? 'bg-white border-blue-100 shadow-2xl shadow-blue-500/5' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                   >
                     <div className="bg-white rounded-[30px] p-8 flex flex-col md:flex-row items-stretch gap-10">
                        <div className="md:w-32 rounded-3xl bg-slate-950 text-white p-6 flex flex-col justify-center text-center shrink-0">
                           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Shift In</p>
                           <p className="text-2xl font-black">{shift.time.split(' ')[0]}</p>
                           <p className="text-[9px] font-bold text-primary uppercase mt-1">Confirmed</p>
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-center">
                           <div className="flex items-center gap-4 mb-3">
                              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{shift.patient}</h4>
                              <span className="text-xs font-bold text-slate-300">•</span>
                              <span className="text-sm font-bold text-primary uppercase tracking-widest">{shift.condition}</span>
                           </div>
                           <div className="flex flex-wrap items-center gap-8 text-slate-500 font-medium">
                              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-300" /> <span className="text-sm">{shift.location}</span></div>
                              <div className="flex items-center gap-2"><Clock size={16} className="text-slate-300" /> <span className="text-sm">{shift.time}</span></div>
                              <div className="flex items-center gap-2"><User size={16} className="text-slate-300" /> <span className="text-sm">Age: {shift.age}</span></div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 md:border-l border-slate-100 pl-0 md:pl-10">
                           {shift.status === 'IN PROGRESS' ? (
                             <Button className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                                <Activity size={18} className="mr-3" /> ONGOING
                             </Button>
                           ) : (
                             <Button className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                <Play size={18} className="mr-3" /> COMMENCE
                             </Button>
                           )}
                           <Button variant="ghost" size="icon" className="h-16 w-16 rounded-2xl hover:bg-slate-50 text-slate-300">
                             <MoreVertical size={24} />
                           </Button>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </TabsContent>

              <TabsContent value="earnings">
                 <Card className="enterprise-card border-none shadow-xl rounded-[40px] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-0">
                       <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Revenue Trajectory</CardTitle>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Earnings based on verified clinical hours</p>
                    </CardHeader>
                    <CardContent className="p-10">
                       <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={earningsData}>
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
                                   contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', fontWeight: 'black', padding: '15px'}}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEarning)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                       
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mtd Pay</p>
                             <p className="text-2xl font-bold text-slate-900">$12.4k</p>
                          </div>
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tax Est.</p>
                             <p className="text-2xl font-bold text-slate-900">$2.1k</p>
                          </div>
                          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bonus</p>
                             <p className="text-2xl font-bold text-emerald-500">+$850</p>
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
             
             {/* Clinical Guidelines / Task List */}
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
                   <Button className="w-full mt-10 h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black transition-all">
                      SUBMIT SHIFT LOG
                   </Button>
                </CardContent>
             </Card>

             {/* Clinical Support Hub */}
             <div className="p-8 rounded-[40px] bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-150"></div>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl group-hover:rotate-6 transition-transform">
                      <ShieldAlert size={28} className="text-white" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold">Protocol Hub</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Medical Guidelines</p>
                   </div>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Access the Clinical standard procedure (SOP) for ICU step-down and geriatric emergency scenarios.</p>
                <div className="grid grid-cols-2 gap-4">
                   <Button variant="outline" className="rounded-[18px] h-12 border-white/10 text-white hover:bg-white/5 font-bold text-xs">GUIDELINES</Button>
                   <Button variant="outline" className="rounded-[18px] h-12 border-white/10 text-white hover:bg-white/5 font-bold text-xs">MED MAPS</Button>
                </div>
             </div>

             {/* Emergency SOS Override */}
             <div className="p-8 rounded-[40px] bg-red-50 border border-red-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-6">Security & Emergency</p>
                <div className="flex justify-center mb-8">
                   <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse border-8 border-red-50">
                      <ShieldAlert size={36} />
                   </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Escalation Trigger</h4>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed px-4">Instantly alert command center for clinical support or emergency services.</p>
                <Button className="w-full h-16 rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                   NOTIFY DOCTOR SOS
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
