'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { NAV_LINKS } from './AdminShared';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A';

  return (
    <aside className={`dk-sidebar${isOpen ? '' : ' collapsed'}`}>
      <div className="dk-sidebar-logo">
        <div className="dk-logo-mark">DK</div>
        <div className="dk-logo-text">Dalailul<br />Khairath</div>
      </div>

      <nav className="dk-nav">
        <div className="dk-nav-section-label">Navigation</div>
        {NAV_LINKS.slice(0, 10).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`dk-nav-link${pathname === link.href ? ' active' : ''}`}
          >
            <span className="dk-nav-icon">{link.icon}</span>
            <span className="dk-nav-label">{link.label}</span>
          </Link>
        ))}
        <div className="dk-nav-section-label" style={{ marginTop: 12 }}>System</div>
        {NAV_LINKS.slice(10).map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`dk-nav-link${pathname === link.href ? ' active' : ''}`}
          >
            <span className="dk-nav-icon">{link.icon}</span>
            <span className="dk-nav-label">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="dk-sidebar-footer">
        <div className="dk-user-card">
          <div className="dk-user-avatar">{userInitial}</div>
          <div className="dk-user-info">
            <div className="dk-user-name">{session?.user?.name || 'Admin Khalid'}</div>
            <div className="dk-user-role">● {(session?.user?.role || 'ADMIN').toUpperCase()}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

