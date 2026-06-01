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
  Star,
  Settings,
  Activity,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCareStore, ServiceCategory, Complaint } from '../../stores/careStore';
import { toast } from 'sonner';
import { useAuthStore } from '../../store';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { api } from '@/src/api';

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
    updateComplaintStatus,
    inquiries,
    fetchInquiries,
    answerInquiry,
    updateInquiryStatus,
    settings,
    fetchSettings,
    updateSettings,
    notifications,
    fetchNotifications
  } = useCareStore();

  const { user } = useAuthStore();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    heroTitle: '', heroSubtitle: '', heroPrimaryCTA: '', heroSecondaryCTA: '',
    satisfactionTitle: '', satisfactionDescription: '', caregiverTrustTitle: '', caregiverTrustDescription: '',
    serviceCoverageTitle: '', serviceCoverageDescription: '', companyName: '', footerDescription: '',
    supportEmail: '', supportPhone: '', whatsappNumber: '', supportHours: '', officeAddress: '',
    supportedCities: '', facebookUrl: '', instagramUrl: '', linkedinUrl: '', twitterUrl: '',
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        heroTitle: settings.heroTitle || '', heroSubtitle: settings.heroSubtitle || '', heroPrimaryCTA: settings.heroPrimaryCTA || '', heroSecondaryCTA: settings.heroSecondaryCTA || '',
        satisfactionTitle: settings.satisfactionTitle || '', satisfactionDescription: settings.satisfactionDescription || '', caregiverTrustTitle: settings.caregiverTrustTitle || '', caregiverTrustDescription: settings.caregiverTrustDescription || '',
        serviceCoverageTitle: settings.serviceCoverageTitle || '', serviceCoverageDescription: settings.serviceCoverageDescription || '', companyName: settings.companyName || '', footerDescription: settings.footerDescription || '',
        supportEmail: settings.supportEmail || '', supportPhone: settings.supportPhone || '', whatsappNumber: settings.whatsappNumber || '', supportHours: settings.supportHours || '', officeAddress: settings.officeAddress || '',
        supportedCities: settings.supportedCities?.join(', ') || '', facebookUrl: settings.facebookUrl || '', instagramUrl: settings.instagramUrl || '', linkedinUrl: settings.linkedinUrl || '', twitterUrl: settings.twitterUrl || '',
      });
    }
  }, [settings]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const citiesArray = settingsForm.supportedCities
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
      await updateSettings({
        ...settingsForm,
        supportedCities: citiesArray,
      });
      const timestamp = new Date().toLocaleTimeString();
      setLastUpdated(timestamp);
      toast.success(`Platform settings updated successfully at ${timestamp}.`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update settings');
    }
  };

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [caregiverWarningText, setCaregiverWarningText] = useState('');
  const [answeringInquiryId, setAnsweringInquiryId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  
  const handleAnswerSubmit = async (id: string) => {
    if (!answerText) {
      toast.error('Please enter an answer');
      return;
    }
    try {
      await answerInquiry(id, answerText);
      toast.success('Inquiry answered successfully');
      setAnsweringInquiryId(null);
      setAnswerText('');
      fetchInquiries(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit answer');
    }
  };

  const handleExportReports = async () => {
    try {
      const res = await api.get('/bookings/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'care24_platform_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report CSV exported successfully!');
    } catch (err: any) {
      toast.error('Failed to export reports: ' + (err.response?.data?.message || err.message));
    }
  };

  const [reviews, setReviews] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminCareNotes, setAdminCareNotes] = useState<any[]>([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await api.get('/users/all');
      setAdminUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchAdminCareNotes = async () => {
    try {
      const res = await api.get('/notes/admin');
      setAdminCareNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch admin care notes', err);
    }
  };

  const handleToggleReviewVisibility = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}/visibility`);
      toast.success('Review visibility updated');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update review visibility');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}`);
        toast.success('Review deleted successfully');
        fetchReviews();
        fetchAdminMetrics(); // Update KPI
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
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

  const dynamicBookingData = getDynamicBookingData();

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [selectedCaregiverForDetails, setSelectedCaregiverForDetails] = useState<any>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeAdminPanelTab, setActiveAdminPanelTab] = useState('services');
  
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    priceRange: '',
    icon: 'Heart',
    features: '',
    isActive: true,
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
    if (window.confirm(`Are you sure you want to delete the profile of "${name}"? This action cannot be undone.`)) {
      try {
        await deleteCaregiverProfile(id);
        toast.success(`Caregiver profile for ${name} deleted successfully.`);
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Failed to delete caregiver');
      }
    }
  };

  useEffect(() => {
    fetchCaregivers(true);
    fetchBookings(true);
    fetchServices();
    fetchAdminMetrics();
    fetchComplaints();
    fetchReviews();
    fetchInquiries(true);
    fetchSettings();
    fetchAdminUsers();
    fetchAdminCareNotes();
    fetchNotifications();
  }, []);

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  // Booking status counts for Booking Activity Overview
  const newBookings = bookings.filter(b => b.status === 'pending').length;
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  // PRD-allowed specialties filter
  const allowedSpecialties = ['registered nurse', 'caregiver', 'physiotherapist', 'patient attendant', 'elderly care', 'home care', 'companion care', 'personal care', 'respite care', 'palliative care', 'post-hospital care', 'post-surgical care', 'mobility assistance'];
  const filterSpecialties = (specs: string[] | undefined): string => {
    if (!specs || specs.length === 0) return 'Caregiver';
    const filtered = specs.filter(s => allowedSpecialties.some(a => s.toLowerCase().includes(a)));
    return filtered.length > 0 ? filtered.join(', ') : 'Caregiver';
  };

  const kpis = [
    { label: 'Registered Users', value: adminMetrics?.totalUsers?.toLocaleString() || adminUsers.length.toString(), delta: 'Platform', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Caregivers', value: caregivers.filter(c => c.isVerified).length.toString(), delta: 'Verified', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length.toString(), delta: 'Active Now', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Open Complaints', value: complaints?.filter((c: any) => c.status !== 'resolved').length?.toString() || '0', delta: 'Requires Action', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Pending Verifications', value: caregivers.filter(c => !c.isVerified).length.toString(), delta: 'Queue', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Monthly Active Users', value: (adminMetrics?.monthlyActiveUsers || Math.max(15, Math.floor(adminUsers.length * 0.8))).toString(), delta: 'Engagement', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleResolveComplaint = async (status: 'resolved' | 'escalated') => {
    if (!selectedComplaint) return;
    try {
      await updateComplaintStatus(selectedComplaint._id, status, resolutionText, caregiverWarningText);
      toast.success(`Complaint marked as ${status}`);
      setSelectedComplaint(null);
      setResolutionText('');
      setCaregiverWarningText('');
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
      priceRange: 'Standard Rates',
      icon: 'Heart',
      features: '',
      isActive: true,
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
      isActive: service.isActive !== false,
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
      isActive: serviceForm.isActive,
    };

    try {
      if (editingService) {
        await updateService(editingService._id, payload);
        toast.success('Service category updated successfully!');
      } else {
        await createService(payload);
        toast.success('New service category created successfully!');
      }
      setIsServiceModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save service');
    }
  };

  // Sub-render Helpers for Dashboard tabs and Management Center modules
  
  const renderCaregiversTable = (unverifiedOnly: boolean) => {
    const list = unverifiedOnly ? caregivers.filter(cg => !cg.isVerified) : caregivers;
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {unverifiedOnly ? 'Caregiver Verification Queue' : 'All Caregivers'}
            </CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {unverifiedOnly 
                ? 'Review background checks and approve expert network access' 
                : 'Manage caregiver accounts, verification statuses, and availability'}
            </CardDescription>
          </div>
          {unverifiedOnly && (
            <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase tracking-widest px-3 py-1">
              {list.length} PENDING
            </Badge>
          )}
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
                {list.length > 0 ? (
                  list.map((cg, i) => (
                    <TableRow key={cg._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-md rounded-2xl overflow-hidden">
                            <AvatarImage src={cg.imageUrl || ''} className="object-cover" />
                            <AvatarFallback className="bg-[#dfe5e7]">
                               <User className="w-full h-full text-white fill-white translate-y-1/4 scale-125" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">{cg.name}</span>
                            <span className="text-[11px] font-medium text-slate-400">{cg.title}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700 text-xs max-w-[180px] truncate">{filterSpecialties(cg.specialties)}</TableCell>
                      <TableCell className="font-bold text-slate-900 text-sm">${cg.hourlyRate || 45}</TableCell>
                      <TableCell>
                        <Badge className={`rounded-full px-4 py-1.5 border-none font-black text-[9px] uppercase tracking-widest ${
                          cg.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        } ${!cg.isVerified ? 'animate-pulse' : ''}`}>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                      No caregivers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUsersTable = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Registered Users</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Patient and family accounts on the platform</CardDescription>
          </div>
          <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-widest px-3 py-1">
            {adminUsers.length} TOTAL
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[650px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Name</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Email</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Role</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Registered</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.length > 0 ? (
                  adminUsers.map((u: any, i: number) => (
                    <TableRow key={u._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border shadow-md rounded-xl">
                            <AvatarImage src={u.imageUrl || ''} className="object-cover" />
                            <AvatarFallback className="bg-[#dfe5e7]">
                               <User className="w-full h-full text-white fill-white translate-y-1/4 scale-125" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-slate-900 text-sm">{u.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">{u.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={`rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-violet-100 text-violet-700' :
                          u.role === 'caregiver' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role || 'patient'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Badge className="rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest bg-emerald-100 text-emerald-700">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                      No registered users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBookingsTable = () => {
    const filtered = bookingStatusFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingStatusFilter);
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Booking Management</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">All platform service bookings and their current status</CardDescription>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl shrink-0 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setBookingStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  bookingStatusFilter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[750px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Patient</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Caregiver</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Service</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Date</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Amount</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((b: any, i: number) => (
                    <TableRow key={b._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <span className="font-bold text-slate-900 text-sm block">{b.patient?.name || 'Patient'}</span>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">{b.caregiver?.name || 'Unassigned'}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-800">{b.service?.title || 'Care Service'}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">
                        {b.startDate ? new Date(b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900">${b.totalAmount || 0}</TableCell>
                      <TableCell className="pr-8 text-right">
                        <Badge className={`rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest ${
                          b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          b.status === 'confirmed' ? 'bg-sky-100 text-sky-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-slate-400 font-bold text-xs">
                      {bookingStatusFilter === 'all' ? 'No bookings found.' : `No ${bookingStatusFilter} bookings.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComplaintsTable = () => {
    return (
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
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Complaint Title</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Issue Description</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Resolution Type</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Date Submitted</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints && complaints.length > 0 ? (
                  complaints.map((c: any, i: number) => (
                    <TableRow key={c._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4 font-bold text-slate-900 text-sm">
                        {c.title}
                      </TableCell>
                      <TableCell className="font-medium text-slate-600 text-xs max-w-[200px] truncate">
                        {c.description}
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
                      <TableCell>
                        <Badge className={`rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest ${
                          c.resolutionType === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                          c.resolutionType === 'Escalated' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {c.resolutionType || 'Open'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-500 text-xs">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button 
                          variant="ghost" 
                          className="h-10 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setResolutionText(c.resolution || '');
                            setCaregiverWarningText(c.caregiverWarning || '');
                          }}
                        >
                          <Edit2 size={14} /> MANAGE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                      No complaints or disputes logged.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAlertsSidebar = () => {
    const alertsList = notifications.length > 0 
      ? notifications.slice(0, 8).map(n => ({
          title: `${n.title}: ${n.message}`,
          time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          type: n.type === 'alert_generated' || n.type === 'booking_cancelled' ? 'warning' :
                n.type === 'booking_completed' ? 'success' : 'info'
        }))
      : [
          { title: 'No recent operational alerts', time: 'Now', type: 'info' }
        ];
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden h-full">
        <CardHeader className="p-8 border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Recent Operational Alerts</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live operational events feed</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {alertsList.map((alert, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors">
              <div className={`mt-0.5 p-2 rounded-xl shadow-sm ${
                alert.type === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                alert.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                <AlertCircle size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">{alert.title}</h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderDailyBookingsChartCard = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">Daily Bookings</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total care service bookings per day of week</CardDescription>
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
    );
  };

  const renderServicesContent = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Active Care Services</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configure service catalog, types, and hourly rate baselines</CardDescription>
          </div>
          <Button 
            onClick={handleOpenCreateService}
            className="h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-6 active:scale-95 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Service
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[750px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Service Category</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Description</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Price Range</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
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
                    <TableCell>
                      <Badge className={`rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest ${
                        srv.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {srv.isActive !== false ? 'Active' : 'Disabled'}
                      </Badge>
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
                        <Button 
                          variant="ghost" 
                          className={`h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                            srv.isActive !== false 
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                          }`}
                          onClick={async () => {
                            try {
                              await updateService(srv._id, { isActive: srv.isActive === false });
                              toast.success(`Service category ${srv.isActive === false ? 'enabled' : 'disabled'} successfully`);
                            } catch (err: any) {
                              toast.error(err.response?.data?.message || err.message || 'Failed to toggle service status');
                            }
                          }}
                        >
                          {srv.isActive !== false ? 'DISABLE' : 'ENABLE'}
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
    );
  };

  const renderCareNotesContent = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Care Notes Monitoring</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Caregiver-submitted visit observations and wellness logs</CardDescription>
          </div>
          <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase tracking-widest px-3 py-1">
            {adminCareNotes.length} NOTES
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Caregiver</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Patient</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Note</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Date</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Alert</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminCareNotes.length > 0 ? (
                  adminCareNotes.map((note: any, i: number) => (
                    <TableRow key={note._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <span className="font-bold text-slate-900 text-sm block">{note.caregiver?.name || note.booking?.caregiver?.name || 'Caregiver'}</span>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">{note.booking?.patient?.name || 'Patient'}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-700 max-w-[250px] truncate">
                        {note.note || 'No note content'}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        {note.isAlert ? (
                          <Badge className="rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest bg-red-100 text-red-700 animate-pulse">
                            ⚠ ALERT
                          </Badge>
                        ) : (
                          <Badge className="rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest bg-slate-100 text-slate-500">
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                      No care notes submitted yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderReviewsContent = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Caregiver Ratings & Satisfaction Metrics</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Patient feedback and caregiver rating overview</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[650px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Patient Name</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Rating</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Comment / Feedback</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r) => (
                  <TableRow key={r._id} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="pl-8 font-bold text-slate-900 text-sm py-4">{r.patientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-500" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-[300px] truncate">{r.comment}</TableCell>
                    <TableCell className="pr-8 text-right text-xs font-medium text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {reviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500 font-medium">No reviews found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderInquiriesContent = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">User FAQ & Support Inquiries</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review questions asked by guests and patients and post answers</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[650px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">User / Email</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Question</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Answer</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Status</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries && inquiries.length > 0 ? (
                  inquiries.map((inq: any, i: number) => (
                    <TableRow key={inq._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4">
                        {inq.user ? (
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">{inq.user.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Registered User</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">{inq.email}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Guest</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 text-xs max-w-[200px] truncate">
                        {inq.question}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-[200px] truncate">
                        {inq.answer || <span className="italic text-slate-400">Not answered yet</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-full px-3 py-1 border-none font-black text-[8px] uppercase tracking-widest ${
                          inq.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                          inq.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        } ${inq.status === 'Open' ? 'animate-pulse' : ''}`}>
                          {inq.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {answeringInquiryId === inq._id ? (
                            <div className="flex flex-col gap-2 items-end">
                              <Input 
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Type answer here..."
                                className="h-10 text-xs w-48 font-semibold text-slate-800"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="h-8 rounded-lg text-[10px] font-bold"
                                  onClick={() => {
                                    setAnsweringInquiryId(null);
                                    setAnswerText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm"
                                  className="h-8 rounded-lg bg-slate-950 text-white text-[10px] font-bold"
                                  onClick={() => handleAnswerSubmit(inq._id)}
                                >
                                  Submit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <select
                                value={inq.status}
                                onChange={async (e) => {
                                  try {
                                    await updateInquiryStatus(inq._id, e.target.value);
                                    toast.success('Inquiry status updated successfully!');
                                    fetchInquiries(true);
                                  } catch (err: any) {
                                    toast.error(err.response?.data?.message || err.message || 'Failed to update status');
                                  }
                                }}
                                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-slate-950 outline-none"
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                              <Button 
                                variant="ghost" 
                                className="h-10 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2"
                                onClick={() => {
                                  setAnsweringInquiryId(inq._id);
                                  setAnswerText(inq.answer || '');
                                }}
                              >
                                <Edit2 size={14} /> ANSWER
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                      No support inquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEscalationsContent = () => {
    const escalated = complaints?.filter((c: any) => c.status === 'escalated') || [];
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Escalation Management</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review escalated complaints, disputes, and resolution tracking</CardDescription>
          </div>
          <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black uppercase tracking-widest px-3 py-1">
            {escalated.length} ESCALATED
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
                  <TableHead className="pl-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Patient</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Caregiver</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Issue</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Resolution Notes</TableHead>
                  <TableHead className="pr-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalated.length > 0 ? (
                  escalated.map((c: any, i: number) => (
                    <TableRow key={c._id || i} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border shadow-md rounded-xl">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.patient?.name}`} />
                            <AvatarFallback>{c.patient?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-slate-900 text-sm">{c.patient?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">{c.caregiver?.name || 'Unassigned'}</TableCell>
                      <TableCell className="text-xs font-medium text-slate-900 max-w-[200px]">
                        <div className="font-bold text-slate-900 mb-0.5">{c.title}</div>
                        <div className="text-slate-500 text-[10px] font-medium truncate">{c.description}</div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500 max-w-[180px] truncate">
                        {c.resolution || <span className="italic text-slate-400">No resolution yet</span>}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button 
                          variant="ghost" 
                          className="h-10 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs flex items-center gap-2"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setResolutionText(c.resolution || '');
                          }}
                        >
                          <Edit2 size={14} /> RESOLVE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs">
                      No escalated complaints.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSettingsContent = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100">
          <CardTitle className="text-2xl font-bold tracking-tight">Platform Settings</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global site content, branding, and social links</CardDescription>
        </CardHeader>
        <CardContent className="p-8 max-h-[600px] overflow-y-auto">
          <form onSubmit={handleSettingsSubmit} className="space-y-12">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4 border-b pb-2">Homepage Messaging</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Hero Title</Label>
                  <Input
                    placeholder="e.g. Compassionate Care"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.heroTitle}
                    onChange={e => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Hero Subtitle</Label>
                  <Input
                    placeholder="e.g. Professional nursing and elderly care"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.heroSubtitle}
                    onChange={e => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Primary CTA Button</Label>
                  <Input
                    placeholder="e.g. Find a Caregiver"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.heroPrimaryCTA}
                    onChange={e => setSettingsForm({ ...settingsForm, heroPrimaryCTA: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Secondary CTA Button</Label>
                  <Input
                    placeholder="e.g. Our Services"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.heroSecondaryCTA}
                    onChange={e => setSettingsForm({ ...settingsForm, heroSecondaryCTA: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4 border-b pb-2">Trust & Credibility Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Card 1 Title</Label>
                  <Input
                    placeholder="e.g. Patient Satisfaction"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.satisfactionTitle}
                    onChange={e => setSettingsForm({ ...settingsForm, satisfactionTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Card 1 Description</Label>
                  <Input
                    placeholder="e.g. Verified Family Reviews"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.satisfactionDescription}
                    onChange={e => setSettingsForm({ ...settingsForm, satisfactionDescription: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Card 2 Title</Label>
                  <Input
                    placeholder="e.g. Verified Caregivers"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.caregiverTrustTitle}
                    onChange={e => setSettingsForm({ ...settingsForm, caregiverTrustTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Card 2 Description</Label>
                  <Input
                    placeholder="e.g. Background Checked Professionals"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.caregiverTrustDescription}
                    onChange={e => setSettingsForm({ ...settingsForm, caregiverTrustDescription: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Card 3 Title</Label>
                  <Input
                    placeholder="e.g. Service Coverage"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.serviceCoverageTitle}
                    onChange={e => setSettingsForm({ ...settingsForm, serviceCoverageTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Card 3 Description</Label>
                  <Input
                    placeholder="e.g. Multi-City Support Network"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.serviceCoverageDescription}
                    onChange={e => setSettingsForm({ ...settingsForm, serviceCoverageDescription: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4 border-b pb-2">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Company Name</Label>
                  <Input
                    placeholder="e.g. Care24"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.companyName}
                    onChange={e => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Supported Cities (comma-separated)</Label>
                  <Input
                    placeholder="e.g. New York, San Francisco, Los Angeles"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.supportedCities}
                    onChange={e => setSettingsForm({ ...settingsForm, supportedCities: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Footer Description</Label>
                  <textarea
                    placeholder="e.g. Empowering families with professional home care..."
                    rows={2}
                    className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800 outline-none resize-none transition-all focus:border-primary/20"
                    value={settingsForm.footerDescription}
                    onChange={e => setSettingsForm({ ...settingsForm, footerDescription: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4 border-b pb-2">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Facebook URL</Label>
                  <Input
                    placeholder="https://facebook.com/..."
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.facebookUrl}
                    onChange={e => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Instagram URL</Label>
                  <Input
                    placeholder="https://instagram.com/..."
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.instagramUrl}
                    onChange={e => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">LinkedIn URL</Label>
                  <Input
                    placeholder="https://linkedin.com/in/..."
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.linkedinUrl}
                    onChange={e => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Twitter (X) URL</Label>
                  <Input
                    placeholder="https://twitter.com/..."
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.twitterUrl}
                    onChange={e => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                type="submit"
                className="w-full md:w-auto h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] px-10 shadow-xl active:scale-95 transition-all md:ml-auto"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'SAVE PLATFORM SETTINGS'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderSupportInfoContent = () => {
    return (
      <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-100">
          <CardTitle className="text-2xl font-bold tracking-tight">Support Information</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage global contact channels and office address configurations</CardDescription>
        </CardHeader>
        <CardContent className="p-8 max-h-[600px] overflow-y-auto">
          <form onSubmit={handleSettingsSubmit} className="space-y-12">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4 border-b pb-2">Support Hotline & Email</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Support Hotline</Label>
                  <Input
                    placeholder="e.g. +1 (800) 123-4567"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.supportPhone}
                    onChange={e => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Support Email</Label>
                  <Input
                    type="email"
                    placeholder="e.g. support@care24.com"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                    value={settingsForm.supportEmail}
                    onChange={e => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Office Location Address</Label>
                  <textarea
                    placeholder="e.g. 100 Main Street, Suite 500, New York, NY"
                    rows={3}
                    className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800 outline-none resize-none transition-all focus:border-primary/20"
                    value={settingsForm.officeAddress}
                    onChange={e => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                type="submit"
                className="w-full md:w-auto h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] px-10 shadow-xl active:scale-95 transition-all md:ml-auto"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'SAVE SUPPORT SETTINGS'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-500 font-medium mt-1">Platform operations — caregiver management, bookings, and service quality.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleExportReports}
              variant="outline" 
              className="rounded-2xl h-14 px-6 border-slate-200 font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Download className="mr-2 h-4 w-4" /> EXPORT REPORTS
            </Button>
            <Button className="rounded-2xl h-14 px-8 bg-slate-950 hover:bg-black text-white font-bold shadow-xl active:scale-95 transition-all" onClick={() => setIsAdminPanelOpen(true)}>
              <Settings className="mr-2 h-4 w-4" /> Management Center
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
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

        {/* Booking Activity Overview + Daily Bookings and Tab Tables */}
        <Tabs defaultValue="overview" className="space-y-8">
          {/* Primary single-row navigation tabs list */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm max-w-4xl w-full">
            <TabsList className="bg-transparent p-0 h-auto w-full grid grid-cols-5 gap-1">
              <TabsTrigger value="overview" className="rounded-xl px-2 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap w-full">
                Overview
              </TabsTrigger>
              <TabsTrigger value="caregivers" className="rounded-xl px-2 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap w-full">
                Caregivers ({caregivers.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl px-2 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap w-full">
                Users ({adminUsers.length})
              </TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-xl px-2 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap w-full">
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="complaints" className="rounded-xl px-2 h-10 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white whitespace-nowrap w-full">
                Complaints ({complaints?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-8 outline-none">
            {/* Platform Activity Overview Card */}
            <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold tracking-tight">Platform Activity Overview</CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform engagement and operation counts</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Total Bookings</p>
                    <p className="text-3xl font-black text-indigo-700">{bookings.length}</p>
                    <p className="text-[9px] font-bold text-indigo-500 mt-1">All-time bookings</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Active Bookings</p>
                    <p className="text-3xl font-black text-blue-700">{bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length}</p>
                    <p className="text-[9px] font-bold text-blue-500 mt-1">In progress & active</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Completed Bookings</p>
                    <p className="text-3xl font-black text-emerald-700">{bookings.filter(b => b.status === 'completed').length}</p>
                    <p className="text-[9px] font-bold text-emerald-500 mt-1">Successfully delivered</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Pending Requests</p>
                    <p className="text-3xl font-black text-amber-700">{bookings.filter(b => b.status === 'pending').length}</p>
                    <p className="text-[9px] font-bold text-amber-500 mt-1">Awaiting caregiver</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-violet-50 border border-violet-100">
                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">Monthly Active Users</p>
                    <p className="text-3xl font-black text-violet-700">{adminMetrics?.monthlyActiveUsers || Math.max(15, Math.floor(adminUsers.length * 0.8))}</p>
                    <p className="text-[9px] font-bold text-violet-500 mt-1">Clients & caregivers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Queue & Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Daily Bookings Chart */}
                {renderDailyBookingsChartCard()}
                
                {/* Caregiver Verification Queue (unverified only) */}
                {renderCaregiversTable(true)}
              </div>
              <div className="lg:col-span-1">
                {/* Recent Operational Alerts */}
                {renderAlertsSidebar()}
              </div>
            </div>
          </TabsContent>

          {/* Caregivers Full List Content */}
          <TabsContent value="caregivers" className="outline-none">
            {renderCaregiversTable(false)}
          </TabsContent>

          {/* Users List Content */}
          <TabsContent value="users" className="outline-none">
            {renderUsersTable()}
          </TabsContent>

          {/* Bookings List Content */}
          <TabsContent value="bookings" className="outline-none">
            {renderBookingsTable()}
          </TabsContent>

          {/* Complaints Content */}
          <TabsContent value="complaints" className="outline-none">
            {renderComplaintsTable()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
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
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{editingService ? 'Edit Service Category' : 'Add Service Category'}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Configure service details and baseline rates for the platform.</p>
              </div>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="srvTitle" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Service Category *</Label>
                <select
                  id="srvTitle"
                  className="h-14 w-full bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none px-3"
                  value={serviceForm.title}
                  onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                >
                  <option value="">Select Service Category</option>
                  <option value="Nursing Care">Nursing Care</option>
                  <option value="Elderly Attendant">Elderly Attendant</option>
                  <option value="Physiotherapy">Physiotherapy</option>
                  <option value="Post-Hospital Care">Post-Hospital Care</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="srvDesc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Description *</Label>
                <textarea
                  id="srvDesc"
                  placeholder="Service descriptions..."
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
                    placeholder="e.g. Standard Rates"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                    value={serviceForm.priceRange}
                    onChange={e => setServiceForm({ ...serviceForm, priceRange: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srvIcon" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Service Icon</Label>
                  <select
                    id="srvIcon"
                    className="h-14 w-full bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none px-3"
                    value={serviceForm.icon}
                    onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  >
                    <option value="Heart">Heart</option>
                    <option value="Activity">Activity</option>
                    <option value="UserPlus">UserPlus</option>
                    <option value="Home">Home</option>
                    <option value="Users">Users</option>
                    <option value="Calendar">Calendar</option>
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

              <div className="space-y-2">
                <Label htmlFor="srvStatus" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Status</Label>
                <select
                  id="srvStatus"
                  className="h-14 w-full bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none px-3"
                  value={serviceForm.isActive ? "true" : "false"}
                  onChange={e => setServiceForm({ ...serviceForm, isActive: e.target.value === "true" })}
                >
                  <option value="true">Active (Visible to Users)</option>
                  <option value="false">Disabled (Hidden from Users)</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (editingService ? 'UPDATE SERVICE' : 'CREATE SERVICE')}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Caregiver Details Modal */}
      {selectedCaregiverForDetails && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-xl w-full rounded-[40px] shadow-2xl p-8 bg-white border border-slate-100 relative">
            <button 
              onClick={() => setSelectedCaregiverForDetails(null)} 
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-6">
              <Avatar className="h-24 w-24 border-4 border-slate-100 shadow-xl rounded-[32px] overflow-hidden mb-4">
                <AvatarImage src={selectedCaregiverForDetails.imageUrl || ''} className="object-cover" />
                <AvatarFallback className="bg-[#dfe5e7]">
                   <User className="w-full h-full text-white fill-white translate-y-1/4 scale-125" />
                </AvatarFallback>
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
                  {selectedCaregiverForDetails.availability ? 'AVAILABLE' : 'UNAVAILABLE'}
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
                  {(() => {
                    const filteredSpecs = selectedCaregiverForDetails.specialties?.filter((spec: string) =>
                      allowedSpecialties.some(allowed => spec.toLowerCase().includes(allowed))
                    ) || [];
                    return filteredSpecs.length ? (
                      filteredSpecs.map((spec: string, index: number) => (
                        <Badge key={index} variant="secondary" className="rounded-xl px-3 py-1 font-bold text-[10px] text-slate-700 bg-slate-100 border-none uppercase tracking-wide">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="rounded-xl px-3 py-1 font-bold text-[10px] text-slate-700 bg-slate-100 border-none uppercase tracking-wide">
                        Caregiver
                      </Badge>
                    );
                  })()}
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
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
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
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Resolve Complaint/Dispute</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Examine complaint details, enter resolution notes, and resolve/escalate.</p>
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

            <div className="space-y-2 mb-4">
              <Label htmlFor="resolution" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Message to Patient *</Label>
              <textarea
                id="resolution"
                placeholder="Enter final resolution or escalation details to notify the patient..."
                rows={3}
                className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none resize-none transition-all focus:border-primary/20"
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="caregiverWarning" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Warning / Notice to Caregiver (Optional)</Label>
              <textarea
                id="caregiverWarning"
                placeholder="Enter a warning or notice to the caregiver. Leave empty if no action is required."
                rows={2}
                className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none resize-none transition-all focus:border-amber-500/20"
                value={caregiverWarningText}
                onChange={e => setCaregiverWarningText(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                onClick={() => handleResolveComplaint('resolved')}
                disabled={loading}
              >
                Mark Resolved
              </Button>
              <Button 
                className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                onClick={() => handleResolveComplaint('escalated')}
                disabled={loading}
              >
                Escalate Dispute
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Admin Panel / Management Center slide-over drawer */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-[1100px] h-full bg-slate-50 shadow-2xl flex flex-row overflow-hidden animate-slide-in-right relative">
            
            {/* Left Navigation Sidebar */}
            <div className="w-64 md:w-80 bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Management Center</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Secondary Modules</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {[
                  {
                    title: 'Platform Operations',
                    items: [
                      { label: 'Services', value: 'services', icon: Activity },
                    ]
                  },
                  {
                    title: 'Quality Control',
                    items: [
                      { label: 'Care Notes', value: 'carenotes', icon: FileText },
                      { label: 'Reviews', value: 'reviews', icon: Star },
                      { label: 'Complaints', value: 'complaints', icon: AlertCircle },
                    ]
                  },
                  {
                    title: 'Support & Resolution',
                    items: [
                      { label: 'Inquiries', value: 'inquiries', icon: Search },
                      { label: 'Escalations', value: 'escalations', icon: TrendingUp },
                    ]
                  },
                  {
                    title: 'System Configuration',
                    items: [
                      { label: 'Settings', value: 'settings', icon: Settings },
                      { label: 'Support Information', value: 'support_info', icon: Clock },
                    ]
                  }
                ].map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = activeAdminPanelTab === item.value;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.value}
                            onClick={() => setActiveAdminPanelTab(item.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-left ${
                              isActive 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <IconComponent size={16} />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 border-rose-100 bg-rose-50/50 hover:bg-rose-50"
                  onClick={() => setIsAdminPanelOpen(false)}
                >
                  Close Workspace
                </Button>
              </div>
            </div>

            {/* Right Content Workspace */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
              <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center z-10 shadow-sm shrink-0">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    {activeAdminPanelTab === 'support_info' ? 'Support Information' : activeAdminPanelTab}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {activeAdminPanelTab === 'services' && 'Configure and manage care services.'}
                    {activeAdminPanelTab === 'carenotes' && 'Monitor visits and wellness logs.'}
                    {activeAdminPanelTab === 'reviews' && 'Moderate customer review details.'}
                    {activeAdminPanelTab === 'complaints' && 'Resolve general complaints and disputes.'}
                    {activeAdminPanelTab === 'inquiries' && 'Reply to FAQs and customer questions.'}
                    {activeAdminPanelTab === 'escalations' && 'Handle critical dispute resolutions.'}
                    {activeAdminPanelTab === 'settings' && 'Customize global landing page settings.'}
                    {activeAdminPanelTab === 'support_info' && 'Update support hotline, emails, and address.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsAdminPanelOpen(false)}
                  className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                {(() => {
                  switch (activeAdminPanelTab) {
                    case 'services':
                      return renderServicesContent();
                    case 'carenotes':
                      return renderCareNotesContent();
                    case 'reviews':
                      return renderReviewsContent();
                    case 'complaints':
                      return renderComplaintsTable();
                    case 'inquiries':
                      return renderInquiriesContent();
                    case 'escalations':
                      return renderEscalationsContent();
                    case 'settings':
                      return renderSettingsContent();
                    case 'support_info':
                      return renderSupportInfoContent();
                    default:
                      return renderServicesContent();
                  }
                })()}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
