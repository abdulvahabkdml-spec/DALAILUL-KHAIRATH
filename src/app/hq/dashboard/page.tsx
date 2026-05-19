'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * Admin Dashboard Page — Simplified "Command Center".
 */
export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Just a basic delay to simulate loading or check session
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dk-fade-up">
      {/* Page Header */}
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, Admin</h1>
          <p className="dk-page-subtitle">DALAILUL KHAIRATH — CONTROL PANEL</p>
        </div>
      </div>

      <div className="dk-simple-dashboard" style={{ marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6', marginBottom: '3rem' }}>
          This is your simplified command center. Use the options below to manage your institutional impact, donations, and website content.
        </p>

        <div className="dk-quick-grid">
          {/* Donation Management */}
          <Link href="/hq/donations" className="dk-quick-card">
            <div className="dk-quick-icon" style={{ background: 'rgba(203,161,83,0.1)', color: 'var(--gold-400)' }}>volunteer_activism</div>
            <div className="dk-quick-label">Donation Info</div>
            <div className="dk-quick-desc">Manage Bank Details, QR Codes, and &quot;Why Donation&quot; content.</div>
          </Link>

          {/* Metric Management */}
          <Link href="/hq/impact" className="dk-quick-card">
            <div className="dk-quick-icon" style={{ background: 'rgba(45,212,191,0.1)', color: 'var(--teal-400)' }}>bar_chart</div>
            <div className="dk-quick-label">Impact Metrics</div>
            <div className="dk-quick-desc">Edit institutional achievement counters shown on the main page.</div>
          </Link>

          {/* News Management */}
          <Link href="/hq/news" className="dk-quick-card">
            <div className="dk-quick-icon" style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--emerald-400)' }}>newspaper</div>
            <div className="dk-quick-label">News Updates</div>
            <div className="dk-quick-desc">Publish and manage campus news, academic reports, and announcements.</div>
          </Link>

          {/* Event Management */}
          <Link href="/hq/events" className="dk-quick-card">
            <div className="dk-quick-icon" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--rose-400)' }}>event_available</div>
            <div className="dk-quick-label">Upcoming Events</div>
            <div className="dk-quick-desc">Schedule new events and manage the live campus calendar.</div>
          </Link>

          {/* Content Settings */}
          <Link href="/hq/content" className="dk-quick-card">
            <div className="dk-quick-icon" style={{ background: 'rgba(251,191,36,0.1)', color: 'var(--amber-400)' }}>edit_note</div>
            <div className="dk-quick-label">Website Content</div>
            <div className="dk-quick-desc">Edit the main website text including the Hero Headline, Subtitle, and About section.</div>
          </Link>
        </div>

      </div>
    </div>
  );
}
