import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Heart, Mail, Lock, ArrowRight, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/src/store';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = React.useState<'patient' | 'professional'>('patient');
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      login({
        id: '1',
        email: data.email,
        name: data.email.split('@')[0],
        role: userType === 'patient' ? 'USER' : 'CAREGIVER',
      });
      toast.success('Successfully authenticated!');
      navigate(userType === 'patient' ? '/dashboard' : '/dashboard/caregiver');
    } catch (error) {
      toast.error('Authentication failure. Check clinical credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/40 rounded-full blur-[140px]"></div>
         <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-emerald-50/20 rounded-full blur-[120px]"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-5 mb-14 group">
            <div className="bg-slate-950 p-4 rounded-[22px] shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <div className="text-left">
              <span className="text-4xl font-black tracking-tighter text-slate-900 block leading-none">Care<span className="text-primary">24</span></span>
              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-[0.4em] leading-none mt-2 px-3 py-1 rounded-full">HQ SYSTEM</Badge>
            </div>
          </Link>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-950 tracking-[-0.05em]">Portal Access</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed px-6">Select your access tier to enter the clinical governance ecosystem.</p>
          </div>
        </div>

        {/* User Type Switcher */}
        <div className="mb-8 p-1.5 bg-slate-100 rounded-3xl border border-slate-200 flex shadow-inner">
           <button 
             onClick={() => setUserType('patient')}
             className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-[22px] text-[10px] font-black uppercase tracking-[0.15em] transition-all ${userType === 'patient' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <User size={14} /> Patient / Family
           </button>
           <button 
             onClick={() => setUserType('professional')}
             className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-[22px] text-[10px] font-black uppercase tracking-[0.15em] transition-all ${userType === 'professional' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <ShieldCheck size={14} /> Medical Pro
           </button>
        </div>

        <Card className="rounded-[48px] border-none shadow-[0_50px_120px_-30px_rgba(0,0,0,0.12)] overflow-hidden bg-white/80 backdrop-blur-2xl ring-1 ring-slate-100 p-2">
          <CardContent className="p-12 bg-white rounded-[40px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Network Identity</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="email" 
                    placeholder={userType === 'patient' ? "family@id.care24" : "nurse.pro@medical.care24"}
                    className="pl-16 h-20 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs uppercase tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Security PIN</Label>
                  <Link to="#" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                    RECOVER Access
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-16 h-20 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs uppercase tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-20 rounded-[28px] font-black text-xs uppercase tracking-[0.35em] shadow-3xl shadow-blue-500/20 bg-slate-950 hover:bg-black text-white active:scale-95 transition-all" disabled={isSubmitting}>
                {isSubmitting ? 'VERIFYING SECURITY...' : 'ACCESS ECOSYSTEM'} 
                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <div className="mt-14 pt-10 border-t border-slate-50">
               <div className="flex flex-col items-center gap-10">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Audit & Compliance Standards</p>
                  <div className="grid grid-cols-2 gap-5 w-full">
                    <div className="flex flex-col items-center text-center gap-3 p-5 rounded-[24px] border border-slate-100 bg-slate-50/50">
                       <ShieldCheck size={24} className="text-emerald-500" />
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">HIPAA Level 3<br />Data Encryption</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3 p-5 rounded-[24px] border border-slate-100 bg-slate-50/50">
                       <CheckCircle2 size={24} className="text-blue-500" />
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">ISO-27001<br />Certified Ops</span>
                    </div>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
           {userType === 'patient' ? "New family member?" : "Professional caregiver?"} <br /><br />
           <Link to="/signup" className="text-slate-950 font-black hover:underline underline-offset-4 decoration-primary decoration-2">Apply for Onboarding</Link>
        </p>
      </motion.div>
    </div>
  );
}
