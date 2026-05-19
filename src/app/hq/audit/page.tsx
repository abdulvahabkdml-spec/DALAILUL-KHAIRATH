'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/admin/AdminShared';

/**
 * Audit Log Viewer Page
 * Provides a read-only, paginated view of all administrative actions.
 */
export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/log?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setTotal(data.pagination.total);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Audit Trail</h1>
          <p className="dk-page-subtitle">IMMUTABLE SYSTEM LOG OF ALL ADMINISTRATIVE ACTIONS</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="dk-btn dk-btn-ghost" onClick={() => fetchLogs()}>
             <span className="dk-btn-icon" style={{ fontFamily: 'Material Symbols Outlined' }}>refresh</span>
          </button>
        </div>
      </div>

      <div className="dk-card" style={{ padding: 20 }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Decrypting logs...</div>
        ) : error ? (
          <div style={{ padding: '20px', color: 'var(--rose-400)' }}>{error}</div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="dk-log-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log._id} className="dk-log-row">
                      <td style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="dk-log-actor">{log.actorName}</td>
                      <td>
                        <span className={`dk-log-action${log.statusCode >= 400 ? ' warning' : ''}`}>
                          {log.action.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, opacity: 0.8 }}>{log.resource}</td>
                      <td className="dk-log-detail" title={log.details}>{log.details}</td>
                      <td><StatusBadge status={log.statusCode < 400 ? 'success' : 'warning'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Showing {logs.length} of {total} entries
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className="dk-btn dk-btn-ghost" 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)}
                  style={{ padding: '5px 15px', fontSize: 12 }}
                >
                  Previous
                </button>
                <button 
                  className="dk-btn dk-btn-ghost" 
                  disabled={logs.length < 20} 
                  onClick={() => setPage(page + 1)}
                  style={{ padding: '5px 15px', fontSize: 12 }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
