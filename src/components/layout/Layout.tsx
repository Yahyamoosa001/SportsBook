
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContextV2';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {!isLandingPage && <Navbar />}
      <main className={isLandingPage ? '' : 'pt-16'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
