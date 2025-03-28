import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { useLocation } from 'wouter';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [location] = useLocation();
  const showBottomNav = !location.includes('/auth');
  
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-grow pb-16">
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
