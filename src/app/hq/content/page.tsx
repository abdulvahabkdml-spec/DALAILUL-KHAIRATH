'use client';

import { useState, useEffect } from 'react';

/**
 * Website Content Settings — Manage Hero and About section text.
 */
export default function SiteContentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutTitle: '',
    aboutText: '',
    aboutImageUrl: '',
    founderName: '',
    founderTitle: '',
    founderQuote: '',
    founderText1: '',
    founderText2: '',
    founderImageUrl: '',
    articleSectionTitle: '',
    inkspireUrl: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/site');
        const data = await res.json();
        setFormData({
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          aboutTitle: data.aboutTitle || '',
          aboutText: data.aboutText || '',
          aboutImageUrl: data.aboutImageUrl || '',
          founderName: data.founderName || '',
          founderTitle: data.founderTitle || '',
          founderQuote: data.founderQuote || '',
          founderText1: data.founderText1 || '',
          founderText2: data.founderText2 || '',
          founderImageUrl: data.founderImageUrl || '',
          articleSectionTitle: data.articleSectionTitle || '',
          inkspireUrl: data.inkspireUrl || '',
        });
      } catch (err: any) {
        setError('Failed to load site content.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  if (isLoading) return <div className="dk-loading">Loading site content...</div>;

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Website Content</h1>
          <p className="dk-page-subtitle">EDIT MAIN HOMEPAGE HERO AND ABOUT SECTIONS</p>
        </div>
      </div>

      {success && (
        <div style={{ marginBottom: 20, padding: 15, background: 'rgba(52,211,153,0.1)', border: '1px solid var(--emerald-500)', borderRadius: 8, color: 'var(--emerald-400)', fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Success:</span> Content updated successfully.
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 20, padding: 15, background: 'rgba(244,63,94,0.1)', border: '1px solid var(--rose-500)', borderRadius: 8, color: 'var(--rose-400)', fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Error:</span> {error}
        </div>
      )}

      <form onSubmit={handleSave} className="dk-card" style={{ maxWidth: 800 }}>
        <div className="dk-card-header">
            <div className="dk-card-title">
               <span className="dk-card-title-icon">edit_note</span>
               Homepage Text Management
            </div>
        </div>
        
        <div className="dk-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Hero Section */}
          <div>
            <h3 style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 16, borderBottom: '1px solid var(--glass-border)', paddingBottom: 8 }}>Hero Section (Welcome)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="dk-label" style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Main Headline</label>
                <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="dk-input" style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px' }} />
              </div>
              <div>
                <label className="dk-label" style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Sub-headline Text</label>
                <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px', minHeight: '80px' }} />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 16, borderBottom: '1px solid var(--glass-border)', paddingBottom: 8 }}>About Us Section</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>About Title</label>
                <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Description Body</label>
                <textarea name="aboutText" value={formData.aboutText} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px', minHeight: '120px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Side Image URL</label>
                <input type="text" name="aboutImageUrl" value={formData.aboutImageUrl} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* Founder Section */}
          <div>
            <h3 style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 16, borderBottom: '1px solid var(--glass-border)', paddingBottom: 8 }}>Founder Section</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Founder Name</label>
                <input type="text" name="founderName" value={formData.founderName} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Founder Title</label>
                <input type="text" name="founderTitle" value={formData.founderTitle} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Top Quote / Welcoming Statement (Royal Violet)</label>
                <textarea name="founderText1" value={formData.founderText1} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px', minHeight: '80px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Main Message Body</label>
                <textarea name="founderText2" value={formData.founderText2} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px', minHeight: '80px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Portrait Image URL</label>
                <input type="text" name="founderImageUrl" value={formData.founderImageUrl} onChange={handleChange} style={{ width: '100%', background: 'var(--navy-750)', border: '1px solid var(--glass-border)', padding: '10px', color: 'white', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
            <button type="submit" disabled={isSaving} className="dk-btn dk-btn-primary">
              {isSaving ? 'Updating Content...' : 'Save Text Formatting'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
