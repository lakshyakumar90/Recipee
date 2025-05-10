import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Main layout component for the application
 * Includes the navbar, main content area, and footer
 */
const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
