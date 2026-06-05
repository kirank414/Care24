import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Heart, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/src/api';
import { toast } from 'sonner';
import { normalizeEmail } from '@/src/utils/normalize';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await api.post('/auth/demo-reset-password', {
        email: data.email.toLowerCase().trim(),
        newPassword: data.newPassword,
      });

      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password. Please check the email.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/40 rounded-full blur-[140px]"></div>
         <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-amber-50/20 rounded-full blur-[120px]"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-5 mb-10 group">
            <div className="bg-slate-950 p-4 rounded-[22px] shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <div className="text-left">
              <span className="text-4xl font-black tracking-tighter text-slate-900 block leading-none">Care<span className="text-primary">24</span></span>
              <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black uppercase tracking-[0.4em] leading-none mt-2 px-3 py-1 rounded-full">DEMO MODE</Badge>
            </div>
          </Link>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-950 tracking-[-0.05em]">Reset Password</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-6">
              Enter your registered email and a new password to instantly regain access.
            </p>
          </div>
        </div>

        {/* Demo Warning Banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="text-amber-600 mt-0.5 shrink-0" size={20} />
          <div>
            <h4 className="text-amber-800 font-bold text-xs uppercase tracking-widest mb-1">Development Workflow</h4>
            <p className="text-amber-700/80 text-xs font-medium leading-relaxed">
              This is a demo-only password reset. In a production environment, this would require an email verification token.
            </p>
          </div>
        </div>

        <Card className="rounded-[48px] border-none shadow-[0_50px_120px_-30px_rgba(0,0,0,0.12)] overflow-hidden bg-white/80 backdrop-blur-2xl ring-1 ring-slate-100 p-2">
          <CardContent className="p-10 bg-white rounded-[40px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="email" 
                    placeholder="Enter your email"
                    className="pl-16 h-16 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
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
                <Label htmlFor="newPassword" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="newPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className="pl-16 pr-16 h-16 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
                    {...register('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="confirmPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className="pl-16 h-16 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full h-16 rounded-[28px] font-black text-xs uppercase tracking-[0.35em] shadow-3xl shadow-blue-500/20 bg-slate-950 hover:bg-black text-white active:scale-95 transition-all mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'RESETTING...' : 'RESET PASSWORD'} 
                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
           Remembered your password? <br /><br />
           <Link to="/login" className="text-slate-950 font-black hover:underline underline-offset-4 decoration-primary decoration-2">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
