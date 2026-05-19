'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/admin/AdminShared';

/**
 * Academic Records Management Page
 */
export default function AcademicManagementPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academic?admin=true');
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.error || 'Failed to fetch records');
      }
    } catch (err) {
      setError('Connection error fell through.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    
    // Add default Cloudinary URLs if missing (for demo purposes)
    const finalPayload = {
      ...payload,
      isPublished: true,
      tags: (payload.tags as string)?.split(',').map(t => t.trim()),
    };

    try {
      const url = editingRecord 
        ? `/api/academic?id=${editingRecord._id}` 
        : '/api/academic';
      const method = editingRecord ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      const data = await res.json();
      if (data.success) {
        await fetchRecords();
        setIsModalOpen(false);
        setEditingRecord(null);
        alert(editingRecord ? 'Record updated!' : 'Record created!');
      } else {
        alert('Operation failed: ' + (data.error || 'Check fields'));
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This is a permanent administrative deletion.')) return;
    try {
      const res = await fetch(`/api/academic?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.filter(r => r._id !== id));
      } else {
        alert('Delete failed: ' + (data.error || 'Forbidden'));
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Academic Records</h1>
          <p className="dk-page-subtitle">MANAGE SCHOLARLY ARTICLES & ACHIEVEMENT POSTERS</p>
        </div>
        <button className="dk-btn dk-btn-primary" onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}>
          <span className="dk-btn-icon" style={{ fontFamily: 'Material Symbols Outlined' }}>add</span> New Record
        </button>
      </div>

      <div className="dk-card" style={{ padding: 20 }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving archival data...</div>
        ) : error ? (
          <div style={{ padding: '20px', color: 'var(--rose-400)' }}>{error}</div>
        ) : (
          <table className="dk-log-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(rec => (
                <tr key={rec._id} className="dk-log-row">
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{rec.title}</td>
                  <td>{rec.authorName}</td>
                  <td><span style={{ textTransform: 'capitalize' }}>{rec.type.replace('_', ' ')}</span></td>
                  <td><StatusBadge status={rec.status} /></td>
                  <td style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{new Date(rec.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="dk-nav-icon" style={{ color: 'var(--gold-400)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { setEditingRecord(rec); setIsModalOpen(true); }}>edit</button>
                      <button className="dk-nav-icon" style={{ color: 'var(--rose-400)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(rec._id)}>delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="dk-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="dk-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="dk-modal-header">
              <h2 className="dk-modal-title">{editingRecord ? 'Edit' : 'Add'} Record</h2>
              <button className="dk-modal-close" onClick={() => setIsModalOpen(false)}>close</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="dk-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="dk-input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Record Title</label>
                    <input name="title" defaultValue={editingRecord?.title} required placeholder="Title of the article or poster" />
                  </div>
                  <div className="dk-input-group">
                    <label>Author / Student Name</label>
                    <input name="authorName" defaultValue={editingRecord?.authorName} required />
                  </div>
                  <div className="dk-input-group">
                    <label>Type</label>
                    <select name="type" defaultValue={editingRecord?.type || 'article'} className="dk-input" style={{ width: '100%', height: 46 }}>
                      <option value="article">Article</option>
                      <option value="poster">Poster</option>
                      <option value="thesis">Thesis</option>
                      <option value="research_paper">Research Paper</option>
                    </select>
                  </div>
                  <div className="dk-input-group">
                    <label>Batch (Optional)</label>
                    <input name="authorBatch" defaultValue={editingRecord?.authorBatch} placeholder="e.g. 2024" />
                  </div>
                  <div className="dk-input-group">
                    <label>Status</label>
                    <select name="status" defaultValue={editingRecord?.status || 'draft'} className="dk-input" style={{ width: '100%', height: 46 }}>
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="dk-input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Abstract / Description</label>
                    <textarea name="abstract" defaultValue={editingRecord?.abstract} rows={3} placeholder="Brief summary of the work..." />
                  </div>
                  <div className="dk-input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Main Media URL (Remote or Local)</label>
                    <input name="imageUrl" defaultValue={editingRecord?.imageUrl} placeholder="/api/media/serve/..." />
                  </div>
                </div>
              </div>
              <div className="dk-modal-footer">
                <button type="button" className="dk-btn dk-btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="dk-btn dk-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Processing...' : (editingRecord ? 'Save Changes' : 'Create Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
