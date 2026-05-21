'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ISiteSettingsParsed, IFeaturedArticle } from '@/lib/types';
import { INews } from '@/models/News';
import { IEvent } from '@/models/Event';
import { IImpactMetric } from '@/models/ImpactMetric';

import CountUpStat from '@/components/CountUpStat';

export default function HomePageClient({ 
    initialSettings, 
    initialNews, 
    initialEvents, 
    initialMetrics 
}: { 
    initialSettings: ISiteSettingsParsed | null, 
    initialNews: INews[], 
    initialEvents: IEvent[], 
    initialMetrics: IImpactMetric[] 
}) {
    const [siteSettings, setSiteSettings] = useState<ISiteSettingsParsed | null>(initialSettings);
    const [news, setNews] = useState<INews[]>(initialNews);
    const [events, setEvents] = useState<IEvent[]>(initialEvents);
    const [metrics, setMetrics] = useState<IImpactMetric[]>(initialMetrics);

    // Performance state for mobile optimization
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });

        // Nav Scroll Effect
        const handleScroll = () => {
            const nav = document.getElementById('main-nav');
            if (nav) {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Intersection Observer for scroll animations (only enabled on non-mobile for performance)
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const isMobileDevice = window.innerWidth < 768;
        if (!isMobileDevice) {
            document.querySelectorAll('.reveal-card, .icon-reveal, .stagger-delay').forEach(el => {
                observer.observe(el);
            });
        } else {
            // Immediately make visible on mobile to avoid layout reflow overhead
            document.querySelectorAll('.reveal-card, .icon-reveal, .stagger-delay').forEach(el => {
                el.classList.add('is-visible');
            });
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <main className="bg-transparent relative">
            {/* Embedded styles for premium animations & effects */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }
                .hover-lift {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-8px);
                }
                .premium-gradient-bg {
                    background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
                }
                .reveal-card {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.21, 0.45, 0.32, 0.9);
                }
                .reveal-card.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* ── Affiliation Seal ── */
                @keyframes sealSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes sealShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes sealReveal {
                    0%   { opacity: 0; transform: translate(-25%, -25%) scale(0.7) rotate(-15deg); }
                    100% { opacity: 1; transform: translate(-25%, -25%) scale(1)  rotate(0deg); }
                }
                .affiliation-seal {
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: translate(-25%, -25%);
                    width: 148px;
                    height: 148px;
                    z-index: 20;
                    animation: sealReveal 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.6s both;
                    filter: drop-shadow(0 6px 24px rgba(0,0,0,0.35));
                }
                /* spinning outer ring */
                .affiliation-seal .seal-ring-outer {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: conic-gradient(
                        #C9A95A 0deg,
                        #F0D080 40deg,
                        #B8902A 80deg,
                        #F5E0A0 120deg,
                        #C9A95A 160deg,
                        #F0D080 200deg,
                        #B8902A 240deg,
                        #F5E0A0 280deg,
                        #C9A95A 320deg,
                        #F0D080 360deg
                    );
                    animation: sealSpin 18s linear infinite;
                }
                /* static mask to create the ring appearance */
                .affiliation-seal .seal-ring-mask {
                    position: absolute;
                    inset: 6px;
                    border-radius: 50%;
                    background: #fff;
                }
                /* inner decorative ring */
                .affiliation-seal .seal-ring-inner {
                    position: absolute;
                    inset: 10px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f8f0d8 0%, #fff8e8 50%, #f0e4c0 100%);
                    border: 1.5px solid rgba(184,144,42,0.4);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    overflow: hidden;
                }
                /* dot-ring decoration */
                .affiliation-seal .seal-dots {
                    position: absolute;
                    inset: 7px;
                    border-radius: 50%;
                    border: 1px dashed rgba(184,144,42,0.5);
                    pointer-events: none;
                }
                /* shimmer gloss */
                .affiliation-seal .seal-ring-inner::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%);
                    background-size: 200% auto;
                    animation: sealShimmer 3.5s linear infinite;
                    pointer-events: none;
                    z-index: 2;
                }
                .seal-logo-top, .seal-logo-bottom {
                    width: 48px;
                    height: 48px;
                    object-fit: contain;
                    position: relative;
                    z-index: 1;
                    flex-shrink: 0;
                }
                .seal-divider {
                    width: 60%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(184,144,42,0.7), transparent);
                    flex-shrink: 0;
                    margin: 3px 0;
                    position: relative;
                    z-index: 1;
                }
                /* small star ornament on divider */
                .seal-divider::before {
                    content: '✦';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 8px;
                    color: rgba(184,144,42,0.9);
                    background: linear-gradient(135deg, #f8f0d8, #fff8e8);
                    padding: 0 2px;
                    line-height: 1;
                }

                @media (max-width: 768px) {
                    /* Disable expensive backdrop blurs on mobile */
                    .glass-card {
                        background: rgba(255, 255, 255, 0.96) !important;
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                    }
                    .affil-card {
                        background: rgba(255, 255, 255, 0.96) !important;
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                    }
                    
                    /* Disable heavy layout transitions and scroll animations on mobile */
                    .reveal-card {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                    
                    /* Disable hover translations on touch devices */
                    .hover-lift:hover {
                        transform: none !important;
                    }
                    .metric-card:hover {
                        transform: none !important;
                    }

                    /* Disable continuous infinite rotation animations on mobile to save GPU cycles */
                    .affiliation-seal .seal-ring-outer {
                        animation: none !important;
                    }
                    .affiliation-seal .seal-ring-inner::before {
                        animation: none !important;
                    }
                    .affil-logo-ring {
                        animation: none !important;
                    }
                    .affil-logo-wrap {
                        animation: none !important;
                    }

                    /* Force GPU hardware acceleration on marquee track for perfect scrolling performance */
                    .affil-marquee-track {
                        transform: translate3d(0, 0, 0) !important;
                        backface-visibility: hidden;
                        perspective: 1000;
                    }
                }
            `}</style>


            {/* 1. Hero Section */}
            <header className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
                <div className="fixed inset-0 z-[-1]">
                    {/* The "Golden Hour" Video Filter - Dark chocolate & black at 40%+ opacity */}
                    <div className="absolute inset-0 bg-[#2A1810]/50 mix-blend-multiply z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#3E2723]/60 via-black/30 to-black/70 z-10 pointer-events-none"></div>
                    {isMounted && !isMobile ? (
                        <video 
                            className="w-full h-full object-cover origin-center opacity-100" 
                            src="/Drone_flight_building_202604141451.mp4" 
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <img 
                            className="w-full h-full object-cover origin-center opacity-100" 
                            src="https://res.cloudinary.com/dhdzz9rxz/image/upload/v1779327363/01_vcnv3h.jpg" 
                            alt="Campus Background"
                        />
                    )}
                </div>

                <div className="relative z-30 text-center px-6 mt-16 flex flex-col items-center pointer-events-none">
                    <h1 className="text-[2.2rem] xs:text-[2.5rem] leading-[1.1] md:text-5xl lg:text-6xl font-serif-premium text-white font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] reveal-card stagger-delay mx-auto max-w-5xl" style={{ animationDelay: '0.2s', textWrap: 'balance' }}>
                        {siteSettings?.heroTitle || 'Empowering Minds, Inspiring Futures'}
                    </h1>

                    <div className="mt-12 reveal-card stagger-delay flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
                        <p className="text-white/95 font-serif-premium text-lg md:text-2xl font-medium tracking-wide max-w-3xl leading-relaxed drop-shadow-lg text-balance" style={{ whiteSpace: 'pre-wrap' }}>
                            {siteSettings?.heroSubtitle || 'We nurture students to become future leaders through holistic education and values-driven guidance.'}
                        </p>
                    </div>

                    <div className="mt-16 flex flex-col items-center gap-6 reveal-card stagger-delay" style={{ animationDelay: '0.6s' }}>
                        <span className="material-symbols-outlined text-white/60 text-2xl animate-bounce font-light">expand_more</span>
                    </div>
                </div>

            </header>

            {/* Everything below header gets wrapped in a solid background contextual container to slide over the video */}
            <div className="relative z-10 bg-white w-full rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">

            {/* 2. Welcome / About DK */}
            <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
                <div className="absolute inset-0 calligraphy-bg pointer-events-none opacity-[0.02]"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* Text Column (Left) */}
                    <div className="order-2 md:order-1 reveal-card flex flex-col justify-center pr-0 lg:pr-12">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-6 group cursor-default">
                            <span className="flex h-2 w-2 rounded-full bg-[#B1976B] animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B1976B]">Empowering Minds Since 2008</span>
                        </div>

                        {/* Brand Blue Line Accent */}
                        <div className="w-[50px] h-[2px] bg-[#B1976B] mb-8"></div>
                        
                        <h2 className="text-[#005D91] text-4xl lg:text-5xl lg:leading-[1.1] tracking-tight mb-8">
                            <span className="font-serif-premium font-bold text-[0.9em] opacity-80 text-navy">{siteSettings?.aboutTitle?.split(',')[0] || 'Beyond Learning,'}</span><br/>
                            <span className="font-serif-premium mt-2 block font-extrabold text-[1.2em] tracking-tighter drop-shadow-sm">
                                {siteSettings?.aboutTitle?.split(',')[1] || 'Dalailul Khairath'}
                            </span>
                        </h2>

                        
                        <p className="text-slate-blue text-lg lg:text-xl leading-relaxed mb-10 font-normal opacity-90" style={{ whiteSpace: 'pre-wrap' }}>
                            &quot;{siteSettings?.aboutText || 'A premier sanctuary of knowledge where tradition and modern excellence unite. We empower the next generation of leaders through a curriculum rooted in values and academic brilliance.'}&quot;
                        </p>
                        
                        <div>
                            <a href="/about" className="inline-flex px-10 py-5 bg-[#005D91] text-white hover:bg-[#003459] hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 font-bold tracking-widest uppercase text-sm rounded-xl shadow-premium group items-center gap-3 cursor-pointer">
                                Explore Our Campus
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                    
                    <div className="order-1 md:order-2 reveal-card stagger-delay">
                        <div className="relative w-full aspect-[4/5] lg:aspect-[4/3] overflow-hidden rounded-2xl lg:rounded-3xl shadow-premium group border border-slate-100">
                            <Image 
                                alt="Dalailul Khairath Campus" 
                                className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-105 transition-transform duration-1000 ease-out" 
                                src={siteSettings?.aboutImageUrl || "/h2.JPG"} 
                                fill
                            />
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* 2.5 Research Focus Areas - Premium Grid */}
            <section className="relative py-24 lg:py-32 bg-[#03122A] overflow-hidden border-y border-[#C9A95A]/10">
                {/* Background ambient light */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-[900px] h-[600px] bg-[#003459] rounded-full blur-[160px] opacity-60"></div>
                    <div className="w-[500px] h-[500px] bg-[#C9A95A] rounded-full blur-[150px] opacity-10 -translate-x-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 lg:mb-24 reveal-card">
                        <p className="text-[#C9A95A] font-label tracking-[0.3em] uppercase text-[10px] font-bold mb-4">Our Focus</p>
                        <h2 className="text-[32px] lg:text-[42px] text-white font-serif-premium mb-6">
                            Quranic Research Center
                        </h2>
                        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A95A] to-transparent mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            { title: "Quranic Linguistics", icon: "translate", desc: "Exploring the profound depths of classical Arabic semantics, rhetoric, and stylistic miracles." },
                            { title: "Tafsir Studies", icon: "menu_book", desc: "Advanced textual analysis mapping classical exegesis to contemporary contextual understanding." },
                            { title: "Comparative Research", icon: "join_inner", desc: "Inter-disciplinary scholarship bridging traditional Islamic sciences with modern humanities." },
                            { title: "Preservation & Manuscripts", icon: "history_edu", desc: "State-of-the-art digital archiving and restoration of rare historical Islamic manuscripts." }
                        ].map((area, idx) => (
                            <div key={idx} className="relative group reveal-card stagger-delay overflow-hidden rounded-[20px] h-full flex flex-col cursor-default" style={{ animationDelay: `${idx * 0.15}s` }}>
                                
                                {/* Tiny Arabic Pattern Background Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30zM15 30l15 15 15-15-15-15z\' fill=\'%23C9A95A\' fill-opacity=\'1\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px' }}></div>
                                
                                {/* Dark Glass Card Body */}
                                <div className="relative z-10 flex flex-col flex-1 p-8 lg:p-10 bg-[#FFFFFF]/[0.02] backdrop-blur-2xl border border-white/[0.05] group-hover:border-[#C9A95A]/60 transition-all duration-500 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:shadow-[0_8px_32px_rgba(201,169,90,0.15)] group-hover:-translate-y-2">
                                    

                                    
                                    {/* Content */}
                                    <h3 className="text-white font-serif-premium text-[22px] lg:text-[24px] mb-4 group-hover:text-[#C9A95A] transition-colors leading-tight">{area.title}</h3>
                                    <p className="text-white/80 text-[14px] leading-relaxed font-light mt-auto">
                                        {area.desc}
                                    </p>
                                    
                                    {/* Golden Hover Line indicator */}
                                    <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#C9A95A]/80 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-center"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Founder's Message - Unified Logo Theme Layout */}
            <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
                
                <div className="max-w-[1140px] mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-left mb-16 reveal-card">
                        <p className="text-[#B1976B] font-label tracking-widest uppercase text-xs font-bold mb-3">Visionary Leadership</p>
                        <h2 className="text-[32px] lg:text-[42px] text-[#003459] font-serif-premium mb-4">Founder's Message</h2>
                        <div className="w-full h-[1.5px] bg-[#2D8B8B]/40"></div>
                    </div>

                    <div className="relative bg-white rounded-[32px] overflow-hidden shadow-premium border border-slate-100 p-8 lg:p-16 hover:shadow-premium-hover transition-all duration-700">
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-stretch">
                            
                            {/* Portrait Section */}
                            <div className="w-full lg:w-[380px] shrink-0 reveal-card">
                                <div className="aspect-[4/5] rounded-[20px] overflow-hidden shadow-soft bg-slate-50 relative z-10 border border-[#B1976B]/30">
                                    <Image 
                                        alt={siteSettings?.founderName || "Abdul Salam Sa'adi"} 
                                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105" 
                                        src={siteSettings?.founderImageUrl || "https://res.cloudinary.com/dhdzz9rxz/image/upload/v1776878729/dk-web/general/usthad-1776878726014.jpg"} 
                                        fill
                                    />
                                </div>
                            </div>

                            {/* Message Content Section */}
                            <div className="flex-1 reveal-card stagger-delay pt-2 flex flex-col">

                                {/* The Message Typography (Single Simple Style) */}
                                <div className="text-[#1e293b] font-body text-[17px] lg:text-[18px] leading-[1.9] font-normal mb-12" style={{ whiteSpace: 'pre-wrap' }}>
                                    
                                    {siteSettings?.founderText1 && (
                                        <p className="mb-6">
                                            {siteSettings.founderText1}
                                        </p>
                                    )}

                                    <div className="opacity-95">
                                        {siteSettings?.founderText2 || "Welcome to Dalailul Khairath, a portal that represents the heart of our mission. Since our journey began in 2008, we have remained committed to a singular purpose: to mould highly talented professionals and scholars who are as spiritually grounded as they are academically brilliant.\n\nOur goal remains firm: to be a Centre of Excellence that remains relevant, responsive, and invaluable to our society. We invite you to be a part of this transformative legacy."}
                                    </div>
                                </div>

                                {/* Concluding Signature Block */}
                                <div className="mt-auto pt-10 border-t border-slate-100/60 relative">
                                    <div className="absolute top-0 left-0 w-12 h-1 bg-[#B1976B]/40 -translate-y-1/2"></div>
                                    
                                    <h4 className="font-serif-premium text-[24px] lg:text-[28px] text-[#005D91] font-bold tracking-tight mb-2">
                                        {siteSettings?.founderName || "Abdul Salam Sa'adi"}
                                    </h4>
                                    <p className="text-[#B1976B] font-serif-premium text-[15px] font-bold tracking-[0.25em] uppercase">
                                        {siteSettings?.founderTitle || "Founder & Chancellor"}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Global Influence Section */}
            <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-left mb-16 lg:mb-24 reveal-card">
                        <p className="text-[#B1976B] font-label tracking-widest uppercase text-xs font-bold mb-3">Institutional Impact</p>
                        <h2 className="text-[32px] lg:text-[42px] text-[#003459] font-serif-premium mb-4">The Global Reach</h2>
                        <div className="w-full h-[1.5px] bg-[#2D8B8B]/40"></div>
                    </div>
                    
                    {/* Top 3 Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-24">
                        <div className="metric-card bg-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-premium hover:shadow-premium-hover reveal-card hover-lift transition-all duration-500 border border-slate-100 hover:border-[#005D91]/30">
                            <div className="accent-line w-1 bg-[#005D91] opacity-0 transition-all duration-500 rounded-l-3xl"></div>
                            <div className="text-4xl sm:text-5xl font-bold font-body text-[#005D91] mb-3">20+</div>
                            <div className="font-serif-premium text-[#B1976B] font-bold text-sm tracking-widest uppercase">Years of Excellence</div>
                        </div>
                        <div className="metric-card bg-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-premium hover:shadow-premium-hover reveal-card stagger-delay hover-lift transition-all duration-500 border border-slate-100 hover:border-[#005D91]/30">
                            <div className="accent-line w-1 bg-[#005D91] opacity-0 transition-all duration-500 rounded-l-3xl"></div>
                            <div className="text-4xl sm:text-5xl font-bold font-body text-[#005D91] mb-3">404+</div>
                            <div className="font-serif-premium text-[#B1976B] font-bold text-sm tracking-widest uppercase">Enrolled Students</div>
                        </div>
                        <div className="metric-card bg-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-premium hover:shadow-premium-hover reveal-card delay-200 hover-lift transition-all duration-500 border border-slate-100 hover:border-[#005D91]/30">
                            <div className="accent-line w-1 bg-[#005D91] opacity-0 transition-all duration-500 rounded-l-3xl"></div>
                            <div className="text-4xl sm:text-5xl font-bold font-body text-[#005D91] mb-3">200+</div>
                            <div className="font-serif-premium text-[#B1976B] font-bold text-sm tracking-widest uppercase">Global Islamic Leaders</div>
                        </div>
                    </div>
                    
                    {/* Compact Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {(metrics.length > 0 ? metrics : [
                            { icon: "history_edu", value: 320, unit: "+", label: "PhD Researchers" },
                            { icon: "health_and_safety", value: 450, unit: "+", label: "Doctors" },
                            { icon: "mosque", value: 12, unit: "K+", label: "Islamic Leaders" },
                            { icon: "balance", value: 240, unit: "+", label: "Advocates" },
                            { icon: "school", value: 45, unit: "K+", label: "Active Students" },
                            { icon: "diversity_3", value: 900, unit: "+", label: "Social Workers" },
                            { icon: "precision_manufacturing", value: 890, unit: "+", label: "Engineers" },
                            { icon: "terminal", value: 2, unit: "K+", label: "IT Professionals" }
                        ]).map((stat, i) => (
                            <div key={i} className="glass-card bg-white/70 p-6 rounded-2xl shadow-soft border-[#005D91]/5 reveal-card stagger-delay hover:-translate-y-1 hover:shadow-premium hover:border-[#005D91]/20 transition-all duration-300">
                                <CountUpStat endValue={Number(stat.value)} suffix={stat.unit} />
                                <div className="font-label text-[#B1976B] text-xs uppercase tracking-wider font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ══ Affiliated With — Premium Compact Section ══ */}
            <section className="affil-section relative py-20 lg:py-24 overflow-hidden">
                <style>{`
                    /* ── Section shell ── */
                    .affil-section {
                        background: #063b21;
                        border-top: 1px solid rgba(201,169,90,0.12);
                        border-bottom: 1px solid rgba(201,169,90,0.12);
                    }

                    /* ── Grain texture overlay ── */
                    .affil-section::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
                        background-size: 256px 256px;
                        pointer-events: none;
                        z-index: 0;
                    }

                    /* ── Soft radial gold blush ── */
                    .affil-blush {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 700px;
                        height: 400px;
                        background: radial-gradient(ellipse, rgba(201,169,90,0.07) 0%, transparent 70%);
                        pointer-events: none;
                        z-index: 0;
                    }

                    /* ── Eyebrow text ── */
                    .affil-eyebrow {
                        font-size: 0.6rem;
                        font-weight: 800;
                        letter-spacing: 0.35em;
                        text-transform: uppercase;
                        color: rgba(201,169,90,0.7);
                    }

                    /* ── Horizontal rule ornament ── */
                    .affil-rule {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        justify-content: center;
                        margin: 16px 0 32px;
                    }
                    .affil-rule::before,
                    .affil-rule::after {
                        content: '';
                        display: block;
                        width: 56px;
                        height: 1px;
                        background: linear-gradient(to right, transparent, rgba(201,169,90,0.45));
                    }
                    .affil-rule::after {
                        background: linear-gradient(to left, transparent, rgba(201,169,90,0.45));
                    }
                    .affil-rule-diamond {
                        width: 6px;
                        height: 6px;
                        background: #C9A95A;
                        transform: rotate(45deg);
                        opacity: 0.6;
                    }

                    /* ── Main badge card ── */
                    .affil-card {
                        display: inline-flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 0;
                        padding: 24px;
                        background: rgba(255,255,255,0.85);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-radius: 24px;
                        border: 1px solid rgba(201,169,90,0.18);
                        box-shadow: 0 2px 40px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.9) inset;
                        transition: transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.5s ease, border-color 0.3s ease;
                    }
                    @media (min-width: 640px) {
                        .affil-card {
                            padding: 40px 56px;
                        }
                    }
                    .affil-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 20px 60px rgba(201,169,90,0.12), 0 4px 16px rgba(0,0,0,0.06);
                        border-color: rgba(201,169,90,0.35);
                    }

                    /* ── Spinning gold logo ring ── */
                    @keyframes affiliRingSpin {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                    @keyframes affiliLogoReveal {
                        from { opacity: 0; transform: scale(0.8); }
                        to   { opacity: 1; transform: scale(1); }
                    }
                    .affil-logo-wrap {
                        position: relative;
                        width: 108px;
                        height: 108px;
                        margin-bottom: 24px;
                        animation: affiliLogoReveal 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
                    }
                    .affil-logo-ring {
                        position: absolute;
                        inset: 0;
                        border-radius: 50%;
                        background: conic-gradient(
                            rgba(201,169,90,0.0) 0deg,
                            rgba(201,169,90,0.85) 60deg,
                            rgba(240,208,128,0.9) 120deg,
                            rgba(201,169,90,0.0) 180deg,
                            rgba(201,169,90,0.0) 270deg,
                            rgba(240,208,128,0.7) 330deg,
                            rgba(201,169,90,0.0) 360deg
                        );
                        animation: affiliRingSpin 7s linear infinite;
                    }
                    .affil-logo-mask {
                        position: absolute;
                        inset: 5px;
                        border-radius: 50%;
                        background: #FDFCF9;
                    }
                    .affil-logo-inner {
                        position: absolute;
                        inset: 8px;
                        border-radius: 50%;
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    }
                    .affil-logo-inner img {
                        width: 64px;
                        height: 64px;
                        object-fit: contain;
                    }

                    /* ── Institution name ── */
                    .affil-name {
                        font-family: 'Playfair Display', Georgia, serif;
                        font-size: 1.45rem;
                        font-weight: 700;
                        color: #1a2a3a;
                        letter-spacing: -0.02em;
                        line-height: 1.2;
                        text-align: center;
                        margin-bottom: 8px;
                    }

                    /* ── Meta line ── */
                    .affil-meta {
                        font-size: 0.65rem;
                        font-weight: 700;
                        letter-spacing: 0.25em;
                        text-transform: uppercase;
                        color: rgba(201,169,90,0.75);
                        text-align: center;
                        margin-bottom: 20px;
                    }

                    /* ── Separator line ── */
                    .affil-separator {
                        width: 40px;
                        height: 1.5px;
                        background: linear-gradient(90deg, transparent, #C9A95A, transparent);
                        border-radius: 9999px;
                        margin: 0 auto 16px;
                    }

                    /* ── Description text ── */
                    .affil-desc {
                        font-size: 0.82rem;
                        color: #6b7a8d;
                        line-height: 1.75;
                        text-align: center;
                        max-width: 280px;
                        font-weight: 400;
                        margin-bottom: 22px;
                    }

                    /* ── Visit link ── */
                    .affil-link {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 0.62rem;
                        font-weight: 800;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        color: #C9A95A;
                        text-decoration: none;
                        border-bottom: 1px solid rgba(201,169,90,0.3);
                        padding-bottom: 2px;
                        transition: color 0.25s ease, border-color 0.25s ease, gap 0.25s ease;
                    }
                    .affil-link:hover {
                        color: #B8902A;
                        border-color: #B8902A;
                        gap: 10px;
                    }

                    /* ── Marquee trust strip ── */
                    @keyframes affiliMarquee {
                        from { transform: translateX(0); }
                        to   { transform: translateX(-50%); }
                    }
                    .affil-marquee-track {
                        display: flex;
                        width: max-content;
                        animation: affiliMarquee 22s linear infinite;
                        will-change: transform;
                    }
                    .affil-marquee-track:hover { animation-play-state: paused; }
                    .affil-marquee-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 0 36px;
                        white-space: nowrap;
                        font-size: 0.65rem;
                        font-weight: 700;
                        letter-spacing: 0.22em;
                        text-transform: uppercase;
                        color: rgba(255, 255, 255, 0.35);
                        border-right: 1px solid rgba(201,169,90,0.2);
                    }
                    .affil-marquee-dot {
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background: rgba(201,169,90,0.45);
                        flex-shrink: 0;
                    }
                `}</style>

                <div className="affil-blush" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

                    {/* Eyebrow */}
                    <p className="affil-eyebrow reveal-card">Institutional Affiliation</p>

                    {/* Ornamental rule */}
                    <div className="affil-rule reveal-card">
                        <span className="affil-rule-diamond" />
                    </div>

                    {/* Headline */}
                    <h2 className="text-white text-[1.75rem] lg:text-[2.2rem] font-serif-premium font-bold tracking-tight mb-4 reveal-card" style={{ letterSpacing: '-0.025em' }}>
                        Proudly Affiliated With
                    </h2>
                    <p className="text-white/80 text-sm lg:text-base max-w-md mx-auto mb-14 leading-relaxed reveal-card stagger-delay">
                        Our academic identity is shaped and strengthened by our bond with a pioneering institution of Islamic and modern learning.
                    </p>

                    {/* Badge Card */}
                    <div className="flex justify-center reveal-card stagger-delay">
                        <div className="affil-card">

                            {/* Spinning logo ring */}
                            <div className="affil-logo-wrap">
                                <div className="affil-logo-ring" />
                                <div className="affil-logo-mask" />
                                <div className="affil-logo-inner">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="https://www.jamiamadeenathunnoor.org/favicon.ico"
                                        alt="Jamia Madeenathunnoor"
                                        onError={(e) => {
                                            const el = e.currentTarget as HTMLImageElement;
                                            el.style.display = 'none';
                                            const span = document.createElement('span');
                                            span.style.cssText = 'font-size:22px;font-weight:900;color:#1a5c2a;font-family:Georgia,serif;';
                                            span.textContent = 'JM';
                                            el.parentElement?.appendChild(span);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="affil-name">Jamia Madeenathunnoor</h3>

                            {/* Meta */}
                            <p className="affil-meta">Markaz Garden · Poonoor · Est. 2001</p>

                            {/* Separator */}
                            <div className="affil-separator" />

                            {/* Description */}
                            <p className="affil-desc">
                                A leading center of Islamic and secular scholarship, shaping the world's finest scholars, doctors, and leaders across 40+ nations.
                            </p>

                            {/* Visit link */}
                            <a
                                href="https://www.jamiamadeenathunnoor.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="affil-link"
                            >
                                Visit Institution
                                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    {/* Marquee trust strip */}
                    <div className="mt-16 overflow-hidden reveal-card" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                        <div className="affil-marquee-track">
                            {[
                                'Academic Excellence',
                                'Affiliated Since Foundation',
                                'Islamic Scholarship',
                                'Modern Education',
                                'Global Reach',
                                '61 Campuses',
                                '40+ Nations',
                                'Certified Curriculum',
                                'Academic Excellence',
                                'Affiliated Since Foundation',
                                'Islamic Scholarship',
                                'Modern Education',
                                'Global Reach',
                                '61 Campuses',
                                '40+ Nations',
                                'Certified Curriculum',
                            ].map((item, i) => (
                                <span key={i} className="affil-marquee-item">
                                    <span className="affil-marquee-dot" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. Student Articles Showcase - Minimalist Clean Theme */}
            <section className="py-20 lg:py-32 bg-white relative font-body">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-left mb-16 reveal-card">
                        <p className="text-[#B1976B] font-label tracking-widest uppercase text-xs font-bold mb-3">Academic Insights</p>
                        <h2 className="text-[32px] lg:text-[42px] text-[#003459] font-serif-premium mb-4">{siteSettings?.articleSectionTitle || "Students Journal"}</h2>
                        <div className="w-full h-[1.5px] bg-[#2D8B8B]/40"></div>
                    </div>

                    {/* 1+6 Magazine Layout */}
                    {(() => {
                        // Filter out empty slots from the DB
                        const savedArticles = (siteSettings?.featuredArticles || []).filter((a: IFeaturedArticle) => a && !a.isEmpty && a.title);
                        
                        const allItems: IFeaturedArticle[] = savedArticles.length > 0 
                            ? savedArticles 
                            : [
                                { tag: "Profound", title: "Religious Particularity and Universal Brotherhood", author: "Thameem Muhammed", desc: "A comparative study exploring how deep particularity can lead to true universal empathy through traditional wisdom...", img: "https://res.cloudinary.com/dfiaie9as/image/upload/v1775927755/the-inkspire/1775927727406-religious-unity-concept-1080x675-jpg.jpg", url: "https://inkspiredk.vercel.app/article/religious-particularity-and-universal-brotherhood-a-comparative-study-of-pluralism-in-major-faith-traditions", slug: "religious-particularity-universal-brotherhood" },
                                { tag: "World", title: "The Girls We Forgot: A Reckoning with Selective Empathy", author: "Vahab Muhammed", desc: "Exploring global silence in the face of tragedy and the complexities of modern empathy...", img: "/girls.webp", url: "https://inkspiredk.vercel.app/article/the-girls-we-forgot-a-reckoning-with-selective-empathy", slug: "the-girls-we-forgot" },
                                { tag: "History", title: "Echoes of Eternity: Islamic Civilization's Golden Age", author: "Basith KA", desc: "Tracing the intellectual zeniths of Abbasid scholarship and Andalusian convivencia...", img: "/echos.webp", url: "https://inkspiredk.vercel.app/article/echoes-of-eternity-islamic-civilizations-golden-age", slug: "echoes-of-eternity" },
                                { tag: "Poetic", title: "Whispers of the Nile: Ancient Wonders Revisited", author: "Yehya Abdurahman", desc: "An evocative journey through rhythmic imagery of Egypt's eternal pyramids...", img: "/nile.webp", url: "https://inkspiredk.vercel.app/article/whispers-of-the-nile-ancient-wonders-revisited", slug: "whispers-of-nile" },
                                { tag: "Literature", title: "ബദറിലെ സ്വർഗീയ ബാല്യങ്ങൾ", author: "Binshad Junaid", desc: "An exploration of early Islamic narratives through the lens of innocence and sacrifice...", img: "/badr.webp", url: "https://inkspiredk.vercel.app/article/badr-childhood", slug: "badr-childhood" },
                                { tag: "Society", title: "രണ്ട് ഇന്ത്യകൾ, ഒരു വിരൽപ്പാട്", author: "Irfan Jafar", desc: "A powerful contrast between the silence of status and the loud reality of child poverty...", img: "/irfa.webp", url: "https://inkspiredk.vercel.app/article/two-indias", slug: "two-indias" },
                                { tag: "Classic", title: "കോവർകഴുത", author: "Vaikom Muhammad Basheer", desc: "A timeless exploration of human nature and empathy through the master's voice...", img: "/bash.webp", url: "https://inkspiredk.vercel.app/article/kovarkazhutha", slug: "kovarkazhutha" }
                            ];

                        const spotlight = allItems[0];
                        const gridItems = allItems.slice(1, 7);

                        return (
                            <div className="space-y-12">
                                {/* 1. The Spotlight (Slot 1) */}
                                {spotlight && (
                                <div className="bg-white rounded-[32px] overflow-hidden shadow-premium border border-slate-100 reveal-card flex flex-col lg:flex-row group hover:shadow-premium-hover hover-lift transition-all duration-700">
                                    <a href={spotlight.url || `${siteSettings?.inkspireUrl || 'https://inkspiredk.vercel.app'}/article/${spotlight.slug}`} target="_blank" rel="noopener noreferrer" className="w-full lg:w-[55%] aspect-video lg:aspect-auto relative overflow-hidden block bg-slate-50">
                                        <Image 
                                            alt={spotlight.title} 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                            src={spotlight.img || ''} 
                                            fill
                                        />
                                        {/* DLK Watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none">
                                            <span className="text-[180px] lg:text-[240px] font-black tracking-tighter uppercase leading-none" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>DLK</span>
                                        </div>
                                    </a>
                                    <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center bg-white">
                                        <div className="flex gap-2 mb-6">
                                            <span className="px-4 py-1.5 bg-[#2D8B8B]/10 text-[#2D8B8B] rounded-lg text-[10px] font-bold uppercase tracking-wider">Profound</span>
                                            <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">Review</span>
                                        </div>
                                        <h3 className="font-serif-premium text-[26px] lg:text-[34px] text-[#003459] font-bold mb-4 leading-[1.2] hover:text-[#005D91] transition-colors cursor-pointer">
                                            {spotlight.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-6 text-slate-500">
                                            <span className="material-symbols-outlined text-[16px]">person</span>
                                            <span className="font-medium text-[13px] tracking-tight">{spotlight.author}</span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed mb-8 line-clamp-4 text-[15px]">
                                            {spotlight.desc}
                                        </p>
                                        <div>
                                            <a href={spotlight.url || `${siteSettings?.inkspireUrl || 'https://inkspiredk.vercel.app'}/article/${spotlight.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-black text-white px-8 py-3.5 rounded-lg font-bold tracking-widest text-[11px] uppercase hover:bg-slate-800 transition-all group/btn">
                                                Read Article <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* 2. The 6-Box Grid (Slots 2-7) */}
                                {gridItems.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {gridItems.map((art: IFeaturedArticle, i: number) => (
                                        <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-premium border border-slate-100 reveal-card stagger-delay group hover:-translate-y-1.5 hover:shadow-premium-hover transition-all duration-500" style={{ animationDelay: `${(i % 3) * 0.1}s` }}>
                                            <a href={art.url || `${siteSettings?.inkspireUrl || 'https://inkspiredk.vercel.app'}/article/${art.slug}`} target="_blank" rel="noopener noreferrer" className="aspect-[4/3] relative overflow-hidden block">
                                                <Image 
                                                    alt={art.title} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                    src={art.img || ''} 
                                                    fill
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold text-slate-800 uppercase tracking-wider rounded border border-slate-200 shadow-sm">{art.tag || 'Article'}</span>
                                                </div>
                                            </a>

                                            <div className="p-6 flex flex-col flex-1 bg-white">
                                                <h3 className="font-serif-premium text-[18px] text-[#003459] font-bold leading-tight mb-3 group-hover:text-[#005D91] transition-colors line-clamp-2">{art.title}</h3>
                                                <div className="flex items-center gap-1.5 mb-4 text-slate-400">
                                                    <span className="material-symbols-outlined text-[14px]">person</span>
                                                    <span className="text-[11px] font-medium tracking-tight">{art.author}</span>
                                                </div>
                                                <p className="text-slate-500 text-[13px] leading-relaxed mb-6 line-clamp-3">{art.desc}</p>
                                                
                                                <div className="mt-auto">
                                                    <a href={art.url || `${siteSettings?.inkspireUrl || 'https://inkspiredk.vercel.app'}/article/${art.slug}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F0F7FF] text-[#005D91] rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-black hover:text-white hover:border-black transition-all duration-300 border border-[#D0E6FF]">
                                                        Read More
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Footer Action */}
                    <div className="mt-16 text-center reveal-card">
                        <a href={siteSettings?.inkspireUrl || 'https://inkspiredk.vercel.app'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-10 py-3.5 border-2 border-[#003459] text-[#003459] hover:bg-[#003459] hover:text-white rounded-lg font-bold uppercase tracking-widest text-[11px] transition-all group">
                            View All Student Articles <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* 6. Upcoming Events Flow Layout */}
            <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-left mb-16 reveal-card">
                        <p className="text-[#B1976B] font-label tracking-widest uppercase text-xs font-bold mb-3">Join Our Journey</p>
                        <h2 className="text-[32px] lg:text-[42px] text-[#003459] font-serif-premium mb-4">Upcoming Events</h2>
                        <div className="w-full h-[1.5px] bg-[#2D8B8B]/40"></div>
                    </div>
                    
                    <div className="flex gap-6 lg:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                        {(events.length > 0 ? events : [
                            { d: "12", m: "Dec", t: "Symposium on Medieval Logic", l: "Main Auditorium", time: "09:00 AM - 04:00 PM", active: true },
                            { d: "15", m: "Dec", t: "The Art of Illumination Workshop", l: "Manuscript Hall", time: "10:30 AM - 01:00 PM", active: false },
                            { d: "20", m: "Dec", t: "Annual Research Fellowship Dinner", l: "Grand Banquet Hall", time: "07:00 PM Onwards", active: false }
                        ]).map((ev, i) => (
                            <div key={i} className={`min-w-[300px] lg:min-w-[340px] snap-center bg-white rounded-2xl p-8 flex flex-col justify-between border ${ev.active ? 'border-[#005D91] shadow-premium-hover' : 'border-slate-50 shadow-premium'} hover:shadow-premium-hover hover-lift transition-all duration-500 reveal-card stagger-delay relative group min-h-[320px]`} style={{ animationDelay: `${i * 0.1}s` }}>
                                {ev.active && (
                                    <div className="absolute top-5 right-5 flex items-center gap-2 bg-[#B1976B]/10 text-[#B1976B] px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#B1976B]/20">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B1976B] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B1976B]"></span>
                                        </span>
                                        Live
                                    </div>
                                )}
                                <div>
                                    <div className="w-16 h-16 bg-navy rounded-2xl flex flex-col items-center justify-center text-white mb-8 shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                        <span className="text-xl font-bold leading-none">{ev.d}</span>
                                        <span className="text-[10px] uppercase tracking-widest mt-1 opacity-90 text-accent">{ev.m}</span>
                                    </div>
                                    <h3 className="text-2xl text-navy font-bold mb-6 leading-snug line-clamp-3 group-hover:text-primary transition-colors">{ev.t}</h3>
                                </div>
                                <div className="space-y-4 text-slate-blue mt-auto pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-sm text-[#005D91]">location_on</span>
                                        </div>
                                        <span className="text-sm font-medium">{ev.l}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-sm text-[#005D91]">schedule</span>
                                        </div>
                                        <span className="text-sm font-medium">{ev.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* 8. News & Updates Section */}
            <section className="py-20 lg:py-32 bg-white relative font-body">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header Design */}
                    <div className="text-left mb-16 reveal-card">
                        <p className="text-[#B1976B] font-label tracking-widest uppercase text-xs font-bold mb-3">Press & Information</p>
                        <h2 className="text-[32px] lg:text-[42px] text-[#003459] font-serif-premium mb-4">Institutional Updates</h2>
                        <div className="w-full h-[1.5px] bg-[#2D8B8B]/40"></div>
                    </div>
                    
                    {/* The Grid Layout (3-columns like before) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {(news.length > 0 ? news : [
                            { type: 'Campus News', title: 'Inauguration of the New Al-Hikmah Research Center', desc: 'A state-of-the-art facility dedicated to the digital preservation of classical Islamic texts and global scholarly collaboration.', img: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop', slug: 'inauguration-hikmah', date: new Date(), createdAt: new Date() },
                            { type: 'Academic', title: 'Admissions Open for 2024-25 Scholarly Fellowships', desc: 'Applications are now being accepted for our prestigious residential fellowship programs in traditional logic and philosophy.', img: 'https://images.unsplash.com/photo-1577985051167-0d49eec21977?q=80&w=800&auto=format&fit=crop', slug: 'admissions-open', date: new Date(), createdAt: new Date() },
                            { type: 'International', title: 'Partnership Signed with Oxford Center for Islamic Studies', desc: 'Enhancing student exchange opportunities and joint research initiatives between our global campuses.', img: 'https://images.unsplash.com/photo-1546415822-8350cc8eb808?q=80&w=800&auto=format&fit=crop', slug: 'partnership-oxford', date: new Date(), createdAt: new Date() },
                        ] as any[]).map((article, index) => (
                            <Link href={`/updates/${article.slug}`} key={index} className="flex flex-col group cursor-pointer reveal-card hover-lift transition-all duration-500 stagger-delay no-underline" style={{ animationDelay: `${(index % 3) * 0.1}s` }}>
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-premium group-hover:shadow-premium-hover transition-all duration-500 relative bg-white">
                                    <Image 
                                        alt={article.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
                                        src={article.img || ''} 
                                        fill
                                    />
                                    <div className="absolute inset-0 bg-[#005D91]/0 group-hover:bg-[#005D91]/5 transition-colors duration-500"></div>
                                </div>
                                <div className="flex flex-col flex-grow px-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] text-[#005D91] font-bold uppercase tracking-[0.15em] border-l-2 border-[#005D91] pl-2">{article.type}</span>
                                        <span className="text-[10px] text-slate-blue font-serif-premium italic">
                                            {(() => {
                                                const d = article.date || article.createdAt;
                                                return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
                                            })()}
                                        </span>
                                    </div>
                                    <h3 className="text-[1.25rem] font-bold text-navy mb-4 leading-snug group-hover:text-[#005D91] transition-colors">{article.title}</h3>
                                    <p className="text-slate-blue text-sm mb-6 font-normal leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{article.desc}</p>
                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-[#005D91] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                                        <span>Read more</span>
                                        <span className="material-symbols-outlined text-sm ml-2">arrow_right_alt</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-16 text-center reveal-card">
                        <Link href="/updates" className="inline-flex items-center gap-3 px-10 py-4 border-2 border-slate-100 text-navy hover:border-[#005D91] hover:bg-slate-50 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1">
                            View All Updates <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            </div>

        </main>
    );
}
