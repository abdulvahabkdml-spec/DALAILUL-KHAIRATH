'use client';

import { useState, useEffect } from 'react';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/inquiries');
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus as any } : inq));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      
      setInquiries(prev => prev.filter(inq => inq._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'new': return { bg: 'rgba(52,211,153,0.1)', color: 'var(--emerald-400)' };
      case 'read': return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' };
      case 'replied': return { bg: 'rgba(59,130,246,0.1)', color: 'var(--blue-400)' };
      default: return { bg: 'transparent', color: 'white' };
    }
  };

  if (isLoading) return <div className="dk-loading">Loading inquiries...</div>;

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Contact Inquiries</h1>
          <p className="dk-page-subtitle">VIEW AND MANAGE MESSAGES FROM THE PUBLIC SITE</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ padding: '6px 12px', background: 'rgba(52,211,153,0.1)', color: 'var(--emerald-400)', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {inquiries.filter(i => i.status === 'new').length} New Messages
            </span>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: 15, background: 'rgba(244,63,94,0.1)', border: '1px solid var(--rose-500)', borderRadius: 8, color: 'var(--rose-400)', fontSize: 13 }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {inquiries.length === 0 ? (
          <div className="dk-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--text-muted)', marginBottom: 16 }}>inbox</span>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No inquiries have been received yet.</p>
          </div>
        ) : (
          inquiries.map((inq) => {
            const statusStyle = getStatusStyle(inq.status);
            return (
              <div key={inq._id} className="dk-card" style={{ position: 'relative', overflow: 'hidden' }}>
                {inq.status === 'new' && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--emerald-500)' }} />
                )}
                <div className="dk-card-body" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{inq.name}</h3>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: statusStyle.bg, color: statusStyle.color, fontWeight: 600, textTransform: 'uppercase' }}>
                            {inq.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>mail</span> <a href={`mailto:${inq.email}`} style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>{inq.email}</a></span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span> {new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 8 }}>
                       {inq.status !== 'read' && (
                           <button onClick={() => updateStatus(inq._id, 'read')} className="dk-btn" style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(255,255,255,0.05)' }}>
                             Mark as Read
                           </button>
                       )}
                       {inq.status !== 'replied' && (
                           <button onClick={() => updateStatus(inq._id, 'replied')} className="dk-btn" style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(59,130,246,0.1)', color: 'var(--blue-400)' }}>
                             Mark Replied
                           </button>
                       )}
                       <button onClick={() => deleteInquiry(inq._id)} className="dk-btn" style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(244,63,94,0.1)', color: 'var(--rose-400)' }}>
                         Delete
                       </button>
                    </div>
                  </div>
                  
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {inq.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
