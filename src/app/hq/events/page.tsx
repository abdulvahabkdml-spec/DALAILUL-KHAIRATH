'use client';

import { useState, useEffect } from 'react';

/**
 * Event Management Page — CRUD for Campus Calendar.
 */
export default function EventManagementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Auto-extract day and month from the date field for the UI
    const dateObj = new Date(editingItem.date);
    const d = dateObj.getUTCDate().toString().padStart(2, '0');
    const m = dateObj.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    
    const payload = { ...editingItem, d, m };
    const method = editingItem._id ? 'PUT' : 'POST';
    const url = editingItem._id ? `/api/events?id=${editingItem._id}` : '/api/events';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchItems();
      } else {
        const data = await res.json();
        const errorMsg = data.issues 
          ? Object.entries(data.issues.fieldErrors).map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`).join('\n')
          : data.error || 'Unknown error saving event';
        alert('Update failed:\n' + errorMsg);
      }
    } catch (err) {
      alert('Network error while saving event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) return <div className="dk-loading">Loading campus calendar...</div>;

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Campus Events</h1>
          <p className="dk-page-subtitle">SCHEDULE AND MONITOR INSTITUTIONAL EVENTS</p>
        </div>
        <button className="dk-btn dk-btn-primary" onClick={() => setEditingItem({ t: '', l: '', time: '', active: false, date: new Date().toISOString().substring(0, 10) })}>
          <span className="dk-btn-icon">event_note</span> Create New Event
        </button>
      </div>

      <div className="dk-card">
        <div className="dk-card-header">
          <div className="dk-card-title">Institutional Calendar</div>
        </div>
        <div className="dk-card-body">
          <table className="dk-log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event Title</th>
                <th>Location & Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="dk-log-row">
                  <td>
                    <div style={{ background: 'var(--navy-750)', padding: '8px', borderRadius: 8, textAlign: 'center', width: 45 }}>
                      <div style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: 16 }}>{item.d}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }}>{item.m}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.t}</div>
                    <div style={{ fontSize: 10, color: 'var(--gold-500)', marginTop: 2 }}>REF: {item._id.substring(18)}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="dk-btn-icon" style={{ fontSize: 14 }}>location_on</span>
                      <span>{item.l}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      <span className="dk-btn-icon" style={{ fontSize: 12 }}>schedule</span>
                      <span>{item.time}</span>
                    </div>
                  </td>
                  <td>
                    {item.active ? (
                      <span className="dk-badge badge-published">LIVE</span>
                    ) : (
                      <span className="dk-badge badge-draft">UPCOMING</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="dk-btn-ghost" style={{ padding: '4px 8px', borderRadius: 4 }} onClick={() => setEditingItem(item)}>
                        <span className="dk-btn-icon" style={{ fontSize: 14 }}>edit</span>
                      </button>
                      <button className="dk-btn-ghost" style={{ padding: '4px 8px', borderRadius: 4, color: 'var(--rose-400)' }} onClick={() => handleDelete(item._id)}>
                        <span className="dk-btn-icon" style={{ fontSize: 14 }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="dk-modal-backdrop" onClick={() => setEditingItem(null)}>
          <div className="dk-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div className="dk-modal-header">
              <h2 className="dk-modal-title">{editingItem._id ? 'Update Event' : 'Schedule Event'}</h2>
              <button className="dk-modal-close" onClick={() => setEditingItem(null)}>close</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="dk-modal-body">
                <div className="dk-input-group">
                  <label>Event Date</label>
                  <input type="date" value={editingItem.date ? (typeof editingItem.date === 'string' && editingItem.date.length >= 10 ? editingItem.date.substring(0, 10) : new Date(editingItem.date).toISOString().substring(0, 10)) : ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} required />
                </div>
                <div className="dk-input-group">
                  <label>Title</label>
                  <input type="text" value={editingItem.t} onChange={e => setEditingItem({...editingItem, t: e.target.value})} placeholder="e.g., Symposium on Medieval Logic" required />
                </div>
                <div className="dk-input-group">
                  <label>Location</label>
                  <input type="text" value={editingItem.l} onChange={e => setEditingItem({...editingItem, l: e.target.value})} placeholder="e.g., Main Auditorium" required />
                </div>
                <div className="dk-input-group">
                  <label>Time Range</label>
                  <input type="text" value={editingItem.time} onChange={e => setEditingItem({...editingItem, time: e.target.value})} placeholder="e.g., 09:00 AM - 04:00 PM" required />
                </div>
                <div className="dk-input-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="checkbox" checked={editingItem.active} onChange={e => setEditingItem({...editingItem, active: e.target.checked})} style={{ width: 'auto' }} />
                  <label style={{ marginBottom: 0 }}>Mark as "LIVE" event</label>
                </div>
              </div>
              <div className="dk-modal-footer">
                <button type="button" className="dk-btn dk-btn-ghost" onClick={() => setEditingItem(null)}>Cancel</button>
                <button type="submit" className="dk-btn dk-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingItem._id ? 'Update' : 'Schedule')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
