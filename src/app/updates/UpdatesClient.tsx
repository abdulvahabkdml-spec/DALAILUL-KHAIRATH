'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INews } from '@/models/News';

export default function UpdatesClient({ initialArticles }: { initialArticles: INews[] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash.substring(1);
            if (hash === 'news') setActiveFilter('Campus News');
            if (hash === 'events') setActiveFilter('Events');
        };
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
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

        document.querySelectorAll('.reveal-card, .stagger-delay').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [activeFilter]); // Re-run observer when filter changes to catch new renders

    const articles = initialArticles && initialArticles.length > 0 ? initialArticles : [];

    const filteredArticles = activeFilter === 'All' 
        ? articles 
        : articles.filter((a: any) => a.type.includes(activeFilter) || a.type === activeFilter);

    return (
        <main className="min-h-screen bg-white">
            {/* Updates Hero - Blue Banner Theme */}
            <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 w-full flex flex-col items-center justify-center bg-[#005D91] overflow-visible">
                {/* Subtle texture gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#004B7A] to-[#005D91] pointer-events-none"></div>
                
                <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mb-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif-premium font-bold tracking-tight reveal-card" style={{ textWrap: 'balance' }}>
                        Updates
                    </h1>
                    <p className="mt-4 text-white/80 font-body text-base lg:text-lg max-w-2xl reveal-card stagger-delay" style={{ animationDelay: '0.2s' }}>
                        Stay updated with the latest happenings
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="relative z-20 w-full px-6 flex justify-center translate-y-6">
                    <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-2 px-2 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                        {['All', 'Campus News', 'Academic', 'Heritage', 'International', 'Events'].map(filter => (
                            <button 
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
                                    activeFilter === filter 
                                        ? 'bg-[#005D91] text-white shadow-md' 
                                        : 'bg-white text-slate-800 hover:bg-slate-50 shadow-sm'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Updates Grid Layout */}
            <section id="news" className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-left mb-16 reveal-card">
                        <h2 className="text-[32px] lg:text-[42px] text-[#003459] font-serif-premium mb-4">Institutional Updates</h2>
                        <div className="w-full h-[1.5px] bg-[#2D8B8B]/40"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {filteredArticles.map((article: any, index: number) => (
                            <Link
                                key={article._id || index}
                                href={`/updates/${article.slug}`}
                                className="flex flex-col group cursor-pointer reveal-card no-underline"
                                style={{ animationDelay: `${(index % 3) * 0.1}s` }}
                            >
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500 relative bg-slate-50/50 border border-slate-100">
                                    <Image 
                                        alt={article.title} 
                                        className="w-full h-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
                                        src={article.img || ''} 
                                        fill
                                    />
                                    <div className="absolute inset-0 bg-[#005D91]/0 group-hover:bg-[#005D91]/5 transition-colors duration-500 pointer-events-none"></div>
                                </div>
                                <div className="flex flex-col flex-grow px-2">
                                    <span className="text-[10px] text-[#005D91] font-bold uppercase tracking-[0.15em] mb-3 border-l-2 border-[#B1976B] pl-2">{article.type}</span>
                                    <h3 className="font-headline text-[1.25rem] font-bold text-navy mb-4 leading-snug group-hover:text-[#005D91] transition-colors">{article.title}</h3>
                                    <p className="text-on-surface-variant text-sm mb-6 font-normal leading-relaxed whitespace-pre-wrap">{article.desc}</p>
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 text-[#005D91] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                                        <span>Read more</span>
                                        <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
