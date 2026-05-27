/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { HomePage } from './pages/Home';
import { ServicesPage } from './pages/Services';
import { CaregiversPage } from './pages/Caregivers';
import { PricingPage } from './pages/Pricing';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { CaregiverDashboard } from './pages/dashboard/CaregiverDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { LoginPage } from './pages/auth/Login';
import { SignupPage } from './pages/auth/Signup';
import { Badge } from '@/components/ui/badge';

// Placeholder components
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 mt-20">
    <div className="w-20 h-20 bg-blue-50 text-primary rounded-3xl flex items-center justify-center mb-8 animate-pulse">
       <span className="text-4xl font-bold">!</span>
    </div>
    <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-500 mb-8 max-w-md text-center font-medium">We're finalizing our clinical protocols for this section. The expanded Care24 Enterprise platform is arriving shortly.</p>
    <a href="/" className="px-8 h-12 bg-primary text-white rounded-xl flex items-center font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Back to Ecosystem Hub</a>
  </div>
);

import { ProtectedRoute } from './components/ProtectedRoute';
import { SetupPatientProfilePage } from './pages/SetupPatientProfile';
import { SetupCaregiverProfilePage } from './pages/SetupCaregiverProfile';
import { ProfileGuard } from './components/ProfileGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="caregivers" element={<CaregiversPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          
          {/* Onboarding Profiles */}
          <Route 
            path="setup-patient-profile" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <SetupPatientProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="setup-caregiver-profile" 
            element={
              <ProtectedRoute allowedRoles={['CAREGIVER']}>
                <SetupCaregiverProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Dashboards */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <ProfileGuard>
                  <UserDashboard />
                </ProfileGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="dashboard/caregiver" 
            element={
              <ProtectedRoute allowedRoles={['CAREGIVER']}>
                <ProfileGuard>
                  <CaregiverDashboard />
                </ProfileGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


