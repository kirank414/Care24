import { Outlet } from 'react-router-dom';
import { Navbar } from './common/Navbar';
import { Footer } from './common/Footer';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
