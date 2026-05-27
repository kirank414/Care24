import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, User, DollarSign, Briefcase, Award, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCareStore } from '../stores/careStore';
import { toast } from 'sonner';

export function SetupCaregiverProfilePage() {
  const navigate = useNavigate();
  const { updateCaregiver, loading } = useCareStore();

  const [form, setForm] = useState({
    title: '',
    experienceYears: '',
    hourlyRate: '',
    bio: '',
    specialties: '',
    cities: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.experienceYears || !form.hourlyRate || !form.bio || !form.specialties || !form.cities) {
      toast.error('Please fill in all fields');
      return;
    }

    const expYears = parseInt(form.experienceYears);
    if (isNaN(expYears) || expYears < 0 || expYears > 60) {
      toast.error('Please enter a valid years of experience');
      return;
    }

    const hrRate = parseFloat(form.hourlyRate);
    if (isNaN(hrRate) || hrRate <= 0) {
      toast.error('Please enter a valid hourly rate');
      return;
    }

    const payload = {
      title: form.title.trim(),
      experienceYears: expYears,
      hourlyRate: hrRate,
      bio: form.bio.trim(),
      specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
      cities: form.cities.split(',').map(s => s.trim()).filter(Boolean),
      availability: true,
    };

    try {
      await updateCaregiver(payload);
      toast.success('Caregiver profile configured successfully! Sent for verification.');
      navigate('/dashboard/caregiver', { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save caregiver profile');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-50/40 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-emerald-50/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="bg-slate-950 p-3 rounded-2xl shadow-xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">Care<span className="text-primary">24</span></span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Caregiver Credentials setup</h1>
          <p className="text-slate-500 font-medium mt-2">Please complete your professional credentials before accessing your shift terminal.</p>
        </div>

        <Card className="rounded-[40px] border-none shadow-[0_50px_100px_-30px_rgba(0,0,0,0.08)] bg-white overflow-hidden p-2">
          <CardContent className="p-8 sm:p-12 bg-white rounded-[32px]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Demographics / Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
                    <User size={16} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Clinical Credentials</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Professional Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. ICU Critical Care RN, Senior Caregiver"
                    className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="exp" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Years of Experience *</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <Input
                        id="exp"
                        type="number"
                        placeholder="e.g. 8"
                        className="pl-12 h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                        value={form.experienceYears}
                        onChange={e => setForm({ ...form, experienceYears: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Hourly Rate ($ USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <Input
                        id="rate"
                        type="number"
                        placeholder="e.g. 55"
                        className="pl-12 h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                        value={form.hourlyRate}
                        onChange={e => setForm({ ...form, hourlyRate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Specialties (comma-separated) *</Label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input
                      id="specs"
                      placeholder="e.g. ICU Care, Geriatrics, Dementia Support"
                      className="pl-12 h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.specialties}
                      onChange={e => setForm({ ...form, specialties: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cities" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Service Cities (comma-separated) *</Label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input
                      id="cities"
                      placeholder="e.g. New York, Newark, Boston"
                      className="pl-12 h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.cities}
                      onChange={e => setForm({ ...form, cities: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Professional Bio *</Label>
                  <textarea
                    id="bio"
                    placeholder="Provide a detailed professional background and specialties detail..."
                    rows={4}
                    className="w-full p-4 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none resize-none transition-all focus:border-primary/20"
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-20 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-blue-500/20 bg-slate-950 hover:bg-black text-white active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'SUBMIT CAREGIVER SETUP'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
