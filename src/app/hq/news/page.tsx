'use client';

import { useState, useEffect } from 'react';

/**
 * News Management Page — CRUD for Campus Updates.
 */
export default function NewsManagementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch news');
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
    const method = editingItem._id ? 'PUT' : 'POST';
    const url = editingItem._id ? `/api/news?id=${editingItem._id}` : '/api/news';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchItems();
      } else {
        const data = await res.json();
        const errorMsg = data.issues 
          ? Object.entries(data.issues.fieldErrors).map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`).join('\n')
          : data.error || 'Unknown error saving news';
        alert('Update failed:\n' + errorMsg);
      }
    } catch (err) {
      alert('Network error while saving news item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news update?')) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (loading) return <div className="dk-loading">Syncing news archive...</div>;

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">News Updates</h1>
          <p className="dk-page-subtitle">MANAGE CAMPUS JOURNAL AND PRESS RELEASES</p>
        </div>
        <button className="dk-btn dk-btn-primary" onClick={() => setEditingItem({ type: 'Campus News', title: '', desc: '', img: '', date: new Date().toISOString().substring(0, 10) })}>
          <span className="dk-btn-icon">add</span> Add New Article
        </button>
      </div>

      <div className="dk-card">
        <div className="dk-card-header">
          <div className="dk-card-title">Archive List</div>
        </div>
        <div className="dk-card-body">
          <table className="dk-log-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Title & Preview</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="dk-log-row">
                  <td><span className="dk-log-action">{item.type}</span></td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{item.desc.substring(0, 60)}...</div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
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
          <div className="dk-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="dk-modal-header">
              <h2 className="dk-modal-title">{editingItem._id ? 'Edit Article' : 'New Article'}</h2>
              <button className="dk-modal-close" onClick={() => setEditingItem(null)}>close</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="dk-modal-body">
                <div className="dk-input-group">
                  <label>Title</label>
                  <input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required />
                </div>
                <div className="dk-input-group">
                  <label>Category (Type)</label>
                  <input type="text" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} placeholder="e.g., Campus News" required />
                </div>
                <div className="dk-input-group">
                  <label>Image URL (Cloudinary Link)</label>
                  <input type="text" value={editingItem.img} onChange={e => setEditingItem({...editingItem, img: e.target.value})} required />
                </div>
                <div className="dk-input-group">
                  <label>Article Summary</label>
                  <textarea value={editingItem.desc} onChange={e => setEditingItem({...editingItem, desc: e.target.value})} rows={4} required />
                </div>
                <div className="dk-input-group">
                  <label>Publish Date</label>
                  <input type="date" value={editingItem.date ? (typeof editingItem.date === 'string' && editingItem.date.length >= 10 ? editingItem.date.substring(0, 10) : new Date(editingItem.date).toISOString().substring(0, 10)) : ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} required />
                </div>
              </div>
              <div className="dk-modal-footer">
                <button type="button" className="dk-btn dk-btn-ghost" onClick={() => setEditingItem(null)}>Cancel</button>
                <button type="submit" className="dk-btn dk-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingItem._id ? 'Update' : 'Publish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
