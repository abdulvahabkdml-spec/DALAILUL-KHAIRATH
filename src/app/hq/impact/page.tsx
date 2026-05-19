'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatedCounter, Sparkline, StatusBadge } from '@/components/admin/AdminShared';

// ─── Extended Mock Data (Impact Focused) ───────────────────────────────────
const IMPACT_METRICS = [
  { key: 'phd_count',      label: 'PhD Graduates',       value: 48,   unit: '+', icon: '🎓', trend: +12, category: 'academic', lastUpdated: '2 days ago' },
  { key: 'doctors',        label: 'Medical Doctors',      value: 312,  unit: '+', icon: '🏥', trend: +8,  category: 'academic', lastUpdated: '1 week ago' },
  { key: 'huffaz',         label: 'Huffaz Produced',      value: 1840, unit: '+', icon: '📖', trend: +24, category: 'spiritual', lastUpdated: '3 hours ago' },
  { key: 'alumni',         label: 'Total Alumni',         value: 9200, unit: '+', icon: '👥', trend: +5,  category: 'community', lastUpdated: '1 month ago' },
  { key: 'scholarships',   label: 'Active Scholarships',  value: 240,  unit: '',  icon: '💰', trend: +3,  category: 'financial', lastUpdated: '5 days ago' },
  { key: 'publications',   label: 'Student Publications', value: 156,  unit: '',  icon: '📝', trend: +18, category: 'academic', lastUpdated: '12 hours ago' },
  { key: 'branches',       label: 'Global Branches',      value: 17,   unit: '',  icon: '🌍', trend: +2,  category: 'global', lastUpdated: '2 months ago' },
  { key: 'zakat_dist',     label: 'Zakat Distributed (PKR)', value: 42, unit: 'M', icon: '🤲', trend: +31, category: 'financial', lastUpdated: '1 day ago' },
  { key: 'volunteers',     label: 'Active Volunteers',    value: 850,  unit: '+', icon: '🤝', trend: +15, category: 'community', lastUpdated: '3 days ago' },
  { key: 'events',         label: 'Annual Events',        value: 124,  unit: '',  icon: '📅', trend: +10, category: 'community', lastUpdated: '2 weeks ago' },
  { key: 'books',          label: 'Library Volumes',      value: 25,   unit: 'k', icon: '📚', trend: +4,  category: 'academic', lastUpdated: '4 months ago' },
  { key: 'centers',        label: 'Research Centers',     value: 6,    unit: '',  icon: '🔬', trend: 0,   category: 'academic', lastUpdated: '6 months ago' },
];

/**
 * Impact Metrics Management Page
 */
export default function ImpactManagementPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [editingMetric, setEditingMetric] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMetric, setNewMetric] = useState({
    key: '',
    label: '',
    value: 0,
    unit: '',
    icon: '',
    category: 'academic',
    displayOrder: 0
  });

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/impact?admin=true');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      } else {
        setError(data.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError('Connection error fell through.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // ─── Update Logic ─────────────────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetric) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/impact?id=${editingMetric._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: editingMetric.value,
          label: editingMetric.label,
          unit: editingMetric.unit,
          icon: editingMetric.icon,
          category: editingMetric.category,
          displayOrder: editingMetric.displayOrder,
          isPublished: editingMetric.isPublished
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMetrics(prev => prev.map(m => m._id === data.data._id ? data.data : m));
        setEditingMetric(null);
      } else {
        const errorMsg = data.issues 
          ? Object.entries(data.issues.fieldErrors).map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`).join('\n')
          : data.error || 'Unknown error';
        alert('Update failed:\n' + errorMsg);
      }
    } catch (err) {
      alert('Network error while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMetric),
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(prev => [...prev, data.data]);
        setShowAddModal(false);
        setNewMetric({ key: '', label: '', value: 0, unit: '', icon: '', category: 'academic', displayOrder: 0 });
      } else {
        const errorMsg = data.issues 
          ? Object.entries(data.issues.fieldErrors).map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`).join('\n')
          : data.error || 'Unknown error';
        alert('Failed to create:\n' + errorMsg);
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to unpublish this metric?')) return;
    try {
      const res = await fetch(`/api/impact?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMetrics(prev => prev.map(m => m._id === id ? { ...m, isPublished: false } : m));
        alert('Metric unpublished from homepage.');
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filteredMetrics = filter === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === filter);

  const categories = ['all', ...Array.from(new Set(metrics.map(m => m.category)))];

  if (loading && metrics.length === 0) return <div className="dk-loading">Syncing with Central Registry...</div>;
  if (error) return <div className="dk-error-state">{error}</div>;

  return (
    <div className="dk-fade-up">
      {/* Page Header */}
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Impact Insights</h1>
          <p className="dk-page-subtitle">MANAGE INSTITUTIONAL METRICS & GLOBAL REACH DATA</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="dk-btn dk-btn-ghost" onClick={() => fetchMetrics()}>
            <span className="dk-btn-icon" style={{ fontFamily: 'Material Symbols Outlined' }}>refresh</span> Refresh
          </button>
          <button className="dk-btn dk-btn-primary" onClick={() => setShowAddModal(true)}>
            <span className="dk-btn-icon" style={{ fontFamily: 'Material Symbols Outlined' }}>add_chart</span> Add Metric
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`dk-btn ${filter === cat ? 'dk-btn-primary' : 'dk-btn-ghost'}`}
            style={{ 
              padding: '6px 14px', 
              fontSize: 12, 
              textTransform: 'capitalize',
              boxShadow: filter === cat ? 'var(--shadow-glow)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="dk-stats-grid">
        {filteredMetrics.map((stat) => (
          <div key={stat._id} className="dk-stat-card" style={{ cursor: 'pointer', opacity: stat.isPublished ? 1 : 0.6 }}>
            <div className="dk-stat-header">
              <div className="dk-stat-icon">{stat.icon || '📈'}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {!stat.isPublished && <span className="dk-badge badge-draft">Hidden</span>}
                <div className="dk-stat-trend" style={{ color: 'var(--emerald-400)', background: 'rgba(52,211,153,0.1)' }}>
                  {stat.displayOrder || 0}
                </div>
              </div>
            </div>
            <div className="dk-stat-value" onClick={() => setEditingMetric({...stat})}>
              <AnimatedCounter target={stat.value} />
              <span className="dk-stat-unit">{stat.unit}</span>
            </div>
            <div className="dk-stat-label" onClick={() => setEditingMetric({...stat})}>{stat.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
               <Sparkline trend={10} />
               <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setEditingMetric({...stat})} style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                  </button>
                  <button onClick={() => handleDelete(stat._id)} style={{ background: 'none', border: 'none', color: 'var(--rose-400)', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMetric && (
        <div className="dk-modal-backdrop" onClick={() => setEditingMetric(null)}>
          <div className="dk-modal" onClick={e => e.stopPropagation()}>
            <div className="dk-modal-header">
              <h2 className="dk-modal-title">Update {editingMetric.label}</h2>
              <button className="dk-modal-close" onClick={() => setEditingMetric(null)}>close</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="dk-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dk-input-group">
                    <label>Label</label>
                    <input type="text" value={editingMetric.label} onChange={e => setEditingMetric({...editingMetric, label: e.target.value})} required />
                  </div>
                  <div className="dk-input-group">
                    <label>Value</label>
                    <input type="number" value={editingMetric.value} onChange={e => setEditingMetric({...editingMetric, value: Number(e.target.value)})} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dk-input-group">
                    <label>Unit (e.g. +, %, K)</label>
                    <input type="text" value={editingMetric.unit} onChange={e => setEditingMetric({...editingMetric, unit: e.target.value})} />
                  </div>
                  <div className="dk-input-group">
                    <label>Category</label>
                    <select value={editingMetric.category} onChange={e => setEditingMetric({...editingMetric, category: e.target.value})} className="dk-select">
                      <option value="academic">Academic</option>
                      <option value="community">Community</option>
                      <option value="spiritual">Spiritual</option>
                      <option value="global">Global</option>
                      <option value="financial">Financial</option>
                      <option value="operational">Operational</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dk-input-group">
                     <label>Icon (Emoji)</label>
                     <input type="text" value={editingMetric.icon || ''} onChange={e => setEditingMetric({...editingMetric, icon: e.target.value})} placeholder="📈" />
                  </div>
                  <div className="dk-input-group">
                    <label>Display Order</label>
                    <input type="number" value={editingMetric.displayOrder || 0} onChange={e => setEditingMetric({...editingMetric, displayOrder: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="dk-input-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="checkbox" checked={editingMetric.isPublished} onChange={e => setEditingMetric({...editingMetric, isPublished: e.target.checked})} style={{ width: 'auto' }} />
                  <label style={{ marginBottom: 0 }}>Show on homepage</label>
                </div>
              </div>
              <div className="dk-modal-footer">
                <button type="button" className="dk-btn dk-btn-ghost" onClick={() => setEditingMetric(null)}>Cancel</button>
                <button type="submit" className="dk-btn dk-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="dk-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="dk-modal" onClick={e => e.stopPropagation()}>
            <div className="dk-modal-header">
              <h2 className="dk-modal-title">Create New Metric</h2>
              <button className="dk-modal-close" onClick={() => setShowAddModal(false)}>close</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="dk-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dk-input-group">
                    <label>Label</label>
                    <input type="text" value={newMetric.label} onChange={e => setNewMetric({...newMetric, label: e.target.value})} placeholder="e.g. PhD Graduates" required />
                  </div>
                  <div className="dk-input-group">
                    <label>Value</label>
                    <input type="number" value={newMetric.value} onChange={e => setNewMetric({...newMetric, value: Number(e.target.value)})} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dk-input-group">
                    <label>Unit</label>
                    <input type="text" value={newMetric.unit} onChange={e => setNewMetric({...newMetric, unit: e.target.value})} placeholder="+" />
                  </div>
                  <div className="dk-input-group">
                    <label>Icon (Emoji)</label>
                    <input type="text" value={newMetric.icon} onChange={e => setNewMetric({...newMetric, icon: e.target.value})} placeholder="📈" />
                  </div>
                </div>
                <div className="dk-input-group">
                  <label>Category</label>
                  <select value={newMetric.category} onChange={e => setNewMetric({...newMetric, category: e.target.value})} className="dk-select">
                    <option value="academic">Academic</option>
                    <option value="community">Community</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="global">Global</option>
                    <option value="financial">Financial</option>
                    <option value="operational">Operational</option>
                  </select>
                </div>
              </div>
              <div className="dk-modal-footer">
                <button type="button" className="dk-btn dk-btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="dk-btn dk-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Creating...' : 'Create Metric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
