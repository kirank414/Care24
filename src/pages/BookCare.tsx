import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCareStore } from '../stores/careStore';
import { useAuthStore } from '../store';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Lock,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export function BookCarePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { caregivers, fetchCaregivers, createBooking, loading } = useCareStore();
  const { isAuthenticated, user } = useAuthStore();

  const preselectedCaregiverId = searchParams.get('caregiver') || '';

  const [selectedService, setSelectedService] = React.useState('Nursing Care');
  const [selectedCaregiverId, setSelectedCaregiverId] = React.useState(preselectedCaregiverId);
  const [durationType, setDurationType] = React.useState<'hourly' | 'daily' | 'long-term'>('hourly');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('17:00');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchCaregivers();
  }, []);

  React.useEffect(() => {
    if (preselectedCaregiverId) {
      setSelectedCaregiverId(preselectedCaregiverId);
    }
  }, [preselectedCaregiverId]);

  const selectedCaregiverObj = caregivers.find(cg => cg._id === selectedCaregiverId);

  // If not authenticated, block with premium "Authentication Required" view
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 min-h-screen pb-12 space-y-12 flex flex-col justify-center items-center px-4">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>
        <Card className="max-w-md w-full border-none rounded-[40px] shadow-2xl p-8 bg-white border border-slate-100 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 text-primary flex items-center justify-center shadow-lg">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-2">Authentication Required</h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">Please login or sign up to schedule visits and book care services for your loved one.</p>
          </div>
          <div className="flex gap-4 w-full justify-center mt-2">
            <Button className="flex-1 h-14 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-xl" render={<Link to="/login" />} nativeButton={false}>
              Login
            </Button>
            <Button className="flex-1 h-14 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl" render={<Link to="/signup" />} nativeButton={false}>
              Sign Up
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after or equal to the start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking({
        service: selectedService,
        caregiver: selectedCaregiverId || undefined,
        durationType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        totalAmount: selectedCaregiverObj ? selectedCaregiverObj.hourlyRate * 8 : 100 // Estimate
      });
      toast.success('Care booking request submitted successfully! Coordinators will update you.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12 space-y-12">
      {/* Refined Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-950 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Booking Form Card */}
        <div className="bg-white rounded-[48px] shadow-xl p-8 sm:p-16 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="mb-10 text-center">
            <Badge className="bg-primary/5 text-primary border-primary/20 px-6 py-2 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-sm">Booking Flow</Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none">Schedule Care Support</h1>
            <p className="text-sm text-slate-500 font-medium mt-3">Submit your booking request in a few simple steps.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Service Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">1. Select Required Service *</label>
              <div className="relative">
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full h-14 pl-6 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                >
                  <option value="Nursing Care">Nursing Care (Licensed support & recovery)</option>
                  <option value="Elderly Attendant">Elderly Attendant (Daily living & assistance)</option>
                  <option value="Physiotherapy">Physiotherapy (Rehabilitation & mobility)</option>
                  <option value="Post-Hospital Care">Post-Hospital Care (Transitional care)</option>
                  <option value="Long-Term Care">Long-Term Care (Extended caregiver support)</option>
                </select>
              </div>
            </div>

            {/* Step 2: Caregiver Matching */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">2. Match Caregiver (Optional)</label>
              <div className="relative">
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select 
                  value={selectedCaregiverId}
                  onChange={(e) => setSelectedCaregiverId(e.target.value)}
                  className="w-full h-14 pl-6 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                >
                  <option value="">Let Care24 coordinates matching (Auto-match best expert)</option>
                  {caregivers.filter(cg => cg.isVerified).map(cg => (
                    <option key={cg._id} value={cg._id}>{cg.name} — {cg.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Duration Type */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">3. Care Duration Plan</label>
              <div className="grid grid-cols-3 gap-4">
                {(['hourly', 'daily', 'long-term'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDurationType(type)}
                    className={`h-14 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all ${
                      durationType === type 
                        ? 'bg-slate-950 text-white border-transparent shadow-md'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Schedule Picker */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">4. Select Care Schedule *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Start Date</span>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">End Date</span>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {durationType === 'hourly' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Daily Start Time</span>
                    <Input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Daily End Time</span>
                    <Input 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 5: Submit button */}
            <div className="pt-4">
              <Button 
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full h-16 rounded-[24px] bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] shadow-xl group active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT BOOKING REQUEST'}
                {!isSubmitting && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
