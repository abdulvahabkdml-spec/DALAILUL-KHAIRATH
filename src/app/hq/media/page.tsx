'use client';

import { useState, useRef, useEffect } from 'react';
import { StatusBadge } from '@/components/admin/AdminShared';

/**
 * Media Library Management Page
 * Handles cloud media uploads to Cloudinary and tracks metadata in MongoDB.
 */
export default function MediaLibraryPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media from MongoDB on mount
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/media');
        if (!res.ok) throw new Error('Failed to fetch media');
        const data = await res.json();
        setFiles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general'); // Could be a dropdown in the future

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/media/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const newItem = response.data;
          setFiles(prev => [newItem, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            setError(`Upload failed: ${errorData.error || xhr.statusText}`);
          } catch {
            setError(`Upload failed: ${xhr.statusText}`);
          }
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError('Network error during upload.');
        setIsUploading(false);
      };

      xhr.send(formData);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this asset?')) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Media Library</h1>
          <p className="dk-page-subtitle">SECURE CLOUD STORAGE FOR INSTITUTIONAL ASSETS</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleUpload}
            accept="image/*,.pdf,.doc,.docx"
          />
          <button 
            className="dk-btn dk-btn-primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <span className="dk-btn-icon" style={{ fontFamily: 'Material Symbols Outlined' }}>upload</span>
            {isUploading ? `Uploading ${uploadProgress}%` : 'Upload New Media'}
          </button>
        </div>
      </div>

      {error && (
        <div className="dk-error-banner" style={{ marginBottom: 20, padding: 15, background: 'rgba(244,63,94,0.1)', border: '1px solid var(--rose-500)', borderRadius: 8, color: 'var(--rose-400)', fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Error:</span> {error}
          <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {isUploading && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--gold-400)' }}>Processing Upload...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--gold-500)', transition: 'width 0.2s ease' }} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading media...</div>
      ) : files.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📁</div>
          <div style={{ color: 'var(--text-muted)' }}>No media found. Upload your first asset to get started.</div>
        </div>
      ) : (
        <div className="dk-media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {files.map((file) => (
            <div key={file._id} className="dk-stat-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/9', background: 'var(--navy-900)', position: 'relative' }}>
                {file.type === 'image' || file.type === 'video' ? (
                  <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📄</div>
                )}
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <StatusBadge status="active" />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px 10px 5px', fontSize: 10, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {file.category}
                </div>
              </div>
              <div style={{ padding: 15 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.name}>
                  {file.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{formatSize(file.size)}</span>
                  <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 4 }}>
                  <button className="dk-btn dk-btn-ghost" style={{ flex: 1, padding: '6px 0', fontSize: 10 }} onClick={() => window.open(file.url, '_blank')}>View</button>
                  <button 
                    className="dk-btn dk-btn-ghost" 
                    style={{ flex: 1, padding: '6px 0', fontSize: 10, color: 'var(--gold-400)' }} 
                    onClick={() => {
                        navigator.clipboard.writeText(file.url);
                        // Using a simple visual indicator
                        const el = document.getElementById(`copy-btn-${file._id}`);
                        if (el) {
                            const orig = el.innerText;
                            el.innerText = 'Copied!';
                            setTimeout(() => el.innerText = orig, 1500);
                        }
                    }}
                    id={`copy-btn-${file._id}`}
                  >
                    Copy URL
                  </button>
                  <button 
                    className="dk-btn dk-btn-ghost" 
                    style={{ flex: 1, padding: '6px 0', fontSize: 10, color: 'var(--rose-400)' }}
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
