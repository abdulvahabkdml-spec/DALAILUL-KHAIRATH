'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/admin/AdminShared';

/**
 * Featured Articles Management Page
 * Redesigned to a Slot-Based Grid Manager for the homepage 1+6 layout.
 * Admin can select a specific slot and assign an article to it.
 */
export default function FeaturedArticlesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Array of exactly 7 slots
  const [articles, setArticles] = useState<any[]>(Array(7).fill({
    title: '', desc: '', img: '', author: '', tag: '', slug: '', url: '', isEmpty: true
  }));
  
  const [syncingIdx, setSyncingIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/site');
        const data = await res.json();
        
        if (data.featuredArticles && data.featuredArticles.length > 0) {
          const slots = Array(7).fill(null).map(() => ({
            title: '', desc: '', img: '', author: '', tag: '', slug: '', url: '', isEmpty: true
          }));
          
          // Map saved articles to slots. 
          // We assume order in DB corresponds to homepage slots.
          data.featuredArticles.forEach((art: any, i: number) => {
            if (i < 7) slots[i] = { ...art, isEmpty: false };
          });
          setArticles(slots);
        }
      } catch (err) {
        setError('Failed to load article settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSyncSlot = async (idx: number, url: string) => {
    if (!url) return;
    setSyncingIdx(idx);
    setError(null);
    try {
      const res = await fetch(`/api/fetch-article-meta?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch article metadata');

      const newArticles = [...articles];
      newArticles[idx] = { ...data, isEmpty: false };
      setArticles(newArticles);
    } catch (err: any) {
      setError(`Slot ${idx + 1}: ${err.message}`);
    } finally {
      setSyncingIdx(null);
    }
  };

  const handleClearSlot = (idx: number) => {
    const newArticles = [...articles];
    newArticles[idx] = { title: '', desc: '', img: '', author: '', tag: '', slug: '', url: '', isEmpty: true };
    setArticles(newArticles);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // We save the full array of 7 (even empty ones) to preserve slotting.
      // The homepage will filter out the ones where isEmpty is true.
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredArticles: articles }),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="dk-loading">Loading Articles Manager...</div>;

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Homepage Grid Manager</h1>
          <p className="dk-page-subtitle">ASSIGN ARTICLES TO SPECIFIC POSITIONS ON THE HOMEPAGE</p>
        </div>
        <div className="dk-page-actions">
           <button 
             onClick={handleSave} 
             disabled={isSaving} 
             className="dk-btn dk-btn-primary"
             style={{ background: 'var(--emerald-600)', borderColor: 'var(--emerald-500)' }}
           >
             <span className="material-symbols-outlined" style={{ fontSize: 18 }}>publish</span>
             {isSaving ? 'Syncing...' : 'Publish Grid Changes'}
           </button>
        </div>
      </div>

      {success && (
        <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--emerald-500)', borderRadius: 12, color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">check_circle</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Articles synced to slots! The homepage is now updated.</span>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--rose-500)', borderRadius: 12, color: 'var(--rose-400)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">error</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {/* Spotlight Slot */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
             <span className="material-symbols-outlined" style={{ color: 'var(--gold-400)' }}>grade</span>
             <h2 style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold-400)', letterSpacing: '0.1em', margin: 0 }}>FEATURED SPOTLIGHT (SLOT 1)</h2>
          </div>
          <SlotCard 
            idx={0} 
            article={articles[0]} 
            isSyncing={syncingIdx === 0} 
            onSync={handleSyncSlot} 
            onClear={handleClearSlot} 
            isLarge 
            slotName="FEATURED"
          />
        </section>

        {/* Grid Slots */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
             <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>grid_view</span>
             <h2 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', margin: 0 }}>SECONDARY GRID BOXES (SLOTS 2-7)</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SlotCard 
                key={i}
                idx={i} 
                article={articles[i]} 
                isSyncing={syncingIdx === i} 
                onSync={handleSyncSlot} 
                onClear={handleClearSlot} 
                slotName={`GRID BOX ${i}`}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

/**
 * Individual Slot Card Component
 */
function SlotCard({ idx, article, isSyncing, onSync, onClear, isLarge, slotName }: any) {
  const [urlInput, setUrlInput] = useState(article?.isEmpty ? '' : article?.url || '');
  const isEmpty = !article || article.isEmpty;

  return (
    <div className="dk-card" style={{ 
      border: isLarge ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--glass-border)',
      background: isLarge ? 'linear-gradient(145deg, rgba(212,175,55,0.05) 0%, rgba(10,14,35,1) 100%)' : 'var(--navy-800)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ padding: 20 }}>
        {!isEmpty ? (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 100, height: 75, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <img src={article.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: isLarge ? 'var(--gold-400)' : 'var(--text-muted)' }}>
                   {slotName}
                </span>
                {!isEmpty && <StatusBadge status="active" label="SYNCED" />}
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{article.title}</h4>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>By {article.author}</p>
            </div>
            <button 
              onClick={() => { setUrlInput(''); onClear(idx); }} 
              className="dk-icon-btn" 
              style={{ color: 'var(--rose-400)', background: 'rgba(244,63,94,0.05)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>backspace</span>
            </button>
          </div>
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px dashed var(--glass-border)' }}>
             <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
               {slotName} EMPTY
             </p>
          </div>
        )}

        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span className="material-symbols-outlined" style={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              fontSize: 16, 
              color: 'var(--text-muted)' 
            }}>link</span>
            <input 
              type="url" 
              placeholder="Paste Inkspire URL..." 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="dk-input" 
              style={{ width: '100%', paddingLeft: 38, fontSize: 12, height: 42 }} 
            />
          </div>
          <button 
            onClick={() => onSync(idx, urlInput)} 
            disabled={isSyncing || !urlInput}
            className="dk-btn"
            style={{ 
              background: isLarge ? 'var(--gold-600)' : 'var(--navy-700)',
              color: 'white',
              borderColor: isLarge ? 'var(--gold-500)' : 'var(--glass-border)',
              fontSize: 11,
              fontWeight: 700,
              padding: '0 20px',
              height: 42,
              textTransform: 'uppercase'
            }}
          >
            {isSyncing ? 'Fetching...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}
