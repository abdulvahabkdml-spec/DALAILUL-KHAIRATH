'use client';

import { useState } from 'react';
import styles from './donate.module.css';

export default function DonateClient({ settings }: { settings: any }) {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (val: string, key: string) => {
        navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const bankFields = [
        { label: 'Account Number', value: settings?.accountNumber || '—', key: 'acc', copyable: true, badge: false },
        { label: 'Account Title', value: settings?.accountTitle || '—', key: 'title', copyable: false, badge: false },
        { label: 'Bank Name', value: settings?.bankName || '—', key: 'bank', copyable: false, badge: false },
        { label: 'IFSC Code', value: settings?.ifscCode || '—', key: 'ifsc', copyable: true, badge: true },
    ];

    return (
        <div className="pb-20">
            {/* ── Why Donate Section ── */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 dk-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B1976B]/10 border border-[#B1976B]/20 rounded-full mb-6">
                        <span className="material-symbols-outlined text-[#B1976B] text-sm">handshake</span>
                        <span className="text-[#B1976B] text-[10px] uppercase tracking-widest font-bold">The Cause</span>
                    </div>
                    <h2 className="font-headline text-3xl md:text-4xl text-[#005D91] mb-6">Why Donate to Us?</h2>
                    <p className="font-body text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto italic" style={{ whiteSpace: 'pre-wrap' }}>
                        &ldquo;{settings?.whyDonateText || "The believer's shade on the Day of Resurrection will be their charity."}&rdquo;
                    </p>
                </div>
            </div>

            {/* ── Better Lives Through Better Giving — Editorial Split Section ── */}
            <section className={styles.givingSection}>
                {/* Left: Image */}
                <div className={styles.givingImageCol}>
                    <div className={styles.givingImageFrame}>
                        <img
                            src={settings?.heroImageUrl || '/h1.JPG'}
                            alt="Students studying at Dalailul Khairath"
                            className={styles.givingImage}
                        />
                        {/* Floating impact badge */}
                        <div className={styles.givingBadge}>
                            <span className={styles.givingBadgeNum}>45K+</span>
                            <span className={styles.givingBadgeLabel}>Lives Touched</span>
                        </div>
                        {/* Decorative corner */}
                        <div className={styles.givingImageAccent} />
                    </div>
                </div>

                {/* Right: Copy + Bank Details */}
                <div className={styles.givingContent}>
                    {/* Eyebrow */}
                    <div className={styles.givingEyebrow}>
                        <span className={styles.givingEyebrowLine} />
                        <span className={styles.givingEyebrowText}>Make a Difference</span>
                    </div>

                    {/* Headline */}
                    <h2 className={`${styles.givingHeadline} font-headline`} dangerouslySetInnerHTML={{ __html: settings?.makeDifferenceHeading || 'Better lives through<br /><em>better giving.</em>' }} />

                    <p className={styles.givingBody} style={{ whiteSpace: 'pre-wrap' }}>
                        {settings?.makeDifferenceBody1 || 'Charity and relief activities are among the most significant aspects of Dalailul Khairath\'s mission. Across under-privileged communities in Kerala and beyond, we have organised food distribution, medical camps, madrasa infrastructure, bore-well construction, and family welfare support.'}
                    </p>
                    <p className={styles.givingBody} style={{ whiteSpace: 'pre-wrap' }}>
                        {settings?.makeDifferenceBody2 || 'You can transfer directly to our bank account via internet banking, mobile banking, or any UPI-enabled app — 100% of your donation reaches the cause.'}
                    </p>

                    {/* Bank Details Card */}
                    <div className={styles.bankCard}>
                        <div className={styles.bankCardHeader}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#B1976B' }}>account_balance</span>
                            <span className={styles.bankCardTitle}>Bank Details</span>
                        </div>
                        <div className={styles.bankFieldsList}>
                            {bankFields.map(({ label, value, key, copyable, badge }) => (
                                <div key={key} className={`${styles.bankField} ${badge ? styles.bankFieldIfsc : ''}`}>
                                    <div className={styles.bankFieldLeft}>
                                        <span className={styles.bankFieldLabel}>{label}</span>
                                        {badge ? (
                                            <span className={styles.bankFieldBadge}>{value}</span>
                                        ) : (
                                            <span className={styles.bankFieldValue}>{value}</span>
                                        )}
                                    </div>
                                    {copyable && (
                                        <button
                                            className={`${styles.bankCopyBtn} ${copied === key ? styles.bankCopyBtnSuccess : ''}`}
                                            onClick={() => copyToClipboard(value, key)}
                                            title="Copy"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                                                {copied === key ? 'check' : 'content_copy'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* UPI / Action buttons */}
                        <div className={styles.bankActions}>
                            <a
                                href={`upi://pay?pa=${settings?.upiId || 'donate@dkweb'}&pn=${encodeURIComponent(settings?.accountTitle || 'Dalailul Khairath')}&cu=INR`}
                                className={styles.upiBtn}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>payments</span>
                                Pay via UPI App
                            </a>
                            {settings?.qrCodeUrl && (
                                <button className={styles.qrBtn} onClick={() => {
                                    const el = document.getElementById('dk-qr-modal');
                                    if (el) el.style.display = 'flex';
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>qr_code_2</span>
                                    Scan QR
                                </button>
                            )}
                        </div>

                        <p className={styles.bankNote}>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>verified</span>
                            Use your name as payment reference. May Allah reward your generosity.
                        </p>
                    </div>
                </div>
            </section>

            {/* QR Modal (optional) */}
            {settings?.qrCodeUrl && (
                <div
                    id="dk-qr-modal"
                    style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) (e.currentTarget as HTMLElement).style.display = 'none'; }}
                >
                    <div style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 320, width: '90%', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
                        <img src={settings.qrCodeUrl} alt="Donate QR" style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />
                        <p style={{ color: '#0f2c59', fontWeight: 600, fontSize: 14 }}>Scan with any UPI app to donate</p>
                        <button
                            onClick={() => { const el = document.getElementById('dk-qr-modal'); if (el) el.style.display = 'none'; }}
                            style={{ marginTop: 16, color: '#666', fontSize: 13, border: 'none', background: 'none', cursor: 'pointer' }}
                        >Close</button>
                    </div>
                </div>
            )}

            {/* Trust Footer */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 items-center text-[10px] font-bold uppercase tracking-widest text-[#005D91]/40 max-w-4xl mx-auto px-4">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-[#005D91]">verified</span>SSL Encrypted</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-[#005D91]">security</span>PCI-DSS Compliant</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-[#005D91]">sync</span>Real-time Routing</span>
            </div>
        </div>
    );
}
