import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/src/store';
import { useCareStore } from '../stores/careStore';
import { Loader2 } from 'lucide-react';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, role, isAuthenticated } = useAuthStore();
  const { patient, caregiver, fetchPatientMe, fetchCaregiverMe } = useCareStore();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !role) {
      setChecking(false);
      return;
    }

    const checkProfile = async () => {
      setChecking(true);
      try {
        if (role === 'USER') {
          await fetchPatientMe();
        } else if (role === 'CAREGIVER') {
          await fetchCaregiverMe();
        }
      } catch (err) {
        console.error("ProfileGuard check error:", err);
      } finally {
        setChecking(false);
      }
    };

    checkProfile();
  }, [role, isAuthenticated]);

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Profile Details...</p>
      </div>
    );
  }

  if (role === 'USER' && !patient) {
    if (location.pathname !== '/setup-patient-profile') {
      return <Navigate to="/setup-patient-profile" replace />;
    }
  }

  if (role === 'CAREGIVER' && !caregiver) {
    if (location.pathname !== '/setup-caregiver-profile') {
      return <Navigate to="/setup-caregiver-profile" replace />;
    }
  }

  return <>{children}</>;
}
