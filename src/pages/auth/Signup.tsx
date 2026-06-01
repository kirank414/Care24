import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Heart, Mail, Lock, ArrowRight, User, ShieldCheck, CheckCircle2, UserPlus } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/src/store';
import { api } from '@/src/api';
import { toast } from 'sonner';
import { toProperCase, normalizeEmail } from '@/src/utils/normalize';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["user", "caregiver"] as const, { message: "Please select a role" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || (role === 'ADMIN' ? '/dashboard/admin' : role === 'CAREGIVER' ? '/dashboard/caregiver' : '/dashboard');
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await api.post('/auth/signup', {
        name: toProperCase(data.name.trim()),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: data.role,
      });

      const { _id, name, email, role: userRoleString, token } = response.data;
      const uppercaseRole = userRoleString.toUpperCase() as any;

      login({
        id: _id,
        email,
        name,
        role: uppercaseRole,
      }, token);

      toast.success('Account created successfully!');
      const destination = location.state?.from?.pathname || (uppercaseRole === 'ADMIN' ? '/dashboard/admin' : uppercaseRole === 'CAREGIVER' ? '/dashboard/caregiver' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failure. Please try again.';
      toast.error(message);
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
              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-[0.4em] leading-none mt-2 px-3 py-1 rounded-full">ONBOARDING</Badge>
            </div>
          </Link>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-950 tracking-[-0.05em]">Create Account</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed px-6">Join Care24 to find the best caregivers for your loved ones.</p>
          </div>
        </div>



        <Card className="rounded-[48px] border-none shadow-[0_50px_120px_-30px_rgba(0,0,0,0.12)] overflow-hidden bg-white/80 backdrop-blur-2xl ring-1 ring-slate-100 p-2">
          <CardContent className="p-12 bg-white rounded-[40px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Full Name</Label>
                <div className="relative">
                  <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="name" 
                    placeholder="Enter full name"
                    className="pl-14 sm:pl-16 pr-6 h-20 w-full bg-slate-50 border-transparent focus:bg-white transition-all font-black text-[10px] sm:text-xs tracking-wider sm:tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0 text-ellipsis overflow-hidden whitespace-nowrap" 
                    {...register('name', {
                      onBlur: (e) => {
                        setValue('name', toProperCase(e.target.value.trim()));
                      }
                    })}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="email" 
                    placeholder="email@example.com"
                    className="pl-14 sm:pl-16 pr-6 h-20 w-full bg-slate-50 border-transparent focus:bg-white transition-all font-black text-[10px] sm:text-xs lowercase tracking-wider sm:tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0 text-ellipsis overflow-hidden whitespace-nowrap" 
                    {...register('email', {
                      onBlur: (e) => {
                        setValue('email', normalizeEmail(e.target.value));
                      }
                    })}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-14 sm:pl-16 pr-6 h-20 w-full bg-slate-50 border-transparent focus:bg-white transition-all font-black text-[10px] sm:text-xs tracking-wider sm:tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0 text-ellipsis overflow-hidden whitespace-nowrap" 
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-14 sm:pl-16 pr-6 h-20 w-full bg-slate-50 border-transparent focus:bg-white transition-all font-black text-[10px] sm:text-xs tracking-wider sm:tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0 text-ellipsis overflow-hidden whitespace-nowrap" 
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">I want to join as</Label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none" />
                  <select 
                    id="role"
                    className="pl-14 sm:pl-16 pr-8 h-20 w-full bg-slate-50 border-transparent focus:bg-white transition-all font-black text-[10px] sm:text-xs tracking-wider sm:tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0 outline-none text-slate-800 text-ellipsis overflow-hidden whitespace-nowrap"
                    {...register('role')}
                  >
                    <option value="user">Patient or Family Member</option>
                    <option value="caregiver">Professional Caregiver</option>
                  </select>
                </div>
                {errors.role && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.role.message}</p>}
              </div>

              <Button type="submit" className="w-full h-20 rounded-[28px] font-black text-xs uppercase tracking-[0.35em] shadow-3xl shadow-blue-500/20 bg-slate-950 hover:bg-black text-white active:scale-95 transition-all" disabled={isSubmitting}>
                {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} 
                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Audit & Compliance Standards</p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
           Already have an account? <br /><br />
           <Link to="/login" className="text-slate-950 font-black hover:underline underline-offset-4 decoration-primary decoration-2">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}
