import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, User, ShieldAlert, Phone, MapPin, Activity, Stethoscope, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useCareStore } from '../stores/careStore';
import { toast } from 'sonner';

export function SetupPatientProfilePage() {
  const navigate = useNavigate();
  const { updatePatient, loading } = useCareStore();

  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    phone: '',
    address: '',
    preferredLanguage: 'English',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    mobilityStatus: 'Independent',
    chronicConditions: '',
    allergies: '',
    currentMedications: '',
    medicalHistory: '',
    careRequirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.bloodGroup ||
      !form.phone ||
      !form.address ||
      !form.emergencyContactName ||
      !form.emergencyContactPhone ||
      !form.emergencyContactRelation
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ageNum = parseInt(form.age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      toast.error('Please enter a valid age between 1 and 120');
      return;
    }

    const cleanBloodGroup = form.bloodGroup.toUpperCase().trim();
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(cleanBloodGroup)) {
      toast.error('Please enter a valid Blood Group (e.g., A+, O-, AB+)');
      return;
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      toast.error('Please enter a valid Phone Number (at least 7 digits)');
      return;
    }

    if (!phoneRegex.test(form.emergencyContactPhone.trim())) {
      toast.error('Please enter a valid Emergency Contact Phone Number');
      return;
    }

    const payload = {
      name: form.name.trim(),
      imageUrl: form.imageUrl.trim(),
      age: ageNum,
      gender: form.gender,
      bloodGroup: cleanBloodGroup,
      phone: form.phone.trim(),
      address: form.address.trim(),
      preferredLanguage: form.preferredLanguage.trim(),
      emergencyContact: {
        name: form.emergencyContactName.trim(),
        phone: form.emergencyContactPhone.trim(),
        relation: form.emergencyContactRelation.trim(),
      },
      mobilityStatus: form.mobilityStatus,
      chronicConditions: form.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: form.currentMedications.split(',').map(s => s.trim()).filter(Boolean),
      medicalHistory: form.medicalHistory.split(',').map(s => s.trim()).filter(Boolean),
      careRequirements: form.careRequirements.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      await updatePatient(payload);
      toast.success('Patient profile configured successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create patient profile');
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
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="bg-slate-950 p-3 rounded-2xl shadow-xl">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">Care<span className="text-primary">24</span></span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Configure Care Profile</h1>
          <p className="text-slate-500 font-medium mt-2">Please complete the patient onboarding details before accessing the dashboard.</p>
        </div>

        <Card className="rounded-[40px] border-none shadow-[0_50px_100px_-30px_rgba(0,0,0,0.08)] bg-white overflow-hidden p-2">
          <CardContent className="p-8 sm:p-12 bg-white rounded-[32px]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Demographics */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
                    <User size={16} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">1. Demographics</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Robert Williams"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Profile Photo (Optional)</Label>
                    <ImageUpload 
                      value={form.imageUrl} 
                      onChange={(base64) => setForm({ ...form, imageUrl: base64 })} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g. 74"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.age}
                      onChange={e => setForm({ ...form, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Gender *</Label>
                    <select
                      id="gender"
                      className="h-14 w-full bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none px-3"
                      value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
                    <Phone size={16} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">2. Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Blood Group *</Label>
                    <Input
                      id="bloodGroup"
                      placeholder="e.g. O+"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.bloodGroup}
                      onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="e.g. 555-0192"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Preferred Language</Label>
                    <Input
                      id="preferredLanguage"
                      placeholder="e.g. English"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.preferredLanguage}
                      onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Residential Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input
                      id="address"
                      placeholder="Enter full address"
                      className="pl-12 h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Emergency Contact */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold">
                    <ShieldAlert size={16} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-red-600">3. Emergency Contact</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ecName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Contact Name *</Label>
                    <Input
                      id="ecName"
                      placeholder="e.g. Sarah Williams"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.emergencyContactName}
                      onChange={e => setForm({ ...form, emergencyContactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ecPhone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Contact Phone *</Label>
                    <Input
                      id="ecPhone"
                      placeholder="e.g. 555-0193"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.emergencyContactPhone}
                      onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ecRelation" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Relation *</Label>
                    <Input
                      id="ecRelation"
                      placeholder="e.g. Daughter"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.emergencyContactRelation}
                      onChange={e => setForm({ ...form, emergencyContactRelation: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Mobility & Medical */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
                    <Activity size={16} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">4. Care & Mobility Needs</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobility" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Mobility Status</Label>
                    <select
                      id="mobility"
                      className="h-14 w-full bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800 outline-none px-3"
                      value={form.mobilityStatus}
                      onChange={e => setForm({ ...form, mobilityStatus: e.target.value })}
                    >
                      <option value="Independent">Independent</option>
                      <option value="Assisted (Cane/Walker)">Assisted (Cane/Walker)</option>
                      <option value="Wheelchair Bound">Wheelchair Bound</option>
                      <option value="Bedridden">Bedridden</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chronic" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Chronic Conditions (comma-separated)</Label>
                    <Input
                      id="chronic"
                      placeholder="e.g. Hypertension, Diabetes"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.chronicConditions}
                      onChange={e => setForm({ ...form, chronicConditions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Allergies (comma-separated)</Label>
                    <Input
                      id="allergies"
                      placeholder="e.g. Penicillin, Peanuts"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.allergies}
                      onChange={e => setForm({ ...form, allergies: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Current Medications (comma-separated)</Label>
                    <Input
                      id="medications"
                      placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.currentMedications}
                      onChange={e => setForm({ ...form, currentMedications: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="history" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Major Medical History (comma-separated)</Label>
                    <Input
                      id="history"
                      placeholder="e.g. Stroke in 2023, Heart Surgery"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.medicalHistory}
                      onChange={e => setForm({ ...form, medicalHistory: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Care Requirements (comma-separated)</Label>
                    <Input
                      id="requirements"
                      placeholder="e.g. Medication Administration, Physiotherapy"
                      className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white border-2 font-bold text-xs uppercase tracking-wider text-slate-800"
                      value={form.careRequirements}
                      onChange={e => setForm({ ...form, careRequirements: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-20 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-blue-500/20 bg-slate-950 hover:bg-black text-white active:scale-95 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'SUBMIT CARE PROFILE'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
