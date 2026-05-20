'use client';

import { useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import './admin-styles.css';

/**
 * Admin Layout — The "Command Center" shell.
 * Shares the sidebar, topbar, and design language across all /admin routes.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Session Security Check ──────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/hq') {
      router.push('/hq');
    }
  }, [status, pathname, router]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="dk-admin-loading">
        <div className="dk-loader-ring">
          <div></div><div></div><div></div><div></div>
        </div>
        <p>SECURE AUTHENTICATION IN PROGRESS...</p>
      </div>
    );
  }

  // Show login page without sidebar/topbar if we are specifically on /admin
  if (pathname === '/hq') {
    return <>{children}</>;
  }

  // If authenticated, show the full admin dashboard
  return (
    <div className="dk-admin-root">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[1500] backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1500, backdropFilter: 'blur(4px)' }}
        ></div>
      )}
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`dk-main${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        <Topbar 
          isSidebarOpen={sidebarOpen} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <div className="dk-content">
          {children}
        </div>
      </main>
    </div>
  );
}

