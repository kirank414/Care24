import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCareStore } from '../stores/careStore';

interface CareNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: any[];
  selectedBookingId: string;
  setSelectedBookingId: (id: string) => void;
  onSuccess?: () => void;
}

export function CareNoteModal({
  isOpen,
  onClose,
  bookings,
  selectedBookingId,
  setSelectedBookingId,
  onSuccess,
}: CareNoteModalProps) {
  const { addCareNote, loading } = useCareStore();
  const [noteContent, setNoteContent] = useState('');
  const [bp, setBp] = useState('');
  const [hr, setHr] = useState<number | ''>('');
  const [ox, setOx] = useState<number | ''>('');
  const [temp, setTemp] = useState<number | ''>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !noteContent) return;

    const payload: any = {
      booking: selectedBookingId,
      note: noteContent,
    };

    // Health observations are optional, only include if filled
    if (bp) payload.bloodPressure = bp;
    if (hr !== '') payload.heartRate = hr;
    if (ox !== '') payload.spo2 = ox;
    if (temp !== '') payload.temperature = temp;

    try {
      await addCareNote(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        setNoteContent('');
        setBp('');
        setHr('');
        setOx('');
        setTemp('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting care note:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full p-8 relative border border-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Post-Visit Log</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Record care updates and visit observations for the current session.</p>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-100 animate-pulse">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <span className="text-2xl">✓</span>
            </div>
            <h4 className="text-xl font-bold text-emerald-950 tracking-tight">Visit Observation Saved!</h4>
            <p className="text-xs text-emerald-700 font-medium">Observations successfully shared with the care team.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Select Active Booking</label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                required
                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              >
                <option value="" disabled>-- Select a booking --</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.patient?.name || 'Robert Williams'} - {b.service?.title || 'Nursing Care'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Blood Pressure (Optional)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="e.g. 120/80"
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Heart Rate (Optional)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="BPM (e.g. 72)"
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Oxygen Sat. (Optional)</label>
                <input
                  type="number"
                  value={ox}
                  onChange={(e) => setOx(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="% (e.g. 98)"
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Temperature (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="°F (e.g. 98.6)"
                  className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Visit Note / Observations</label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                required
                rows={3}
                placeholder="Describe visit and patient's physical/mental comfort..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'SUBMIT VISIT OBSERVATIONS'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
