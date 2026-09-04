'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If on login or register, do not show sidebar or header
  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 antialiased">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isCollapsed}
        />

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-zinc-950/80">
          {children}
        </main>
      </div>
    </div>
  );
}
