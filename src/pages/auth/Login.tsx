import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Heart, Mail, Lock, ArrowRight, User, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/src/store';
import { api } from '@/src/api';
import { toast } from 'sonner';
import { normalizeEmail } from '@/src/utils/normalize';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || (role === 'ADMIN' ? '/dashboard/admin' : role === 'CAREGIVER' ? '/dashboard/caregiver' : '/dashboard');
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post('/auth/login', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      const { _id, name, email, role: userRoleString, token } = response.data;
      const uppercaseRole = userRoleString.toUpperCase() as any;

      login({
        id: _id,
        email,
        name,
        role: uppercaseRole,
      }, token);

      toast.success('Successfully authenticated!');
      const destination = location.state?.from?.pathname || (uppercaseRole === 'ADMIN' ? '/dashboard/admin' : uppercaseRole === 'CAREGIVER' ? '/dashboard/caregiver' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failure. Check account credentials.';
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
              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-[0.4em] leading-none mt-2 px-3 py-1 rounded-full">HQ SYSTEM</Badge>
            </div>
          </Link>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-950 tracking-[-0.05em]">Welcome Back</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed px-6">Login to your account to manage your care and schedule.</p>
          </div>
        </div>



        <Card className="rounded-[48px] border-none shadow-[0_50px_120px_-30px_rgba(0,0,0,0.12)] overflow-hidden bg-white/80 backdrop-blur-2xl ring-1 ring-slate-100 p-2">
          <CardContent className="p-12 bg-white rounded-[40px]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 pl-2">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="email" 
                    placeholder="Enter your email"
                    className="pl-16 h-20 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
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
                <div className="flex items-center justify-between px-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Password</Label>
                  <Link to="/reset-password" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    className="pl-16 pr-16 h-20 bg-slate-50 border-transparent focus:bg-white transition-all font-black text-xs tracking-widest rounded-3xl border-2 focus:border-primary/20 focus-visible:ring-0" 
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-destructive font-black uppercase tracking-widest pl-2 pt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-20 rounded-[28px] font-black text-xs uppercase tracking-[0.35em] shadow-3xl shadow-blue-500/20 bg-slate-950 hover:bg-black text-white active:scale-95 transition-all" disabled={isSubmitting}>
                {isSubmitting ? 'LOGGING IN...' : 'LOGIN'} 
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
           New to Care24? <br /><br />
           <Link to="/signup" className="text-slate-950 font-black hover:underline underline-offset-4 decoration-primary decoration-2">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
