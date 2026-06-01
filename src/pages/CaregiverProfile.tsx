import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCareStore } from '../stores/careStore';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  ArrowLeft, 
  ArrowRight,
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Heart,
  User
} from 'lucide-react';

export function CaregiverProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { caregivers, loading, fetchCaregivers } = useCareStore();

  React.useEffect(() => {
    if (caregivers.length === 0) {
      fetchCaregivers();
    }
  }, [caregivers.length]);

  const caregiver = caregivers.find(cg => cg._id === id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-48 bg-slate-200 rounded-full"></div>
          <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Caregiver Profile Not Found</h2>
        <p className="text-slate-500 mb-8 text-center max-w-sm">The caregiver profile you are looking for does not exist or may have been removed.</p>
        <Link to="/caregivers" className="px-6 py-3 bg-slate-950 text-white rounded-xl font-bold">Back to Caregivers</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12 space-y-12">
      {/* Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-950 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Network
        </button>

        {/* Profile Details Container */}
        <div className="bg-white rounded-[48px] shadow-xl p-8 sm:p-16 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Left: Avatar & Badges */}
            <div className="flex flex-col items-center text-center shrink-0 w-full md:w-auto">
              <div className="relative w-48 h-48 rounded-[40px] overflow-hidden bg-slate-100 mb-6 border border-slate-100 shadow-lg">
                {caregiver.imageUrl ? (
                  <img src={caregiver.imageUrl} alt={caregiver.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={96} />
                  </div>
                )}
              </div>

              <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm mb-4 border-none ${
                caregiver.availability ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {caregiver.availability ? 'Available for Bookings' : 'Currently Busy'}
              </Badge>

              {caregiver.isVerified && (
                <Badge className="bg-blue-50 text-primary border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  <ShieldCheck size={12} className="mr-2 text-primary" /> Verified Expert
                </Badge>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex-grow space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight mb-2">{caregiver.name}</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-4">{caregiver.title}</p>
                
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-500" />
                    {caregiver.rating || '5.0'} Rating
                  </span>
                  <span className="text-slate-200">•</span>
                  <span>{caregiver.experienceYears || '1'}+ Years Experience</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Care Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {caregiver.specialties?.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-wider pl-1">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>Serves: {caregiver.cities?.join(', ') || 'New York'}</span>
              </div>

              {/* Description/Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Biography</h4>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-[28px] border border-slate-100">{caregiver.bio || 'Professional caregiver dedicated to senior support.'}</p>
              </div>

              {/* Credentials / Vetting Info */}
              {caregiver.isVerified && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <ShieldCheck size={16} /> Background Checked
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <UserCheck size={16} /> Identity Vetted
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider">
                    <CheckCircle2 size={16} /> Platform Approved
                  </div>
                </div>
              )}

              {/* Action Book CTA */}
              <div className="pt-6">
                <Button 
                  render={<Link to="/dashboard" className="w-full sm:w-auto" />}
                  nativeButton={false}
                  className="h-16 px-12 rounded-[24px] bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] shadow-xl group inline-flex items-center gap-2 active:scale-95 transition-all"
                >
                  Book Care Support <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
