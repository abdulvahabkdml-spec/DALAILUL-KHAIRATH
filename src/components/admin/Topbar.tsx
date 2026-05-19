'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface TopbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Topbar({ onToggleSidebar, isSidebarOpen }: TopbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const routeParts = pathname?.split('/').filter(Boolean) || [];

  return (
    <header className="dk-topbar">
      <div className="dk-topbar-left">
        <button
          className="dk-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? 'menu_open' : 'menu'}
        </button>
        <div className="dk-breadcrumb">
          {routeParts.slice(0, 3).map((part, index) => (
            <span key={part}>
              {index > 0 && ' / '}
              <span style={{ textTransform: 'capitalize' }}>{part.replace(/-/g, ' ')}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="dk-topbar-right">
        <div className="dk-search">
          <span className="dk-search-icon">search</span>
          <input
            type="search"
            placeholder="Search assets..."
            aria-label="Search admin panel"
          />
        </div>
        
        <div style={{ width: 1, height: 24, background: 'var(--glass-border)', margin: '0 8px' }} />

        <div className="dk-user-control">
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gold-400)', marginRight: 12, fontFamily: 'var(--font-mono)' }}>
            {session?.user?.name || 'ADMIN'}
          </span>
          <button 
            className="dk-topbar-btn" 
            style={{ color: 'var(--rose-400)' }}
            onClick={() => signOut({ callbackUrl: '/hq' })} 
            title="Secure Logout"
          >
            logout
          </button>
        </div>
        
        <span className="dk-time" style={{ marginLeft: 12 }}>{currentTime}</span>
      </div>
    </header>
  );
}

