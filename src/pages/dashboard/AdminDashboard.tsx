import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  Download,
  Check,
  ShieldCheck,
  Loader2,
  Plus,
  Edit2,
  X,
  FileText,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UserX,
  Clock,
  Star
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCareStore, ServiceCategory } from '../../stores/careStore';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
export function AdminDashboard() {
  const { 
    caregivers, 
    bookings, 
    services,
    loading, 
    error,
    adminMetrics,
    complaints,
    fetchCaregivers, 
    fetchBookings, 
    fetchServices,
    fetchAdminMetrics,
    fetchComplaints,
    verifyCaregiver,
    revokeCaregiver,
    deleteCaregiverProfile,
    toggleAvailabilityByAdmin,
    createService,
    updateService,
    updateComplaintStatus
  } = useCareStore();

  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Dynamic Revenue Overview (past 6 months)
  const getDynamicRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const d = new Date();
    
    // Generate last 6 months in chronological order
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      result.push({
        name: months[m.getMonth()],
        monthNum: m.getMonth(),
        year: m.getFullYear(),
        value: 0
      });
    }
    
    // Group booking amounts by month
    bookings.forEach(b => {
      if (!['confirmed', 'active', 'completed'].includes(b.status)) return;
      const date = b.createdAt ? new Date(b.createdAt) : new Date(b.startDate);
      const bookingMonth = date.getMonth();
      const bookingYear = date.getFullYear();
      
      const match = result.find(r => r.monthNum === bookingMonth && r.year === bookingYear);
      if (match) {
        match.value += b.totalAmount || 0;
      }
    });
    
    return result.map(r => ({ name: r.name, value: r.value }));
  };

  // Dynamic Daily Bookings (grouped by day of the week)
  const getDynamicBookingData = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyCounts: Record<string, number> = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };
    
    bookings.forEach(b => {
      const date = b.createdAt ? new Date(b.createdAt) : new Date(b.startDate);
      const dayName = daysOfWeek[date.getDay()];
      if (dailyCounts[dayName] !== undefined) {
        dailyCounts[dayName]++;
      }
    });
    
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      name: day,
      count: dailyCounts[day]
    }));
  };

  const dynamicRevenueData = getDynamicRevenueData();
  const dynamicBookingData = getDynamicBookingData();

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [selectedCaregiverForDetails, setSelectedCaregiverForDetails] = useState<any>(null);
  
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    priceRange: '',
    icon: 'Stethoscope',
    features: '',
  });

  const handleApproveVerification = async (id: string) => {
    try {
      await verifyCaregiver(id);
      toast.success('Caregiver approved successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to approve caregiver');
    }
  };

  const handleRevokeVerification = async (id: string) => {
    try {
      await revokeCaregiver(id);
      toast.success('Caregiver verification revoked successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to revoke verification');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAvailabilityByAdmin(id, !currentStatus);
      toast.success(`Caregiver availability updated successfully!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to toggle availability');
    }
  };

  const handleDeleteCaregiver = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the clinical profile of "${name}"? This action cannot be undone.`)) {
      try {
        await deleteCaregiverProfile(id);
        toast.success(`Caregiver profile for ${name} deleted successfully.`);
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Failed to delete caregiver');
      }
    }
  };

  useEffect(() => {
    fetchCaregivers(true); // admin mode fetches all caregivers including unverified
    fetchBookings(true); // admin mode fetches all bookings
    fetchServices();
    fetchAdminMetrics();
    fetchComplaints();
  }, []);

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const kpis = [
    { label: 'Total Users', value: adminMetrics?.totalUsers?.toLocaleString() || caregivers.length.toString(), delta: 'Platform', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Caregivers', value: adminMetrics?.totalCaregivers?.toLocaleString() || caregivers.length.toString(), delta: 'Registered', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Verified Caregivers', value: adminMetrics?.verifiedCaregivers?.toLocaleString() || caregivers.filter(c => c.isVerified).length.toString(), delta: 'Verified', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Total Bookings', value: adminMetrics?.totalBookings?.toLocaleString() || bookings.length.toString(), delta: 'All time', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Bookings', value: adminMetrics?.activeBookings?.toLocaleString() || bookings.filter(b => ['pending','confirmed','active'].includes(b.status)).length.toString(), delta: 'Live', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Care Notes Logged', value: adminMetrics?.careNotesLogged?.toLocaleString() || '0', delta: 'Clinical', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Completion Rate', value: adminMetrics?.bookingCompletionRate !== undefined ? `${adminMetrics.bookingCompletionRate.toFixed(1)}%` : '0%', delta: 'Operational', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Response Time', value: adminMetrics?.avgResponseTimeMinutes !== undefined ? `${adminMetrics.avgResponseTimeMinutes.toFixed(1)}m` : '0m', delta: 'SLA Support', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'User Satisfaction', value: adminMetrics?.userSatisfactionScore !== undefined ? `★ ${adminMetrics.userSatisfactionScore.toFixed(1)}` : '★ 5.0', delta: 'CSAT Rating', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Monthly Active', value: adminMetrics?.monthlyActiveUsers?.toLocaleString() || '0', delta: 'MAU Traffic', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  const handleResolveComplaint = async (status: 'resolved' | 'escalated') => {
    if (!selectedComplaint) return;
    try {
      await updateComplaintStatus(selectedComplaint._id, status, resolutionText);
      toast.success(`Complaint marked as ${status}`);
      setSelectedComplaint(null);
      setResolutionText('');
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update complaint');
    }
  };

  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      description: '',
      priceRange: 'From $45/hr',
      icon: 'Stethoscope',
      features: '',
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceCategory) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      priceRange: service.priceRange,
      icon: service.icon,
      features: service.features?.join(', ') || '',
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description || !serviceForm.priceRange) {
      toast.error('Please fill in all fields');
      return;
    }

    const payload = {
      title: serviceForm.title,
      description: serviceForm.description,
      priceRange: serviceForm.priceRange,
      icon: serviceForm.icon,
      features: serviceForm.features.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingService) {
        await updateService(editingService._id, payload);
        toast.success('Service modality updated successfully!');
      } else {
        await createService(payload);
        toast.success('New service modality created successfully!');
      }
      setIsServiceModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save service');
    }
  };

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-500 font-medium mt-1">Global oversight of Care24 healthcare ecosystem and caregiver verification.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="rounded-2xl h-14 px-6 border-slate-200 font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              <Download className="mr-2 h-4 w-4" /> EXPORT REPORTS
            </Button>
            <Button className="rounded-2xl h-14 px-8 bg-slate-950 hover:bg-black text-white font-bold shadow-xl active:scale-95 transition-all" onClick={handleOpenCreateService}>
              <Plus className="mr-2 h-4 w-4" /> ADD MODALITY
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          {kpis.map((kpi, i) => (
            <Card key={i} className="rounded-[32px] border-none shadow-sm hover:translate-y-[-2px] transition-transform bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} shadow-inner`}>
                    <kpi.icon size={22} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100 rounded-full font-bold px-2 py-0.5 text-[9px]">
                    {kpi.delta}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{kpi.value}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight">Revenue Overview</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly platform revenue (caregiver fees + premiums)</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicRevenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0F52BA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', fontWeight: 'bold', padding: '15px'}}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0F52BA" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight">Daily Bookings</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total healthcare service requests per day</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicBookingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', fontWeight: 'bold', padding: '15px'}}
                  />
                  <Bar dataKey="count" fill="#0f52ba" radius={[12, 12, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Table / Tabs System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="caregivers" className="space-y-8">
              <TabsList className="bg-white p-1.5 rounded-2xl h-14 w-full justify-start max-w-xl border border-slate-100 shadow-sm">
                <TabsTrigger value="caregivers" className="rounded-xl px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Caregivers ({caregivers.length})
                </TabsTrigger>
                <TabsTrigger value="services" className="rounded-xl px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Services ({services.length})
                </TabsTrigger>
                <TabsTrigger value="complaints" className="rounded-xl px-8 h-full font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Complaints ({complaints?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="caregivers">
                <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">Caregiver Verification Queue</CardTitle>
                      <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review background checks and approve expert network access</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                      <Table className="min-w-[650px]">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                            <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Caregiver</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Specialty</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Rate / Hr</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
                            <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {caregivers.map((cg, i) => (
                            <TableRow key={cg._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                              <TableCell className="pl-8 py-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-12 w-12 border-2 border-white shadow-md rounded-2xl overflow-hidden">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cg.name}`} />
                                    <AvatarFallback>{cg.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="font-bold text-slate-900 text-sm block">{cg.name}</span>
                                    <span className="text-[11px] font-medium text-slate-400">{cg.title}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-slate-700 text-xs max-w-[180px] truncate">{cg.specialties?.join(', ') || 'Elderly Care'}</TableCell>
                              <TableCell className="font-bold text-slate-900 text-sm">${cg.hourlyRate || 45}</TableCell>
                            <TableCell>
                              <Badge className={`rounded-full px-4 py-1.5 border-none font-black text-[9px] uppercase tracking-widest ${
                                cg.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                              }`}>
                                {cg.isVerified ? 'VERIFIED' : 'PENDING REVIEW'}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                              <div className="flex justify-end space-x-2">
                                {!cg.isVerified && (
                                  <Button 
                                    variant="ghost" 
                                    className="h-10 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                                    onClick={() => handleApproveVerification(cg._id)}
                                    disabled={loading}
                                  >
                                    <ShieldCheck size={16} /> APPROVE
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl">
                                      <MoreVertical size={18} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white border border-slate-100 p-2 rounded-2xl shadow-xl w-56 z-50">
                                    <DropdownMenuItem onClick={() => setSelectedCaregiverForDetails(cg)} className="hover:bg-slate-50 cursor-pointer p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                                      <Eye size={14} className="text-slate-400" /> View Details
                                    </DropdownMenuItem>
                                    {cg.isVerified ? (
                                      <DropdownMenuItem onClick={() => handleRevokeVerification(cg._id)} className="hover:bg-slate-50 cursor-pointer p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                                        <UserX size={14} className="text-amber-500" /> Revoke Approval
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleApproveVerification(cg._id)} className="hover:bg-slate-50 cursor-pointer p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                                        <ShieldCheck size={14} className="text-emerald-500" /> Approve Caregiver
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleToggleAvailability(cg._id, cg.availability)} className="hover:bg-slate-50 cursor-pointer p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                                      {cg.availability ? (
                                        <>
                                          <ToggleRight size={14} className="text-blue-500" /> Set Unavailable
                                        </>
                                      ) : (
                                        <>
                                          <ToggleLeft size={14} className="text-slate-400" /> Set Available
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1 border-slate-100" />
                                    <DropdownMenuItem onClick={() => handleDeleteCaregiver(cg._id, cg.name)} className="hover:bg-red-50 focus:bg-red-50 text-red-600 cursor-pointer p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                      <Trash2 size={14} className="text-red-500" /> Delete Profile
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">Active Care Services</CardTitle>
                      <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configure service catalog and hourly rate baselines</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                      <Table className="min-w-[650px]">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                            <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Title</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Description</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Price Range</TableHead>
                            <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                        {services.map((srv, i) => (
                          <TableRow key={srv._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                            <TableCell className="pl-8 py-4 font-bold text-slate-900 text-sm">
                              {srv.title}
                            </TableCell>
                            <TableCell className="font-medium text-slate-500 text-xs truncate max-w-[250px]">
                              {srv.description}
                            </TableCell>
                            <TableCell className="font-bold text-slate-900 text-sm">
                              {srv.priceRange}
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  className="h-10 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                                  onClick={() => handleOpenEditService(srv)}
                                >
                                  <Edit2 size={16} /> EDIT
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="complaints">
                <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight">Complaints & Disputes</CardTitle>
                      <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review customer issues, resolve complaints, and handle escalations</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                      <Table className="min-w-[650px]">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                            <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Patient</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Caregiver / Service</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Issue Subject</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
                            <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {complaints && complaints.length > 0 ? (
                            complaints.map((c: any, i: number) => (
                              <TableRow key={c._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                                <TableCell className="pl-8 py-4">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 border shadow-md rounded-xl">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.patient?.name}`} />
                                      <AvatarFallback>{c.patient?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <span className="font-bold text-slate-900 text-sm block">{c.patient?.name}</span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">Age: {c.patient?.age || 'N/A'}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-bold text-slate-800 text-sm block">{c.caregiver?.name || 'Unassigned'}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">{c.booking?.service?.title || 'Care Modality'}</span>
                                </TableCell>
                                <TableCell className="font-medium text-slate-900 text-xs max-w-[200px] truncate">
                                  <div className="font-bold text-slate-900 mb-0.5">{c.title}</div>
                                  <div className="text-slate-500 text-[10px] font-medium truncate">{c.description}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest ${
                                    c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                                    c.status === 'escalated' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>
                                    {c.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="pr-8 text-right">
                                  <Button 
                                    variant="ghost" 
                                    className="h-10 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2"
                                    onClick={() => {
                                      setSelectedComplaint(c);
                                      setResolutionText(c.resolution || '');
                                    }}
                                  >
                                    <Edit2 size={14} /> REVIEW
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                                No complaints or support tickets logged in system.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-100 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">System Alerts</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live infrastructure event log</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { title: 'Caregiver Verification sync', time: 'Just now', type: 'info' },
                { title: 'Critical Server Load Normal', time: '5m ago', type: 'info' },
                { title: 'Payment Gateway sync active', time: '12m ago', type: 'info' },
                { title: 'New support ticket #4521', time: '2h ago', type: 'warning' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors">
                  <div className={`mt-0.5 p-2 rounded-xl shadow-sm ${
                    alert.type === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' :
                    alert.type === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">{alert.title}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full h-14 rounded-2xl mt-6 bg-slate-50 border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-100">
                VIEW ALL EVENTS <ArrowUpRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-[40px] shadow-2xl p-8 bg-white border border-slate-100 relative">
            <button 
              onClick={() => setIsServiceModalOpen(false)} 
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-bold">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{editingService ? 'Edit Service Modality' : 'Add Service Modality'}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Configure service baselines and baseline rates in MongoDB Atlas.</p>
              </div>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="srvTitle" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Service Title *</Label>
                <Input
                  id="srvTitle"
                  placeholder="e.g. ICU Critical Care, Physiotherapy"
                  className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                  value={serviceForm.title}
                  onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="srvDesc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Description *</Label>
                <textarea
                  id="srvDesc"
                  placeholder="Service clinical descriptions..."
                  rows={3}
                  className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none resize-none transition-all focus:border-primary/20"
                  value={serviceForm.description}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="srvPrice" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Price Range *</Label>
                  <Input
                    id="srvPrice"
                    placeholder="e.g. From $45/hr, From $50/visit"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                    value={serviceForm.priceRange}
                    onChange={e => setServiceForm({ ...serviceForm, priceRange: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srvIcon" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Icon MODALITY</Label>
                  <select
                    id="srvIcon"
                    className="h-14 w-full bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none px-3"
                    value={serviceForm.icon}
                    onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  >
                    <option value="Stethoscope">Stethoscope</option>
                    <option value="Activity">Activity</option>
                    <option value="UserPlus">UserPlus</option>
                    <option value="Brain">Brain</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="srvFeatures" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Key Features (comma-separated)</Label>
                <Input
                  id="srvFeatures"
                  placeholder="e.g. 24/7 Monitoring, Wound Care, Hygiene Support"
                  className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                  value={serviceForm.features}
                  onChange={e => setServiceForm({ ...serviceForm, features: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (editingService ? 'UPDATE MODALITY' : 'CREATE MODALITY')}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Caregiver Details Modal */}
      {selectedCaregiverForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-xl w-full rounded-[40px] shadow-2xl p-8 bg-white border border-slate-100 relative">
            <button 
              onClick={() => setSelectedCaregiverForDetails(null)} 
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-6">
              <Avatar className="h-24 w-24 border-4 border-slate-100 shadow-xl rounded-[32px] overflow-hidden mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCaregiverForDetails.name}`} />
                <AvatarFallback>{selectedCaregiverForDetails.name?.[0]}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedCaregiverForDetails.name}</h3>
              <p className="text-sm font-semibold text-primary/80 uppercase tracking-widest mt-1">{selectedCaregiverForDetails.title}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{selectedCaregiverForDetails.user?.email || selectedCaregiverForDetails.email || 'Email Not Available'}</p>
              
              <div className="flex gap-2 mt-4">
                <Badge className={`rounded-full px-4 py-1.5 border-none font-black text-[9px] uppercase tracking-widest ${
                  selectedCaregiverForDetails.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedCaregiverForDetails.isVerified ? 'VERIFIED EXPERT' : 'PENDING REVIEW'}
                </Badge>
                <Badge className={`rounded-full px-4 py-1.5 border-none font-black text-[9px] uppercase tracking-widest ${
                  selectedCaregiverForDetails.availability ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedCaregiverForDetails.availability ? 'ACTIVE SHIFT' : 'UNAVAILABLE'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                <p className="text-lg font-black text-slate-900 mt-1">{selectedCaregiverForDetails.experienceYears} Years</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hourly Rate</p>
                <p className="text-lg font-black text-slate-900 mt-1">${selectedCaregiverForDetails.hourlyRate}/hr</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Rating</p>
                <p className="text-lg font-black text-slate-900 mt-1">★ {selectedCaregiverForDetails.rating?.toFixed(1) || '5.0'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaregiverForDetails.specialties?.length ? (
                    selectedCaregiverForDetails.specialties.map((spec: string, index: number) => (
                      <Badge key={index} variant="secondary" className="rounded-xl px-3 py-1 font-bold text-[10px] text-slate-700 bg-slate-100 border-none uppercase tracking-wide">
                        {spec}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="rounded-xl px-3 py-1 font-bold text-[10px] text-slate-700 bg-slate-100 border-none uppercase tracking-wide">
                      Elderly Care
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-1.5">Professional Bio</h4>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-32 overflow-y-auto">
                  {selectedCaregiverForDetails.bio}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                onClick={() => setSelectedCaregiverForDetails(null)}
              >
                Close Window
              </Button>
              {selectedCaregiverForDetails.isVerified ? (
                <Button 
                  className="flex-1 h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                  onClick={() => {
                    handleRevokeVerification(selectedCaregiverForDetails._id);
                    setSelectedCaregiverForDetails(null);
                  }}
                  disabled={loading}
                >
                  Revoke Approval
                </Button>
              ) : (
                <Button 
                  className="flex-1 h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-950/20"
                  onClick={() => {
                    handleApproveVerification(selectedCaregiverForDetails._id);
                    setSelectedCaregiverForDetails(null);
                  }}
                  disabled={loading}
                >
                  Approve Credentials
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Complaint Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-[40px] shadow-2xl p-8 bg-white border border-slate-100 relative">
            <button 
              onClick={() => setSelectedComplaint(null)} 
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-bold">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Resolve Complaint Ticket</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Review ticket, enter resolution notes, and resolve/escalate.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
                <p className="text-xs font-black text-slate-900">{selectedComplaint.patient?.name}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject</p>
                <p className="text-xs font-black text-slate-900">{selectedComplaint.title}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed max-h-24 overflow-y-auto">{selectedComplaint.description}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                <Badge className="mt-1 rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest bg-slate-200 text-slate-700">
                  {selectedComplaint.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="resolution" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Resolution Notes *</Label>
              <textarea
                id="resolution"
                placeholder="Enter final ticket resolution or escalation details..."
                rows={3}
                className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none resize-none transition-all focus:border-primary/20"
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                onClick={() => handleResolveComplaint('resolved')}
                disabled={loading}
              >
                Resolve Ticket
              </Button>
              <Button 
                className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                onClick={() => handleResolveComplaint('escalated')}
                disabled={loading}
              >
                Escalate Ticket
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
