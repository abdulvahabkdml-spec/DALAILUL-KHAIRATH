'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Types ────────────────────────────────────────────────────────────── */
interface FormData {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  whyDonateText: string;
  makeDifferenceHeading: string;
  makeDifferenceBody1: string;
  makeDifferenceBody2: string;
  qrCodeUrl: string;
  heroImageUrl: string;
}

/* ─── Mini Image Upload Widget ─────────────────────────────────────────── */
function ImageUploader({
  label,
  hint,
  value,
  onUploaded,
  previewSize = 96,
  folder = 'media',
}: {
  label: string;
  hint: string;
  value: string;
  onUploaded: (url: string) => void;
  previewSize?: number;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localErr, setLocalErr] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLocalErr('Please select an image file.');
      return;
    }
    setLocalErr('');
    setUploading(true);
    setProgress(10);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', folder);
      setProgress(40);

      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      const { data } = await res.json();
      setProgress(100);
      onUploaded(data.url);
    } catch (e: any) {
      setLocalErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0); }, 500);
    }
  };

  return (
    <div className="dk-input-group" style={{ marginBottom: 0 }}>
      <label style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        display: 'block',
        marginBottom: 8,
      }}>{label}</label>

      {/* URL text input */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <input
          type="url"
          className="dk-input"
          placeholder="https://res.cloudinary.com/..."
          value={value}
          onChange={e => onUploaded(e.target.value)}
          style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 13 }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="dk-btn dk-btn-ghost"
          style={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: 12 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
          {uploading ? `${progress}%` : 'Upload'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />

      {/* Progress bar */}
      {uploading && (
        <div style={{ height: 3, background: 'var(--glass-border)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--gold-500), var(--gold-300))',
            transition: 'width 0.3s ease',
            borderRadius: 99,
          }} />
        </div>
      )}

      {/* Error */}
      {localErr && (
        <p style={{ fontSize: 11, color: 'var(--rose-400)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
          {localErr}
        </p>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 8,
          padding: '10px 14px',
          background: 'rgba(203,161,83,0.05)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <img
            src={value}
            alt="preview"
            style={{
              width: previewSize,
              height: previewSize,
              objectFit: 'contain',
              borderRadius: 8,
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.03)',
            }}
          />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
              Preview
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{hint}</div>
            <button
              type="button"
              onClick={() => onUploaded('')}
              style={{
                marginTop: 8,
                fontSize: 11,
                color: 'var(--rose-400)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>delete</span>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Section Divider ──────────────────────────────────────────────────── */
function SectionLabel({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 20,
      paddingBottom: 14,
      borderBottom: '1px solid var(--glass-border)',
    }}>
      <div style={{
        width: 32, height: 32,
        background: 'rgba(203,161,83,0.1)',
        border: '1px solid var(--glass-border)',
        borderRadius: 8,
        display: 'grid',
        placeItems: 'center',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--gold-500)' }}>{icon}</span>
      </div>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
      }}>{title}</span>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function AdminDonationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);
  const [error,    setError]       = useState<string | null>(null);
  const [success,  setSuccess]     = useState(false);

  const [formData, setFormData] = useState<FormData>({
    bankName:       '',
    accountTitle:   '',
    accountNumber:  '',
    ifscCode:       '',
    upiId:          '',
    whyDonateText:  '',
    makeDifferenceHeading: '',
    makeDifferenceBody1: '',
    makeDifferenceBody2: '',
    qrCodeUrl:      '',
    heroImageUrl:   '',
  });

  /* Fetch on mount */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings/donations');
        if (!res.ok) throw new Error('Failed to fetch donation settings');
        const data = await res.json();
        setFormData({
          bankName:      data.bankName      || '',
          accountTitle:  data.accountTitle  || '',
          accountNumber: data.accountNumber || '',
          ifscCode:      data.ifscCode      || '',
          upiId:         data.upiId         || '',
          whyDonateText: data.whyDonateText || '',
          makeDifferenceHeading: data.makeDifferenceHeading || 'Better lives through better giving.',
          makeDifferenceBody1: data.makeDifferenceBody1 || 'Charity and relief activities...',
          makeDifferenceBody2: data.makeDifferenceBody2 || 'You can transfer directly to our bank account...',
          qrCodeUrl:     data.qrCodeUrl     || '',
          heroImageUrl:  data.heroImageUrl  || '',
        });
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const setUrl = (key: keyof FormData) => (url: string) =>
    setFormData(prev => ({ ...prev, [key]: url }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/settings/donations', {
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
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="dk-loading">
      <div className="dk-loader-ring"><div /><div /><div /></div>
      <p>LOADING DONATION SETTINGS</p>
    </div>
  );

  return (
    <div className="dk-fade-up">

      {/* ── Page Header ── */}
      <div className="dk-page-header">
        <div>
          <h1 className="dk-page-title">Donation Settings</h1>
          <p className="dk-page-subtitle">BANK DETAILS · PUBLIC CONTENT · MEDIA</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/donate" target="_blank" className="dk-btn dk-btn-ghost">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
            Preview Page
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="dk-btn dk-btn-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
            {isSaving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div style={{
          marginBottom: 20, padding: '14px 18px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid var(--rose-400)',
          borderRadius: 'var(--radius-md)', color: 'var(--rose-400)',
          fontSize: 13, display: 'flex', gap: 10, alignItems: 'center',
          fontFamily: 'var(--font-body)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          marginBottom: 20, padding: '14px 18px',
          background: 'rgba(52,211,153,0.08)', border: '1px solid var(--emerald-400)',
          borderRadius: 'var(--radius-md)', color: 'var(--emerald-400)',
          fontSize: 13, display: 'flex', gap: 10, alignItems: 'center',
          fontFamily: 'var(--font-body)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
          Changes saved and live on the public donation page.
        </div>
      )}

      {/* ── Form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

        {/* ── 1. Bank Details ── */}
        <div className="dk-card">
          <div className="dk-card-body">
            <SectionLabel icon="account_balance" title="Bank Routing Details" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

              <div className="dk-input-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                <label>Account Title (Name on Account)</label>
                <input
                  type="text" name="accountTitle"
                  value={formData.accountTitle} onChange={setField}
                  className="dk-input"
                  placeholder="e.g. Dalailul Khairath Trust"
                  required
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div className="dk-input-group" style={{ marginBottom: 0 }}>
                <label>Account Number</label>
                <input
                  type="text" name="accountNumber"
                  value={formData.accountNumber} onChange={setField}
                  className="dk-input"
                  placeholder="e.g. 1858 2010 0001 41"
                  required
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}
                />
              </div>

              <div className="dk-input-group" style={{ marginBottom: 0 }}>
                <label>Bank Name</label>
                <input
                  type="text" name="bankName"
                  value={formData.bankName} onChange={setField}
                  className="dk-input"
                  placeholder="e.g. Canara Bank"
                  required
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>

              <div className="dk-input-group" style={{ marginBottom: 0 }}>
                <label>IFSC Code</label>
                <input
                  type="text" name="ifscCode"
                  value={formData.ifscCode} onChange={setField}
                  className="dk-input"
                  placeholder="e.g. CNRB0001858"
                  required
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', fontWeight: 700 }}
                />
              </div>

              <div className="dk-input-group" style={{ marginBottom: 0 }}>
                <label>UPI ID</label>
                <input
                  type="text" name="upiId"
                  value={formData.upiId} onChange={setField}
                  className="dk-input"
                  placeholder="e.g. dalaildk@upi"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

            </div>
          </div>
        </div>

        {/* ── 2. Images ── */}
        <div className="dk-card">
          <div className="dk-card-body">
            <SectionLabel icon="image" title="Photos & Media" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

              <ImageUploader
                label="QR Code Image"
                hint="Shown in the 'Scan QR' modal for UPI payments."
                value={formData.qrCodeUrl}
                onUploaded={setUrl('qrCodeUrl')}
                previewSize={120}
                folder="media"
              />

              <ImageUploader
                label="Hero / Giving Section Photo"
                hint="Left-column image on the donate page."
                value={formData.heroImageUrl}
                onUploaded={setUrl('heroImageUrl')}
                previewSize={120}
                folder="media"
              />

            </div>
          </div>
        </div>

        {/* ── 3. Public Content ── */}
        <div className="dk-card">
          <div className="dk-card-body">
            <SectionLabel icon="edit_note" title="Public Facing Text" />

            <div className="dk-input-group" style={{ marginBottom: 0 }}>
              <label>&quot;Why Donate to Us?&quot; — Displayed below the hero headline</label>
              <textarea
                name="whyDonateText"
                value={formData.whyDonateText}
                onChange={setField}
                className="dk-input"
                rows={4}
                style={{
                  resize: 'vertical',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
                placeholder="e.g. The believer's shade on the Day of Resurrection will be their charity..."
                required
              />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                Displayed in italics under the &quot;Why Donate to Us?&quot; heading on the public page.
              </p>
            </div>
            
            <div className="dk-input-group" style={{ marginBottom: 0, marginTop: 32 }}>
              <SectionLabel icon="article" title="Editorial Giving Section" />
              <label>&quot;Make a Difference&quot; Heading</label>
              <input
                type="text"
                name="makeDifferenceHeading"
                value={formData.makeDifferenceHeading}
                onChange={setField}
                className="dk-input"
                placeholder="Better lives through better giving."
                style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}
              />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                Hint: You can use HTML like &lt;em&gt;better giving.&lt;/em&gt; or &lt;br /&gt;
              </p>
            </div>
            
            <div className="dk-input-group" style={{ marginBottom: 0, marginTop: 20 }}>
              <label>Editorial Body Paragraph 1</label>
              <textarea
                name="makeDifferenceBody1"
                value={formData.makeDifferenceBody1}
                onChange={setField}
                className="dk-input"
                rows={4}
                style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.6 }}
              />
            </div>
            
            <div className="dk-input-group" style={{ marginBottom: 0, marginTop: 20 }}>
              <label>Editorial Body Paragraph 2</label>
              <textarea
                name="makeDifferenceBody2"
                value={formData.makeDifferenceBody2}
                onChange={setField}
                className="dk-input"
                rows={4}
                style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.6 }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
