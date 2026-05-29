import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './common/Navbar';
import { Footer } from './common/Footer';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      // Force scroll behavior to auto during route change to prevent disorienting smooth scrolls
      mainRef.current.style.scrollBehavior = 'auto';
      mainRef.current.scrollTop = 0;
      mainRef.current.style.scrollBehavior = 'smooth';
    }
  }, [pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Navbar />
      <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth">
        <Outlet />
        <Footer />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
