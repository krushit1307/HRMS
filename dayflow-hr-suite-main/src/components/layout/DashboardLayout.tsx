import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AnimatedBackground } from '@/components/effects/AnimatedBackground';
import { CursorGlow } from '@/components/effects/CursorGlow';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-background">
      <AnimatedBackground />
      <CursorGlow />
      
      <Sidebar />
      
      <div className="relative z-10 ml-64 transition-all duration-300">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
