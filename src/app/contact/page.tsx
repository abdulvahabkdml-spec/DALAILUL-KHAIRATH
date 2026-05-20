'use client';
import { useState, useEffect } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [contactInfo, setContactInfo] = useState({
        contactAddress: 'Dalailul Khairath, Kakkidippuram, Malappuram, Kerala 679582, India',
        contactEmail: 'info@dalailulkhairath.com',
        contactPhone: '+91 8123456789',
        googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15666.428!2d76.0272!3d10.7631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b92571fe35dd%3A0xb448354cc34ddbd0!2sDalailul+Khairath%2C+Kakkidippuram.+Madeenathunnoor+campus!5e0!3m2!1sen!2sin!4v1712400000000!5m2!1sen!2sin'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings/site');
                const data = await response.json();
                if (data) {
                    setContactInfo(prev => ({
                        contactAddress: data.contactAddress || prev.contactAddress,
                        contactEmail: data.contactEmail || prev.contactEmail,
                        contactPhone: data.contactPhone || prev.contactPhone,
                        googleMapsEmbedUrl: data.googleMapsEmbedUrl || prev.googleMapsEmbedUrl,
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch contact settings:', error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // A small timeout ensures DOM elements are rendered before observing
        setTimeout(() => {
            document.querySelectorAll('.reveal-card, .stagger-delay').forEach(el => {
                observer.observe(el);
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-white min-h-screen flex flex-col">
            {/* Contact Hero - Blue Banner Theme */}
            <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 w-full flex flex-col items-center justify-center overflow-hidden bg-[#005D91]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#004B7A] to-[#005D91]"></div>
                <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                    {/* Premium Eyebrow */}
                    <div className="flex items-center gap-2 mb-6 group cursor-default reveal-card">
                        <span className="flex h-2 w-2 rounded-full bg-[#B1976B] animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B1976B]">Get in touch with DK</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif-premium font-bold tracking-tight reveal-card" style={{ textWrap: 'balance' }}>
                        Contact Us
                    </h1>
                    <p className="mt-4 text-white/80 font-body text-base lg:text-lg max-w-2xl reveal-card stagger-delay" style={{ animationDelay: '0.2s' }}>
                        Have a query regarding admissions, donations, or collaborations? Reach out to us. We look forward to connecting with you.
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 w-full py-16 lg:py-24">
                <div className={styles.layoutGrid}>
                {/* Left Side: Info & Form */}
                <div className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">location_on</span>
                        </div>
                        <div className={styles.infoContent}>
                            <h3 className="font-headline font-bold text-navy">Our Campus</h3>
                            <p className="text-slate-blue" dangerouslySetInnerHTML={{ __html: contactInfo.contactAddress.replace(/\n/g, '<br />') }} />
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div className={styles.infoContent}>
                            <h3 className="font-headline font-bold text-navy">Contact Info</h3>
                            <p className="text-slate-blue">
                                {contactInfo.contactEmail}<br />
                                {contactInfo.contactPhone}
                            </p>
                        </div>
                    </div>

                    {/* Social Media Card */}
                    <div className={styles.infoCard}>
                        <div className={styles.iconWrapper}>
                            <span className="material-symbols-outlined">share</span>
                        </div>
                        <div className={styles.infoContent}>
                            <h3 className="font-headline font-bold text-navy">Follow Us</h3>
                            <p className="text-slate-blue text-sm mb-4">Stay connected through our official social media channels.</p>
                            <div className="flex gap-3">
                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/profile.php?id=100095405598376&mibextid=ZbWKwL"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 hover:bg-[#1877F2]/15 hover:border-[#1877F2]/40 transition-all group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2] flex-shrink-0">
                                        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                                    </svg>
                                    <span className="text-sm font-semibold text-[#1877F2] group-hover:text-[#1877F2]">Facebook</span>
                                </a>
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/dalailul_khairath_?igsh=eXZiYXBrMGtlN2U2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#E1306C]/20 bg-[#E1306C]/5 hover:bg-[#E1306C]/15 hover:border-[#E1306C]/40 transition-all group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-[#E1306C] flex-shrink-0">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                    <span className="text-sm font-semibold text-[#E1306C] group-hover:text-[#E1306C]">Instagram</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactForm}>
                        <h3 className="text-xl font-headline font-bold text-navy mb-4">Send a Message</h3>
                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                                <span className="material-symbols-outlined text-4xl mb-3">check_circle</span>
                                <h4 className="font-bold text-lg mb-2">Message Received</h4>
                                <p className="text-sm opacity-90">Thank you for reaching out. Our team will get back to you within 24-48 business hours.</p>
                                <button 
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-4 text-xs font-bold uppercase tracking-widest text-[#005D91] hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.input} 
                                        placeholder="Enter your name" 
                                        required 
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={styles.input} 
                                        placeholder="name@example.com" 
                                        required 
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Message</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={styles.textarea} 
                                        placeholder="How can we help you?" 
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Side: Campus Map */}
                <div className={styles.mapSection}>
                    <iframe 
                        title="Campus Map"
                        src="https://maps.google.com/maps?q=Dalailul+Khairath,+Kakkidippuram.+Madeenathunnoor+campus&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        className={styles.mapPlaceholder}
                        loading="lazy"
                    />
                </div>
            </div>
            </div>
        </main>
    );
}

