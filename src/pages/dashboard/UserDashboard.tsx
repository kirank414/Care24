import React, { useEffect, useState } from 'react';
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
  ChevronDown,
  ShieldAlert,
  Play,
  X,
  Loader2,
  Edit2,
  Languages,
  BookOpen,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useCareStore } from '../../stores/careStore';
import { useAuthStore } from '../../store';
import { api } from '../../api';
import { toast } from 'sonner';
import NotificationCenter from '../../components/NotificationCenter';
import { toProperCase, cleanPhone } from '@/src/utils/normalize';

const TIME_SLOTS = [
  { label: "08:00 AM - 09:00 AM", start: "08:00", end: "09:00" },
  { label: "09:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { label: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { label: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { label: "12:00 PM - 01:00 PM", start: "12:00", end: "13:00" },
  { label: "01:00 PM - 02:00 PM", start: "13:00", end: "14:00" },
  { label: "02:00 PM - 03:00 PM", start: "14:00", end: "15:00" },
  { label: "03:00 PM - 04:00 PM", start: "15:00", end: "16:00" },
  { label: "04:00 PM - 05:00 PM", start: "16:00", end: "17:00" },
  { label: "05:00 PM - 06:00 PM", start: "17:00", end: "18:00" },
  { label: "06:00 PM - 07:00 PM", start: "18:00", end: "19:00" },
  { label: "07:00 PM - 08:00 PM", start: "19:00", end: "20:00" },
];

// Wellness data is sourced exclusively from caregiver-entered care notes (no simulated values)

export function UserDashboard() {
  const { user } = useAuthStore();
  const { 
    patient, 
    bookings, 
    services, 
    caregivers,
    careNotes, 
    loading, 
    error, 
    unreadNotificationCount,
    inquiries,
    fetchPatientMe, 
    fetchBookings, 
    fetchServices, 
    fetchCaregivers,
    fetchCareNotes,
    fetchUnreadNotificationCount,
    fetchInquiries,
    createBooking,
    updatePatient,
    submitComplaint,
    submitInquiry,
    settings,
    fetchSettings
  } = useCareStore();
  const [selectedService, setSelectedService] = useState('');
  const [selectedCaregiver, setSelectedCaregiver] = useState('');
  const [durationType, setDurationType] = useState<'hourly' | 'daily' | 'long-term'>('hourly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [busySlots, setBusySlots] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCaregiver && startDate) {
      api.get(`/bookings/caregiver/${selectedCaregiver}/busy?date=${startDate}`)
        .then((res) => {
          setBusySlots(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch busy slots:", err);
        });
    } else {
      setBusySlots([]);
    }
  }, [selectedCaregiver, startDate]);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedService('');
      setSelectedCaregiver('');
      setDurationType('hourly');
      setStartDate('');
      setEndDate('');
      setStartTime('');
      setEndTime('');
      setSelectedTimeSlot('');
    }
  }, [isModalOpen]);

  useEffect(() => {
    setStartTime('');
    setEndTime('');
    setSelectedTimeSlot('');
  }, [selectedCaregiver, startDate]);

  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintBookingId, setComplaintBookingId] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const handleOpenComplaintModal = (bookingId: string) => {
    setComplaintBookingId(bookingId);
    setComplaintTitle('');
    setComplaintDesc('');
    setComplaintSuccess(false);
    setIsComplaintModalOpen(true);
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintBookingId || !complaintTitle || !complaintDesc) return;
    try {
      await submitComplaint({
        booking: complaintBookingId,
        title: complaintTitle,
        description: complaintDesc,
      } as any);
      setComplaintSuccess(true);
      toast.success('Complaint submitted successfully');
      setTimeout(() => {
        setIsComplaintModalOpen(false);
        setComplaintSuccess(false);
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit complaint');
    }
  };

  // Patient Profile form & section states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showMedicalDetails, setShowMedicalDetails] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [isCarePlanOpen, setIsCarePlanOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    emergencyContactNotificationPreference: 'SMS',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    mobilityStatus: 'Independent',
    careRequirements: '',
    chronicConditions: '',
    preferredLanguage: 'English'
  });

  useEffect(() => {
    fetchPatientMe();
    fetchBookings();
    fetchServices();
    fetchCaregivers();
    fetchUnreadNotificationCount();
    fetchInquiries();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (bookings && bookings.length > 0 && bookings[0] && bookings[0]._id) {
      fetchCareNotes(bookings[0]._id);
    }
  }, [bookings]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedCaregiver) return;
    // Validate based on duration type
    if (durationType === 'hourly') {
      if (!startDate || !startTime || !endTime) return;
    } else if (durationType === 'daily') {
      if (!startDate || !endDate) return;
    } // long-term requires no dates

    const cg = caregivers.find(c => c._id === selectedCaregiver);
    const rate = cg?.hourlyRate || 45;

    // Location-based validation: block booking if caregiver doesn't serve patient's area
    if (patient?.address && cg) {
      const patientArea = patient.address.toLowerCase();
      const cgCities: string[] = cg.cities && cg.cities.length > 0
        ? cg.cities.map((city: string) => city.toLowerCase())
        : [];
      const isServed = cgCities.length > 0
        ? cgCities.some(city => patientArea.includes(city) || city.includes(patientArea.split(',')[0].trim()))
        : false;
      if (!isServed) {
        toast.error(`${cg.name || 'This caregiver'} does not serve your area (${patient.address}). Please select a caregiver available in your location.`);
        setSelectedCaregiver('');
        return;
      }
    }

    // Compute amount based on duration type
    let amount = 0;
    if (durationType === 'hourly') {
      // Assume 1 hour per slot for simplicity; could be refined with time diff
      const hourCount = 1;
      amount = hourCount * rate;
    } else if (durationType === 'daily') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
      amount = days * 8 * rate; // 8 hours daily shift
    } else if (durationType === 'long-term') {
      // Placeholder amount; could be negotiated separately
      amount = 0;
    }

    await createBooking({
      patient: patient?._id,
      caregiver: selectedCaregiver,
      service: selectedService,
      durationType,
      startDate: durationType === 'hourly' ? startDate : startDate,
      endDate: durationType === 'hourly' ? startDate : endDate,
      startTime: durationType === 'hourly' ? startTime : undefined,
      endTime: durationType === 'hourly' ? endTime : undefined,
      totalAmount: amount,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsModalOpen(false);
    }, 2000);
  };

  const openEditProfile = () => {
    if (patient) {
      setProfileForm({
        name: patient.name || '',
        age: patient.age?.toString() || '',
        gender: patient.gender || 'Male',
        bloodGroup: patient.bloodGroup || '',
        phone: patient.phone || '',
        address: patient.address || '',
        emergencyContactName: patient.emergencyContact?.name || '',
        emergencyContactPhone: patient.emergencyContact?.phone || '',
        emergencyContactRelation: patient.emergencyContact?.relation || '',
        emergencyContactNotificationPreference: patient.emergencyContact?.notificationPreference || 'SMS',
        medicalHistory: patient.medicalHistory?.join(', ') || '',
        allergies: patient.allergies?.join(', ') || '',
        currentMedications: patient.currentMedications?.join(', ') || '',
        mobilityStatus: patient.mobilityStatus || 'Independent',
        careRequirements: patient.careRequirements?.join(', ') || '',
        chronicConditions: patient.chronicConditions?.join(', ') || '',
        preferredLanguage: patient.preferredLanguage || 'English'
      });
    } else {
      setProfileForm({
        name: user?.name || '',
        age: '',
        gender: 'Male',
        bloodGroup: 'A+',
        phone: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        emergencyContactNotificationPreference: 'SMS',
        medicalHistory: '',
        allergies: '',
        currentMedications: '',
        mobilityStatus: 'Independent',
        careRequirements: '',
        chronicConditions: '',
        preferredLanguage: 'English'
      });
    }
    setIsProfileModalOpen(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toProperCase = (str: string): string => {
      if (!str) return str;
      return str
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const cleanPhone = (phone: string): string => {
      if (!phone) return phone;
      const trimmed = phone.trim();
      const hasPlus = trimmed.startsWith("+");
      const digits = trimmed.replace(/\D/g, "");
      return (hasPlus ? "+" : "") + digits;
    };
    
    if (!profileForm.name || !profileForm.age || !profileForm.gender || !profileForm.bloodGroup || !profileForm.phone || !profileForm.address || !profileForm.emergencyContactName || !profileForm.emergencyContactPhone || !profileForm.emergencyContactRelation) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ageNum = parseInt(profileForm.age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      toast.error('Please enter a valid age between 1 and 120');
      return;
    }

    const cleanBloodGroup = profileForm.bloodGroup.toUpperCase().trim();
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(cleanBloodGroup)) {
      toast.error('Please enter a valid Blood Group (e.g., A+, O-, AB+)');
      return;
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(profileForm.phone.trim())) {
      toast.error('Please enter a valid Phone Number (at least 7 digits)');
      return;
    }

    if (!phoneRegex.test(profileForm.emergencyContactPhone.trim())) {
      toast.error('Please enter a valid Primary Contact Phone Number');
      return;
    }

    const dataToSubmit = {
      name: toProperCase(profileForm.name.trim()),
      age: ageNum,
      gender: profileForm.gender,
      bloodGroup: cleanBloodGroup,
      phone: cleanPhone(profileForm.phone),
      address: profileForm.address.trim(),
      emergencyContact: {
        name: toProperCase(profileForm.emergencyContactName.trim()),
        phone: cleanPhone(profileForm.emergencyContactPhone),
        relation: profileForm.emergencyContactRelation.trim(),
        notificationPreference: profileForm.emergencyContactNotificationPreference
      },
      medicalHistory: profileForm.medicalHistory.split(',').map(s => s.trim()).filter(Boolean),
      allergies: profileForm.allergies.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: profileForm.currentMedications.split(',').map(s => s.trim()).filter(Boolean),
      mobilityStatus: profileForm.mobilityStatus,
      careRequirements: profileForm.careRequirements.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: profileForm.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      preferredLanguage: profileForm.preferredLanguage.trim()
    };

    try {
      await updatePatient(dataToSubmit);
      toast.success(patient ? 'Profile updated successfully' : 'Profile created successfully');
      setIsProfileModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save patient profile');
    }
  };

  const getProfileCompletion = (p: any) => {
    if (!p) return 0;
    const fields = [
      p.name,
      p.age,
      p.gender,
      p.bloodGroup,
      p.address,
      p.phone,
      p.emergencyContact?.name,
      p.emergencyContact?.phone,
      p.emergencyContact?.relation,
      p.medicalHistory?.length > 0,
      p.allergies?.length > 0,
      p.currentMedications?.length > 0,
      p.mobilityStatus,
      p.careRequirements?.length > 0,
      p.chronicConditions?.length > 0,
      p.preferredLanguage
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getHealthStatus = () => {
    if (!patient) return { text: 'Stable', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    
    const chronicCount = patient.chronicConditions?.length || 0;
    const medicationCount = patient.currentMedications?.length || 0;
    
    if (chronicCount > 2 || medicationCount > 3) {
      return { text: 'Monitoring Required', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    }
    if (patient.mobilityStatus === 'Bedridden' || patient.mobilityStatus === 'Wheelchair Bound') {
      return { text: 'Active Care Needed', color: 'bg-blue-50 text-blue-600 border-blue-100' };
    }
    return { text: 'Stable', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  const activeBooking = bookings[0];
  const upcomingVisits = bookings.filter((b: any) => ['pending', 'confirmed', 'active'].includes(b?.status));
  
  const getBookingStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          badge: 'bg-amber-500 text-white',
          indicator: 'bg-amber-500',
          text: 'PEND',
          color: 'text-amber-500',
          width: '20%'
        };
      case 'confirmed':
        return {
          badge: 'bg-blue-500 text-white',
          indicator: 'bg-blue-500',
          text: 'CONF',
          color: 'text-blue-500',
          width: '40%'
        };
      case 'active':
        return {
          badge: 'bg-emerald-500 text-white',
          indicator: 'bg-emerald-500',
          text: 'ON',
          color: 'text-emerald-500',
          width: '60%'
        };
      case 'completed':
        return {
          badge: 'bg-indigo-500 text-white',
          indicator: 'bg-indigo-500',
          text: 'DONE',
          color: 'text-indigo-500',
          width: '100%'
        };
      case 'cancelled':
        return {
          badge: 'bg-red-500 text-white',
          indicator: 'bg-red-500',
          text: 'CANC',
          color: 'text-red-500',
          width: '0%'
        };
      default:
        return {
          badge: 'bg-slate-500 text-white',
          indicator: 'bg-slate-500',
          text: 'TBD',
          color: 'text-slate-500',
          width: '0%'
        };
    }
  };

  const activeBookingStyles = activeBooking ? getBookingStatusStyles(activeBooking.status) : {
    badge: 'bg-slate-500 text-white',
    indicator: 'bg-slate-500',
    text: 'OFF',
    color: 'text-slate-500',
    width: '0%'
  };

  const getServiceStatusStep = (status?: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 3;
      case 'active': return 4;
      case 'completed': return 5;
      default: return -1;
    }
  };

  const patientName = patient?.name || '';
  const patientAge = patient?.age || 0;
  const patientGender = patient?.gender || '';
  const patientBlood = patient?.bloodGroup || '';
  const patientAllergies = patient?.allergies?.length ? patient.allergies.join(', ') : 'None';
  const emergencyContact = patient?.emergencyContact || null;

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
                     <Badge className={`${
                       activeBooking?.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                       activeBooking?.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' :
                       activeBooking?.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                       activeBooking?.status === 'completed' ? 'bg-indigo-500/10 text-indigo-500' :
                       'bg-slate-500/10 text-slate-500'
                     } border-none font-black uppercase text-[8px] tracking-widest px-2 py-0.5 rounded-full`}>
                       {activeBooking ? `${activeBooking.status.toUpperCase()} SESSION` : 'NO SESSION'}
                     </Badge>
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px] mt-2 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Care Coordination • Last Sync: Live
                  </p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pb-1">
             <div className="relative">
               <Button
                 variant="ghost"
                 size="icon"
                 id="notification-bell-user"
                 className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm relative hover:bg-slate-50"
                 onClick={() => setNotifOpen(!notifOpen)}
               >
                 <Bell size={20} className="text-slate-600" />
                 {unreadNotificationCount > 0 && (
                   <div className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                     <span className="text-[9px] font-black text-white">{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</span>
                   </div>
                 )}
               </Button>
               <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
             </div>
             <Button className="h-14 px-8 rounded-2xl bg-slate-950 text-white font-bold text-sm shadow-xl active:scale-95 transition-all" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} className="mr-2" /> NEW BOOKING
             </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Patient Care Profile Card */}
        {!patient ? (
          <div className="mb-10">
            <Card className="rounded-[40px] border-none shadow-xl bg-white p-2">
              <CardContent className="p-8 lg:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-10">
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <User size={36} />
                  </div>
                  <div className="flex-grow text-center md:text-left space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">No Patient Profile Configured</h2>
                    <p className="text-slate-500 font-medium text-sm max-w-xl">
                      Set up your elderly relative's care profile to automatically match with our verified caregiver network, monitor wellness reports, and log support updates.
                    </p>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <Button 
                      onClick={openEditProfile}
                      className="w-full md:w-auto h-14 px-8 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
                    >
                      <Plus size={18} className="mr-2" /> CREATE PATIENT PROFILE
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 mb-10">
            <Card className="rounded-[40px] border-none shadow-xl bg-white p-2 overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-10">
                  
                  {/* Left Column: Avatar & Basic Details */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 shrink-0 lg:w-48 text-center sm:text-left lg:text-center">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-[36px] bg-slate-50 border-4 border-white shadow-2xl overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patientName}`} alt="Patient Avatar" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 ${
                        activeBooking?.status === 'pending' ? 'bg-amber-500' :
                        activeBooking?.status === 'confirmed' ? 'bg-blue-500' :
                        activeBooking?.status === 'active' ? 'bg-emerald-500' :
                        activeBooking?.status === 'completed' ? 'bg-indigo-500' :
                        'bg-slate-400'
                      } p-2 rounded-xl border-4 border-white shadow-lg text-white`}>
                        {activeBooking?.status === 'pending' ? <Clock size={16} /> : <ShieldCheck size={16} />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Subject Individual</p>
                      <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none mb-3 break-words max-w-[180px]">{patientName}</h2>
                      <div className="flex flex-wrap justify-center sm:justify-start lg:justify-center gap-2">
                        <Badge className={`${getHealthStatus().color} border text-[9px] font-bold px-2 py-0.5 rounded-lg`}>
                          {getHealthStatus().text.toUpperCase()}
                        </Badge>
                        {activeBooking && (
                          <Badge className={`${
                            activeBooking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            activeBooking.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            activeBooking.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          } border text-[9px] font-bold px-2 py-0.5 rounded-lg`}>
                            {activeBooking.status.toUpperCase()} CARE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Core Parameters & Completion Bar */}
                  <div className="flex-grow space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Demographics</p>
                        <p className="font-bold text-slate-900 text-sm">{patientGender}, {patientAge} yrs</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Group</p>
                        <p className="font-bold text-slate-900 text-sm">Type {patientBlood}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobility Status</p>
                        <p className="font-bold text-slate-900 text-sm truncate">{patient.mobilityStatus || 'Independent'}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Language</p>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                          <Languages size={14} className="text-slate-400" />
                          <span>{patient.preferredLanguage || 'English'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Residence</p>
                        <p className="font-medium text-slate-700 text-sm">{patient.address}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</p>
                        <p className="font-medium text-slate-700 text-sm">{patient.phone}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Profile Completion Status</span>
                        <span className="text-slate-950 font-black">{getProfileCompletion(patient)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${getProfileCompletion(patient)}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className="h-full bg-emerald-500 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Primary Contact & Edit Action */}
                  <div className="flex flex-col justify-between items-center lg:items-end gap-6 shrink-0 lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-10">
                    <div className="w-full text-center lg:text-right space-y-2">
                      <Badge className="bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Primary Contact</Badge>
                      {emergencyContact ? (
                        <div>
                          <p className="font-bold text-slate-900 text-base leading-none mb-1">{emergencyContact.name}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{emergencyContact.relation}</p>
                          <p className="text-sm text-slate-800 font-medium mt-2">{emergencyContact.phone}</p>
                          <p className="text-[10px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100 rounded-md px-1.5 py-0.5 inline-block mt-2">PREFERENCE: {emergencyContact.notificationPreference || 'SMS'}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-red-500 font-medium">No contact configured</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full">
                      <Button 
                        onClick={() => setShowMedicalDetails(!showMedicalDetails)}
                        variant="ghost" 
                        className="flex-grow h-12 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5"
                      >
                        Medical <ChevronDown size={14} className={`transform transition-transform ${showMedicalDetails ? 'rotate-180' : ''}`} />
                      </Button>
                      <Button 
                        onClick={openEditProfile}
                        className="h-12 w-12 rounded-xl bg-slate-950 hover:bg-black text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
                      >
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </div>

                </div>

                {/* Collapsible Medical Details Accordion */}
                <AnimatePresence>
                  {showMedicalDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-slate-100 mt-8 pt-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        
                        <div className="space-y-2">
                          <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chronic Conditions</h6>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.chronicConditions?.length ? patient.chronicConditions.map((cond, i) => (
                              <Badge key={i} className="bg-red-50 text-red-600 border border-red-100 rounded-lg text-[9px] font-bold px-2 py-0.5">{cond}</Badge>
                            )) : <span className="text-xs text-slate-400 font-medium">None Reported</span>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allergies</h6>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.allergies?.length ? patient.allergies.map((allergy, i) => (
                              <Badge key={i} className="bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[9px] font-bold px-2 py-0.5">{allergy}</Badge>
                            )) : <span className="text-xs text-slate-400 font-medium">No Allergies</span>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medications</h6>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.currentMedications?.length ? patient.currentMedications.map((med, i) => (
                              <Badge key={i} className="bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-bold px-2 py-0.5">{med}</Badge>
                            )) : <span className="text-xs text-slate-400 font-medium">None Prescribed</span>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical History</h6>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.medicalHistory?.length ? patient.medicalHistory.map((hist, i) => (
                              <Badge key={i} className="bg-slate-100 text-slate-600 border-none rounded-lg text-[9px] font-bold px-2 py-0.5">{hist}</Badge>
                            )) : <span className="text-xs text-slate-400 font-medium">None Logged</span>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Care Requirements</h6>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.careRequirements?.length ? patient.careRequirements.map((req, i) => (
                              <Badge key={i} className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-bold px-2 py-0.5">{req}</Badge>
                            )) : <span className="text-xs text-slate-400 font-medium">General Assistance</span>}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Live Assignment Banner */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="group relative overflow-hidden p-1 rounded-[32px] bg-slate-950 shadow-3xl"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
               <div className="relative bg-transparent p-8 flex flex-col md:flex-row items-center justify-between text-white gap-8 font-sans">
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-[#2a3942] flex items-center justify-center border border-white/10 shadow-2xl transition-transform group-hover:scale-105 overflow-hidden">
                            {activeBooking?.caregiver?.profileImage ? (
                              <img
                                src={activeBooking.caregiver.profileImage}
                                alt={activeBooking.caregiver.name || 'Caregiver'}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                              />
                            ) : null}
                            {/* WhatsApp-style default avatar — shown when no profile image */}
                            <svg
                              className={`w-full h-full ${activeBooking?.caregiver?.profileImage ? 'hidden' : ''}`}
                              viewBox="0 0 212 212"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width="212" height="212" fill="#2a3942"/>
                              <path
                                d="M106 106C128.09 106 146 88.09 146 66C146 43.91 128.09 26 106 26C83.91 26 66 43.91 66 66C66 88.09 83.91 106 106 106Z"
                                fill="#b0bec5"
                              />
                              <path
                                d="M106 116C72.69 116 26 132.69 26 150V166H186V150C186 132.69 139.31 116 106 116Z"
                                fill="#b0bec5"
                              />
                            </svg>
                         </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${activeBookingStyles.indicator} rounded-full border-[3px] border-slate-950 flex items-center justify-center text-[7px] font-black`}>{activeBookingStyles.text}</div>
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-xl font-bold tracking-tight leading-none text-white">{activeBooking?.caregiver?.name || 'TBD'}</h3>
                           <Badge className={`${activeBooking ? activeBookingStyles.badge : 'bg-slate-500 text-white'} border-none text-[7px] font-black tracking-[0.2em] px-2 py-0.5`}>{activeBooking?.caregiver?.title || 'PENDING ASSIGNMENT'}</Badge>
                        </div>
                        <p className="text-slate-400 font-medium text-xs leading-relaxed">Assigned Service: {activeBooking?.service?.title || 'Nursing Care'} • Status: {activeBooking?.status?.toUpperCase() || 'NONE'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        className="h-12 px-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-black text-[10px] tracking-widest flex items-center gap-2"
                        onClick={() => activeBooking?._id && handleOpenComplaintModal(activeBooking._id)}
                        disabled={!activeBooking}
                      >
                        <AlertCircle size={14} /> REPORT ISSUE
                      </Button>
                  </div>
               </div>
            </motion.div>

             {/* Service Status Tracker */}
             {activeBooking && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-100/40 mb-10"
               >
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h4 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Service Status Tracker</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time status updates of your caregiver booking</p>
                   </div>
                   <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-wider px-2.5 py-1">
                     {activeBooking.status.toUpperCase()}
                   </Badge>
                 </div>

                 <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 mt-8 px-4">
                   {/* Background progress line */}
                   <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 hidden md:block z-0"></div>
                   
                   {/* Dynamic active line */}
                   <div 
                     className="absolute top-1/2 left-8 h-1 bg-blue-600 -translate-y-1/2 hidden md:block z-0 transition-all duration-500"
                     style={{ 
                       width: `${Math.max(0, Math.min(100, (getServiceStatusStep(activeBooking.status) / 5) * 100))}%` 
                     }}
                   ></div>

                   {[
                     "Request Submitted",
                     "Caregiver Reviewing",
                     "Accepted",
                     "Caregiver Assigned",
                     "Service In Progress",
                     "Completed"
                   ].map((stepLabel, idx) => {
                     const currentStep = getServiceStatusStep(activeBooking.status);
                     const isCompleted = idx < currentStep;
                     const isActive = idx === currentStep;
                     
                     return (
                       <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 relative z-10 w-full md:w-auto">
                         <div 
                           className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                             isCompleted ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' :
                             isActive ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50 animate-pulse' :
                             'bg-white border-slate-200 text-slate-400'
                           }`}
                         >
                           {isCompleted ? '✓' : idx + 1}
                         </div>
                         <div className="text-left md:text-center">
                           <p className={`text-xs font-bold leading-tight ${isActive ? 'text-blue-600 font-black' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{stepLabel}</p>
                           <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                             {isActive ? 'In Progress' : isCompleted ? 'Completed' : 'Pending'}
                           </p>
                         </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            {/* Wellness Observations */}
            <Card className="enterprise-card border-none shadow-2xl shadow-slate-200/40 rounded-[40px] overflow-hidden p-2">
               <CardHeader className="p-10 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Wellness Observations</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                       <Zap size={12} className="text-primary" /> Live care and wellness updates
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                     {careNotes.length > 0 && careNotes[0]?.isAlert ? (
                       <Badge className="bg-red-50 text-red-600 border border-red-200 shadow-sm rounded-lg px-4 h-9 font-bold text-[10px] items-center flex gap-2 animate-in slide-in-from-right-4">
                          <ShieldAlert size={14} className="animate-pulse text-red-500" />
                          CARE ALERT: {careNotes[0]?.alertReason || 'Abnormal Observations Detected'}
                       </Badge>
                     ) : careNotes.length > 0 ? (
                       <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg px-4 h-9 font-bold text-[10px] items-center flex gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                          DATA SYNCED - STABLE
                       </Badge>
                     ) : (
                       <Badge className="bg-slate-50 text-slate-400 border border-slate-200 rounded-lg px-4 h-9 font-bold text-[10px] items-center flex gap-2">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                          NO VISITS RECORDED
                       </Badge>
                     )}
                  </div>
               </CardHeader>
               <CardContent className="p-10">
                  {careNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50/50 border border-slate-100 flex items-center justify-center mb-4">
                        <Activity size={28} className="text-slate-300" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 tracking-tight">No Wellness Observations Available</h4>
                      <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed font-medium">
                        Wellness observations, pulse rate, oxygen levels, and blood pressure records will populate here once caregiver logs are recorded during visits.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="h-[340px] w-full mb-12">
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={[...careNotes].reverse().map((note: any) => ({
                              time: new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              heartRate: note.heartRate ?? note.vitalSigns?.heartRate ?? 0,
                              oxygen: note.spo2 ?? note.vitalSigns?.oxygenSaturation ?? 0,
                              bp: parseInt(note.bloodPressure || note.vitalSigns?.bloodPressure || '0')
                            }))}>
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
                              contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', fontWeight: 'bold', padding: '15px'}}
                              cursor={{ stroke: '#0F52BA', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="heartRate" stroke="#0F52BA" strokeWidth={4} fillOpacity={1} fill="url(#primaryGradient)" />
                            <Area type="monotone" dataKey="oxygen" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                         {[
                           { label: 'Pulse Rate', val: careNotes[0]?.heartRate ?? careNotes[0]?.vitalSigns?.heartRate ?? 'N/A', unit: 'BPM', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                           { label: 'Oxygen Sat.', val: careNotes[0]?.spo2 ?? careNotes[0]?.vitalSigns?.oxygenSaturation ?? 'N/A', unit: '%', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                           { label: 'Blood Pressure', val: careNotes[0]?.bloodPressure || careNotes[0]?.vitalSigns?.bloodPressure || 'N/A', unit: 'mmHg', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                           { label: 'Temperature', val: careNotes[0]?.temperature ?? careNotes[0]?.vitalSigns?.temperature ?? 'N/A', unit: '°F', icon: Heart, color: 'text-amber-500', bg: 'bg-amber-50' },
                         ].map((stat, i) => (
                           <div key={i} className="p-6 rounded-[28px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all group">
                              <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                                 <stat.icon size={20} />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{stat.label}</p>
                              <div className="flex items-baseline gap-1.5">
                                 <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{stat.val}</h4>
                                 <span className="text-[10px] font-bold text-slate-400 leading-none">{stat.val !== 'N/A' ? stat.unit : ''}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                    </>
                  )}
               </CardContent>
            </Card>

            {/* Care Log - Timelined */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary"><History size={20} /></div>
                    Care Journal & Activity Log
                  </h3>
               </div>
               <div className="space-y-2">
                  {careNotes.length > 0 ? careNotes.map((log: any, i: number) => (
                    <motion.div 
                      key={log?._id || i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-100 transition-colors"
                    >
                       <div className="min-w-[70px] border-r border-slate-100 pr-6">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">LOG</p>
                          <p className="text-sm font-black text-slate-950 text-center leading-none tracking-tighter">#{i+1}</p>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-primary/5 transition-colors">
                          <FileText size={18} className="group-hover:text-primary transition-colors" />
                       </div>
                       <div className="flex-grow">
                          <h5 className="font-bold text-slate-900 tracking-tight text-sm">{log?.note || 'Patient observation logged.'}</h5>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-slate-500 mt-1">
                             <span>Ref: {log?.caregiver?.name || 'Caregiver'}</span>
                             <span className="text-slate-300">•</span>
                             <span>{log?.createdAt ? new Date(log.createdAt).toLocaleString() : ''}</span>
                          </div>
                          {(log?.bloodPressure || log?.vitalSigns?.bloodPressure || log?.heartRate || log?.vitalSigns?.heartRate || log?.spo2 || log?.vitalSigns?.oxygenSaturation || log?.temperature || log?.vitalSigns?.temperature) ? (
                            <p className="text-[10px] font-bold text-primary mt-1.5">
                              Observations: BP: {log?.bloodPressure || log?.vitalSigns?.bloodPressure || 'N/A'} | HR: {log?.heartRate ?? log?.vitalSigns?.heartRate ?? 'N/A'} BPM | SpO2: {log?.spo2 ?? log?.vitalSigns?.oxygenSaturation ?? 'N/A'}% | Temp: {log?.temperature ?? log?.vitalSigns?.temperature ?? 'N/A'}°F
                            </p>
                          ) : (
                            <p className="text-[10px] font-medium text-slate-400 mt-1.5">No health observations recorded.</p>
                          )}
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                          log?.isAlert
                            ? 'bg-red-50 border-red-100'
                            : 'bg-emerald-50 border-emerald-100'
                        }`}>
                           <span className={`w-1 h-1 rounded-full ${log?.isAlert ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                           <span className={`text-[8px] font-black uppercase ${log?.isAlert ? 'text-red-600' : 'text-emerald-600'}`}>
                             {log?.isAlert ? 'ALERT' : 'VERIFIED'}
                           </span>
                        </div>
                     </motion.div>
                  )) : (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] border border-slate-100">
                       <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                         <FileText size={28} className="text-slate-200" />
                       </div>
                       <p className="font-bold text-slate-400 text-base">No Care Notes Yet</p>
                       <p className="text-xs text-slate-300 mt-1.5 text-center max-w-xs">Care notes will appear here once your caregiver begins logging session observations.</p>
                     </div>
                   )}
              </div>
            </div>

              {/* FAQ Support & Inquiries */}
              <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm mt-6">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Support Inquiries</h3>
                    <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                      {inquiries ? inquiries.length : 0} TOTAL
                    </Badge>
                 </div>
                 
                 {!inquiries || inquiries.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-xs text-slate-400 font-medium">No inquiries submitted yet</p>
                      <p className="text-[10px] text-slate-300 mt-1">Submit a question in the FAQ section on the home page.</p>
                   </div>
                 ) : (
                   <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                     {inquiries.map((inq: any, i: number) => (
                       <div key={inq._id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                         <p className="text-xs font-bold text-slate-900 leading-tight">Q: {inq.question}</p>
                         {inq.status === 'answered' ? (
                           <div className="mt-2.5 pl-3 border-l-2 border-primary">
                             <p className="text-[11px] font-semibold text-primary">A: {inq.answer}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Answered by Care Concierge</p>
                           </div>
                         ) : (
                           <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-bold text-amber-500 uppercase">
                             <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                             <span>Pending Response</span>
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
              </div>
 
           </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-10">
             
             {/* Active Package Widget */}
             <div className="p-1 rounded-[40px] bg-slate-50 border border-slate-100">
                <div className="bg-white p-10 rounded-[38px] shadow-sm">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                         <CreditCard size={24} />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Plan</p>
                         <h5 className="font-bold text-lg text-slate-900 tracking-tight">{activeBooking?.service?.title || 'Post-Op Critical Care'}</h5>
                      </div>
                   </div>
                   
                   <div className="space-y-4 mb-10">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                         <span>Cycle Progress</span>
                         <span className={`font-black ${activeBookingStyles.color}`}>{activeBooking ? activeBooking.status.toUpperCase() : 'NO PLAN'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: activeBookingStyles.width }}
                           transition={{ duration: 1.5, ease: "circOut" }}
                           className={`h-full ${activeBooking ? activeBookingStyles.indicator : 'bg-slate-300'} rounded-full`}
                         ></motion.div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <Button 
                         variant="ghost" 
                         className="rounded-2xl h-14 border border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all text-center px-1"
                         onClick={() => {
                           if (activeBooking) {
                             setIsBookingDetailsOpen(true);
                           } else {
                             toast.error('No active service details to view');
                           }
                         }}
                       >
                         Service Details
                       </Button>
                       <Button 
                         className="rounded-2xl h-14 bg-slate-950 text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] text-center px-1"
                         onClick={() => {
                           if (activeBooking) {
                             setIsCarePlanOpen(true);
                           } else {
                             toast.error('No active care plan to view');
                           }
                         }}
                       >
                         Care Plan
                       </Button>
                    </div>
                </div>
             </div>

             {/* Coordinator Contact / Support Request */}
             <div className="p-10 rounded-[40px] bg-blue-50/50 border-2 border-blue-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-16 h-16 bg-white border border-blue-100 text-primary rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Phone size={32} />
                   </div>
                   <div>
                      <h5 className="font-bold text-xl text-slate-900 tracking-tight">Coordinator Help</h5>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Direct Support Desk</p>
                   </div>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-10">Need scheduling assistance or have a care question? Instantly notify your assigned coordinator to contact you.</p>
                <Button 
                   onClick={async () => {
                     try {
                       await submitInquiry({
                         question: `Support call requested by patient: ${patient?.name || user?.name || "Anonymous Patient"}`,
                         email: patient?.phone || user?.email || "N/A"
                       });
                       toast.success('Support call request sent. Your care coordinator will contact you shortly.');
                       fetchInquiries();
                     } catch (err: any) {
                       toast.error(err.response?.data?.message || err.message || 'Failed to request support call');
                     }
                   }}
                   className="w-full h-16 rounded-[24px] bg-slate-950 hover:bg-slate-900 text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                   REQUEST SUPPORT CALL
                </Button>
             </div>

              {/* Upcoming Visits Widget */}
              <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight font-sans">Upcoming Visits</h3>
                    <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">{upcomingVisits.length} SCHEDULED</Badge>
                 </div>
                 {upcomingVisits.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-6 text-center">
                     <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                       <Calendar size={20} className="text-slate-300" />
                     </div>
                     <p className="text-xs font-semibold text-slate-400">No Upcoming Visits</p>
                     <p className="text-[10px] text-slate-300 mt-0.5">Use the 'Book Now' option to request care support</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {upcomingVisits.slice(0, 3).map((b: any, i: number) => {
                        const statusStyle = getBookingStatusStyles(b?.status);
                        const formattedDate = new Date(b?.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        return (
                          <div key={b?._id || i} className="flex gap-4 items-center justify-between p-3 rounded-2xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/55 transition-all">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                 <Clock size={18} />
                               </div>
                               <div>
                                 <p className="text-xs font-bold text-slate-900">{b?.service?.title || 'Nursing Support'}</p>
                                 <p className="text-[10px] font-medium text-slate-500 mt-0.5">Caregiver: {b?.caregiver?.name || 'TBD'}</p>
                                 <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{formattedDate} @ {b?.startTime || 'Anytime'}</p>
                               </div>
                             </div>
                             <div>
                               <Badge className={`${statusStyle.badge} border-none text-[8px] font-black uppercase px-2 py-0.5`}>{b?.status || 'pending'}</Badge>
                             </div>
                          </div>
                        );
                     })}
                   </div>
                 )}
              </div>

             {/* Booking History List */}
             <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Booking History</h3>
                   <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">{bookings.length} TOTAL</Badge>
                </div>
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                      <Calendar size={24} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400">No Bookings Yet</p>
                    <p className="text-xs text-slate-300 mt-1">Create your first booking to get started</p>
                    <Button
                      size="sm"
                      className="mt-4 rounded-xl bg-slate-950 text-white font-bold text-xs"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus size={12} className="mr-1" /> Book Now
                    </Button>
                  </div>
                ) : (
                <div className="space-y-4">
                   {bookings.map((b: any, i: number) => {
                      const statusStyle = getBookingStatusStyles(b?.status);
                      return (
                        <div key={b?._id || i} className="flex gap-4 items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                           <div>
                              <p className="text-sm font-bold text-slate-900">{b?.service?.title || 'Nursing Care'}</p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Caregiver: {b?.caregiver?.name || 'TBD'}</p>
                              <Badge className={`mt-2 ${statusStyle.badge} border-none text-[8px] font-black uppercase px-2 py-0.5`}>{b?.status || 'pending'}</Badge>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">${b?.totalAmount || 800}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{b?.paymentStatus || 'paid'}</p>
                              <div className="flex items-center gap-2 justify-end mt-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-slate-100 rounded-xl"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (b?._id) handleOpenComplaintModal(b._id);
                                    }}
                                  >
                                    <AlertCircle size={14} />
                                  </Button>
                               </div>
                           </div>
                        </div>
                      );
                    })}
                </div>
                )}
             </div>

          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {isBookingDetailsOpen && activeBooking && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-8 relative border border-slate-100"
            >
              <button 
                onClick={() => setIsBookingDetailsOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Service Details</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Information about your active service booking.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Type</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.service?.title || 'Nursing Support'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Caregiver</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.caregiver?.name || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start Date</span>
                    <span className="text-sm font-bold text-slate-900">{new Date(activeBooking?.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">End Date</span>
                    <span className="text-sm font-bold text-slate-900">{new Date(activeBooking?.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Care Schedule</span>
                    <span className="text-sm font-bold text-slate-900 capitalize">{activeBooking?.durationType || 'hourly'} ({activeBooking?.startTime || 'Anytime'})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Status</span>
                    <Badge className={`${activeBookingStyles.badge} border-none text-[9px] font-black uppercase px-2.5 py-0.5`}>
                      {activeBooking?.status}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsBookingDetailsOpen(false)}
                  className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-xl"
                >
                  Close Details
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Care Plan Modal */}
      <AnimatePresence>
        {isCarePlanOpen && activeBooking && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-8 relative border border-slate-100"
            >
              <button 
                onClick={() => setIsCarePlanOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Heart size={24} className="fill-blue-600 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Patient Care Plan</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Customized elder care guidelines and requirements.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4 max-h-[350px] overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Name</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.patient?.name || patient?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Age</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.patient?.age || patient?.age || 'N/A'} yrs</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.patient?.gender || patient?.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobility Status</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.patient?.mobilityStatus || patient?.mobilityStatus || 'Independent'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferred Language</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.patient?.preferredLanguage || patient?.preferredLanguage || 'English'}</span>
                  </div>
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Care Requirements</span>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 mt-1">
                      {activeBooking?.patient?.careRequirements?.join(', ') || patient?.careRequirements?.join(', ') || 'No custom requirements specified.'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Type</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.service?.title || 'Nursing Support'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Schedule</span>
                    <span className="text-xs font-bold text-slate-900">
                      {new Date(activeBooking?.startDate).toLocaleDateString()} - {new Date(activeBooking?.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Caregiver</span>
                    <span className="text-sm font-bold text-slate-900">{activeBooking?.caregiver?.name || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                    <Badge className={`${activeBookingStyles.badge} border-none text-[9px] font-black uppercase px-2.5 py-0.5`}>
                      {activeBooking?.status}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsCarePlanOpen(false)}
                  className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-xl"
                >
                  Close Plan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule Care Service</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Select a service and preferred care schedule dates.</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-100 animate-pulse">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 tracking-tight">Booking Confirmed!</h4>
                  <p className="text-xs text-emerald-700 font-medium">Your request has been matched with our elite care network.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateBooking} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Select Service Category</label>
                    <select 
                      value={selectedService} 
                      onChange={(e) => setSelectedService(e.target.value)} 
                      required 
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    >
                      <option value="">-- Select Service --</option>
                      {services.filter(svc => 
                        caregivers.some(cg => 
                          cg.isVerified && cg.specialties && cg.specialties.some((sp: string) => 
                            sp.toLowerCase().includes(svc.title.toLowerCase()) || svc.title.toLowerCase().includes(sp.toLowerCase())
                          )
                        )
                      ).map(s => {
                        const priceLabel = "Standard Rates";
                        return (
                          <option key={s._id} value={s._id}>{s.title} ({priceLabel})</option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Select Preferred Caregiver</label>
                    <select 
                      value={selectedCaregiver} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          setSelectedCaregiver('');
                          return;
                        }
                        const cg = caregivers.find(c => c._id === val);
                        if (cg && patient && patient.address) {
                          const patientAddr = patient.address.toLowerCase();
                          const cgCities = cg.cities || [];
                          const isMatchingLoc = cgCities.length === 0
                            ? (patientAddr.includes('new york') || patientAddr.includes('ny'))
                            : cgCities.some(city => 
                                patientAddr.includes(city.toLowerCase().trim()) ||
                                city.toLowerCase().trim().includes(patientAddr)
                              );
                          if (!isMatchingLoc) {
                            toast.error(`${cg.name} does not serve your location!`);
                            setSelectedCaregiver('');
                            return;
                          }
                        }
                        setSelectedCaregiver(val);
                      }} 
                      required 
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    >
                      <option value="">-- Select Caregiver --</option>
                      {caregivers
                          .filter(cg => {
                            if (!cg.isVerified) return false;
                            
                            // Filter by selected service
                            if (selectedService) {
                              const svc = services.find(s => s._id === selectedService);
                              if (svc) {
                                if (!cg.specialties || cg.specialties.length === 0) return false;
                                const matchesService = cg.specialties.some((sp: string) => 
                                  sp.toLowerCase().includes(svc.title.toLowerCase()) || 
                                  svc.title.toLowerCase().includes(sp.toLowerCase())
                                );
                                if (!matchesService) return false;
                              }
                            }
                            
                            return true;
                          })
                          .map(cg => {
                            let isMatchingLoc = true;
                            if (patient && patient.address) {
                              const patientAddr = patient.address.toLowerCase();
                              if (!cg.cities || cg.cities.length === 0) {
                                isMatchingLoc = patientAddr.includes('new york') || patientAddr.includes('ny');
                              } else {
                                isMatchingLoc = cg.cities.some(city => 
                                  patientAddr.includes(city.toLowerCase().trim()) ||
                                  city.toLowerCase().trim().includes(patientAddr)
                                );
                              }
                            }
                            return (
                              <option 
                                key={cg._id} 
                                value={cg._id} 
                                disabled={!isMatchingLoc}
                              >
                                {cg.name} - {cg.title} {!isMatchingLoc ? "(Not serving your area)" : ""}
                              </option>
                            );
                          })}
                    </select>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    <Button
                      type="button"
                      variant={durationType === 'hourly' ? 'default' : 'outline'}
                      onClick={() => setDurationType('hourly')}
                    >Hourly</Button>
                    <Button
                      type="button"
                      variant={durationType === 'daily' ? 'default' : 'outline'}
                      onClick={() => setDurationType('daily')}
                    >Daily</Button>
                    <Button
                      type="button"
                      variant={durationType === 'long-term' ? 'default' : 'outline'}
                      onClick={() => setDurationType('long-term')}
                    >Long Term</Button>
                  </div>

                  {durationType === 'hourly' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Time Slot</label>
                        <select
                          value={selectedTimeSlot}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedTimeSlot(val);
                            if (val) {
                              const slot = TIME_SLOTS.find(s => s.label === val);
                              if (slot) {
                                setStartTime(slot.start);
                                setEndTime(slot.end);
                              }
                            } else {
                              setStartTime('');
                              setEndTime('');
                            }
                          }}
                          required
                          className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        >
                          <option value="">-- Select Time Slot --</option>
                          {TIME_SLOTS.map((slot) => {
                            // Check if slot overlaps with any busy slots
                            const isBooked = busySlots.some(b => {
                              if (!b.startTime || !b.endTime) return false;
                              return slot.start < b.endTime && slot.end > b.startTime;
                            });
                            return (
                              <option key={slot.label} value={slot.label} disabled={isBooked}>
                                {slot.label} {isBooked ? "(Already Booked)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}

                  {durationType === 'daily' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {durationType === 'long-term' && (
                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-700">
                      <p className="font-medium mb-2">For long‑term care plans, please contact our support team to discuss personalized solutions.</p>
                      <p className="text-sm">Email: {settings?.supportEmail ? <a href={`mailto:${settings.supportEmail}`} className="text-primary underline">{settings.supportEmail}</a> : 'Information will be updated by the administrator.'}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'CONFIRM BOOKING REQUEST'}
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Profile Form Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-8 relative border border-slate-100 my-8 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsProfileModalOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {patient ? 'Edit Patient Profile' : 'Configure Patient Profile'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Configure care preferences, contact details, and requirements.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-8">
                
                {/* Section 1: Personal Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">1. Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Full Name *</label>
                      <input 
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        onBlur={(e) => setProfileForm({ ...profileForm, name: toProperCase(e.target.value) })}
                        required
                        placeholder="e.g. Robert Williams"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Age *</label>
                        <input 
                          type="number"
                          value={profileForm.age}
                          onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                          required
                          placeholder="74"
                          className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Gender *</label>
                        <select 
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                          required
                          className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Preferred Language *</label>
                      <input 
                        type="text"
                        value={profileForm.preferredLanguage}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredLanguage: e.target.value })}
                        required
                        placeholder="e.g. English, Spanish"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Blood Group *</label>
                      <input 
                        type="text"
                        value={profileForm.bloodGroup}
                        onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                        required
                        placeholder="e.g. O+, AB-"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">2. Contact & Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Phone Number *</label>
                      <input 
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: cleanPhone(e.target.value) })}
                        required
                        placeholder="555-0192"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Address *</label>
                      <input 
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        required
                        placeholder="123 Carewood Ave, Beverly Hills"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                 {/* Section 3: Primary Contact */}
                 <div className="space-y-4">
                   <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">3. Primary Contact</h4>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Contact Name *</label>
                       <input 
                         type="text"
                         value={profileForm.emergencyContactName}
                         onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                         onBlur={(e) => setProfileForm({ ...profileForm, emergencyContactName: toProperCase(e.target.value) })}
                         required
                         placeholder="Sarah Williams"
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Contact Phone *</label>
                       <input 
                         type="text"
                         value={profileForm.emergencyContactPhone}
                         onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: cleanPhone(e.target.value) })}
                         required
                         placeholder="555-0193"
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Relationship *</label>
                       <input 
                         type="text"
                         value={profileForm.emergencyContactRelation}
                         onChange={(e) => setProfileForm({ ...profileForm, emergencyContactRelation: e.target.value })}
                         required
                         placeholder="Daughter / Son / Spouse"
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Notification Preference *</label>
                       <select 
                         value={profileForm.emergencyContactNotificationPreference}
                         onChange={(e) => setProfileForm({ ...profileForm, emergencyContactNotificationPreference: e.target.value })}
                         required
                         className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                       >
                         <option value="SMS">SMS Alerts</option>
                         <option value="Email">Email Digests</option>
                         <option value="Phone Call">Phone Calls</option>
                         <option value="WhatsApp">WhatsApp</option>
                       </select>
                     </div>
                  </div>
                </div>

                {/* Section 4: Mobility & Support Needs */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">4. Physical Mobility</h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Mobility Status *</label>
                    <select 
                      value={profileForm.mobilityStatus}
                      onChange={(e) => setProfileForm({ ...profileForm, mobilityStatus: e.target.value })}
                      required
                      className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    >
                      <option value="Independent">Independent</option>
                      <option value="Assisted (Cane/Walker)">Assisted (Cane/Walker)</option>
                      <option value="Wheelchair Bound">Wheelchair Bound</option>
                      <option value="Bedridden">Bedridden</option>
                    </select>
                  </div>
                </div>

                {/* Section 5: Medical Profile */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">5. Medical Profile</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Use commas to separate items</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Chronic Conditions</label>
                      <input 
                        type="text"
                        value={profileForm.chronicConditions}
                        onChange={(e) => setProfileForm({ ...profileForm, chronicConditions: e.target.value })}
                        placeholder="Hypertension, Type 2 Diabetes"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Allergies</label>
                      <input 
                        type="text"
                        value={profileForm.allergies}
                        onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                        placeholder="Penicillin, Latex, Peanuts"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Current Medications</label>
                      <input 
                        type="text"
                        value={profileForm.currentMedications}
                        onChange={(e) => setProfileForm({ ...profileForm, currentMedications: e.target.value })}
                        placeholder="Lisinopril 10mg, Metformin 500mg"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Medical History</label>
                      <input 
                        type="text"
                        value={profileForm.medicalHistory}
                        onChange={(e) => setProfileForm({ ...profileForm, medicalHistory: e.target.value })}
                        placeholder="Hip Surgery (2023), Cataracts"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Care Requirements</label>
                    <input 
                      type="text"
                      value={profileForm.careRequirements}
                      onChange={(e) => setProfileForm({ ...profileForm, careRequirements: e.target.value })}
                      placeholder="Meal Prep, Mobility Support, Medication Reminders"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="w-1/3 h-14 rounded-2xl border border-slate-100 text-slate-600 font-bold text-sm uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-2/3 h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (patient ? 'SAVE CHANGES' : 'CREATE PROFILE')}
                  </Button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Log Complaint Modal */}
      <AnimatePresence>
        {isComplaintModalOpen && (
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
                onClick={() => setIsComplaintModalOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-bold">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Report Support Issue</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Submit complaints or disputes related to this care session.</p>
                </div>
              </div>

              {complaintSuccess ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-100 animate-pulse">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 tracking-tight">Report Filed Successfully</h4>
                  <p className="text-xs text-emerald-700 font-medium">Platform administrators have been notified. Dispute registered.</p>
                </div>
              ) : (
                <form onSubmit={handleComplaintSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="compTitle" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Issue Subject / Category *</Label>
                    <Input
                      id="compTitle"
                      placeholder="e.g. Caregiver arrived late, Unprofessional behavior"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs text-slate-800"
                      value={complaintTitle}
                      onChange={e => setComplaintTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="compDesc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Detailed Description *</Label>
                    <textarea 
                      id="compDesc"
                      value={complaintDesc} 
                      onChange={(e) => setComplaintDesc(e.target.value)} 
                      required 
                      rows={4} 
                      placeholder="Please provide details about what occurred..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
                      SUBMIT COMPLAINT
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600" onClick={() => setIsComplaintModalOpen(false)}>
                      CANCEL
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
