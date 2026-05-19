'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
export function AnimatedCounter({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// ─── Sparkline (CSS-only bar chart) ─────────────────────────────────────────
export function Sparkline({ trend }: { trend: number }) {
  const bars = [40, 55, 45, 70, 60, 80, 75, 90, trend];
  const max = Math.max(...bars);
  return (
    <div className="dk-sparkline">
      {bars.map((v, i) => (
        <div
          key={i}
          className={`dk-spark-bar ${i === bars.length - 1 ? 'active' : ''}`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const map: Record<string, string> = {
    published: 'badge-published',
    review: 'badge-review',
    draft: 'badge-draft',
    archived: 'badge-archived',
    success: 'badge-published',
    warning: 'badge-review',
    error: 'badge-error',
    active: 'badge-published',
    inactive: 'badge-draft',
  };
  return <span className={`dk-badge ${map[status] || 'badge-draft'}`}>{label ?? status}</span>;
}

// ─── Admin Constants ────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: '/hq/dashboard',  label: 'Dashboard',         icon: 'dashboard'        },
  { href: '/hq/articles',   label: 'Featured Articles', icon: 'auto_awesome'     },
  { href: '/hq/content',    label: 'Website Content',   icon: 'web'              },
  { href: '/hq/news',       label: 'News Updates',      icon: 'newspaper'        },
  { href: '/hq/events',     label: 'Campus Events',     icon: 'event'            },
  { href: '/hq/academic',   label: 'Academic Records',  icon: 'school'           },
  { href: '/hq/media',      label: 'Media Library',     icon: 'perm_media'       },
  { href: '/hq/inquiries',  label: 'Contact Inquiries', icon: 'inbox'            },
  { href: '/hq/donations',  label: 'Donation Settings', icon: 'volunteer_activism'},
  { href: '/hq/contact',    label: 'Contact Settings',  icon: 'contact_support'  },
  { href: '/hq/impact',     label: 'Impact Metrics',    icon: 'bar_chart'        },
  { href: '/hq/audit',      label: 'System Audit',      icon: 'security'         },
];
