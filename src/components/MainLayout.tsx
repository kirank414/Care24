import { Outlet } from 'react-router-dom';
import { Navbar } from './common/Navbar';
import { Footer } from './common/Footer';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <Navbar />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <Outlet />
        <Footer />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
