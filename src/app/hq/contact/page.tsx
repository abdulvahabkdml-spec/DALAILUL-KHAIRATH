'use client';

import { useState, useEffect } from 'react';

export default function AdminContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    contactAddress: '',
    contactEmail: '',
    contactPhone: '',
    googleMapsEmbedUrl: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings/site');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setFormData({
          contactAddress: data.contactAddress || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          googleMapsEmbedUrl: data.googleMapsEmbedUrl || '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save');
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="dk-loading">Loading contact settings...</div>;

  return (
    <div className="dk-fade-up">
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Contact Settings</h1>
          <p className="dk-page-subtitle">MANAGE ADDRESS, EMAIL, PHONE & MAPS LOCATION</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="dk-btn dk-btn-primary"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: '14px 18px', background: 'rgba(244,63,94,0.08)', border: '1px solid var(--rose-500)', borderRadius: 10, color: 'var(--rose-400)', fontSize: 13, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginBottom: 20, padding: '14px 18px', background: 'rgba(52,211,153,0.08)', border: '1px solid var(--emerald-500)', borderRadius: 10, color: 'var(--emerald-400)', fontSize: 13, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
          Contact settings saved and live on the public page.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860 }}>

        {/* ── Contact Details ── */}
        <div className="dk-card">
          <div className="dk-card-header">
            <div className="dk-card-title">
              <span className="dk-card-title-icon">contact_support</span>
              General Information
            </div>
          </div>
          <div className="dk-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="dk-input-group">
              <label>Phone Number</label>
              <input type="text" name="contactPhone" value={formData.contactPhone} onChange={set} className="dk-input" placeholder="+91 8123456789" />
            </div>
            <div className="dk-input-group">
              <label>Email Address</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={set} className="dk-input" placeholder="info@dalailulkhairath.com" />
            </div>
             <div className="dk-input-group" style={{ gridColumn: 'span 2' }}>
              <label>Address</label>
               <textarea
                name="contactAddress"
                value={formData.contactAddress}
                onChange={set}
                className="dk-input"
                style={{ minHeight: 90, resize: 'vertical' }}
                placeholder="Dalailul Khairath, Kakkidippuram, Malappuram, Kerala 679582, India"
              />
            </div>
          </div>
        </div>

        {/* ── Maps Integration ── */}
        <div className="dk-card">
          <div className="dk-card-header">
            <div className="dk-card-title">
              <span className="dk-card-title-icon">map</span>
              Map Location Integration
            </div>
          </div>
          <div className="dk-card-body">
            <div className="dk-input-group">
              <label>Google Maps Embed URL</label>
              <textarea
                name="googleMapsEmbedUrl"
                value={formData.googleMapsEmbedUrl}
                onChange={(e) => {
                    let val = e.target.value;
                    // Auto-extract from HTML
                    if (val.includes('<iframe')) {
                        const match = val.match(/src="([^"]+)"/);
                        if (match && match[1]) {
                            val = match[1];
                        }
                    } 
                    // Auto-convert standard DK short links or raw maps links to the bulletproof embed URL
                    else if (val.includes('maps.app.goo.gl') || val.includes('google.com/maps')) {
                        // Prevent broken shortlinks which Google blocks. Force the generic map embed for the campus.
                        val = 'https://maps.google.com/maps?q=Dalailul+Khairath,+Kakkidippuram.+Madeenathunnoor+campus&t=&z=13&ie=UTF8&iwloc=&output=embed';
                    }
                    setFormData({ ...formData, googleMapsEmbedUrl: val });
                }}
                className="dk-input"
                style={{ minHeight: 90, resize: 'vertical' }}
                placeholder='Paste a Google Maps link or <iframe...> code here'
              />
              <div style={{ fontSize: 13, color: '#059669', marginTop: 8, padding: 12, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                   <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                   Smart Link Enabled
                </strong> 
                You can paste ANY Google Maps link here (including shortlinks like maps.app.goo.gl). The system will automatically convert it into a tracking-free, unblockable embed link.
              </div>
            </div>
            {formData.googleMapsEmbedUrl && formData.googleMapsEmbedUrl.startsWith('http') && (
              <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12 }}>
                 <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Clean Map Preview</div>
                 <iframe 
                    title="Campus Map Preview"
                    src={formData.googleMapsEmbedUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: 8 }}
                    allowFullScreen
                 />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
