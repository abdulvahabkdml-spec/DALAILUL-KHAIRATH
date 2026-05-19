'use client';

import { useEffect } from 'react';

export default function AboutPage() {
    useEffect(() => {
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

        document.querySelectorAll('.reveal-card, .stagger-delay').forEach(el => {
            observer.observe(el);
        });

        // Ensure nav stays solid or behaves correctly on subpages
        // On subpages without a full black hero, we might want nav explicitly solid or have a small hero.
        // For about page, let's use a nice header so transparent nav still works over the hero background.
        
        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-screen bg-white">
            {/* Page Hero - Blue Banner Theme */}
            <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 w-full flex flex-col items-center justify-center overflow-hidden bg-[#005D91]">
                {/* Subtle texture for premium feel without being distracting */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#004B7A] to-[#005D91]"></div>
                <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif-premium font-bold tracking-tight reveal-card" style={{ textWrap: 'balance' }}>
                        Our Story
                    </h1>
                    <p className="mt-4 text-white/80 font-body text-base lg:text-lg max-w-2xl reveal-card stagger-delay" style={{ animationDelay: '0.2s' }}>
                        Discover our heritage, vision, and the profound legacy that drives Dalailul Khairath forward.
                    </p>
                </div>
            </header>

            {/* Narrative / Genesis Section */}
            <section id="our-story" className="py-20 lg:py-32 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <span className="material-symbols-outlined text-6xl text-[#005D91] mb-6 reveal-card" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
                    
                    {/* Establishment Badge */}
                    <div className="flex items-center justify-center gap-2 mb-8 reveal-card stagger-delay group" style={{ animationDelay: '0.1s' }}>
                        <span className="flex h-2 w-2 rounded-full bg-[#B1976B] animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B1976B]">Empowering Minds Since 2008</span>
                    </div>

                    <h2 className="text-3xl lg:text-5xl text-navy font-bold mb-10 leading-[1.2] reveal-card stagger-delay">The Genesis of Knowledge</h2>
                    <div className="space-y-8 text-slate-blue text-lg lg:text-xl font-normal leading-relaxed reveal-card stagger-delay" style={{ animationDelay: '0.2s' }}>
                        <p>Dalailul Khairath was founded on a singular powerful belief: that true erudition requires both the preservation of historical artifacts and the progressive development of modern pedagogical methods.</p>
                        <p>Over the decades, we have transformed from a small local manuscript repository into a sprawling, globally active institution dedicated to ethical scholarship and societal advancement.</p>
                    </div>
                </div>
            </section>



            {/* Vision & Mission Cards */}
            <section id="vision-mission" className="py-20 lg:py-32 bg-white border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Vision Card */}
                        <div className="bg-white p-10 lg:p-16 rounded-3xl shadow-soft border border-[#005D91]/5 reveal-card hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-16 h-16 bg-[#005D91]/5 rounded-2xl flex items-center justify-center mb-8">
                                <span className="material-symbols-outlined text-3xl text-[#005D91]">visibility</span>
                            </div>
                            <h3 className="text-3xl font-bold text-navy mb-6">Our Vision</h3>
                            <p className="text-slate-blue text-base lg:text-lg leading-relaxed font-normal">
                                To be the global nexus for Islamic and classical scholarship, pioneering research that harmonizes the intellectual achievements of our ancestors with the technological possibilities of the future.
                            </p>
                        </div>
                        {/* Mission Card */}
                        <div className="bg-[#005D91] p-10 lg:p-16 rounded-3xl shadow-premium text-white reveal-card stagger-delay hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-3xl text-white">rocket_launch</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                            <p className="text-white/80 text-base lg:text-lg leading-relaxed font-normal">
                                To cultivate a rigorous academic environment that produces not just scholars, but enlightened community leaders bound by ethical integrity, analytical excellence, and deep societal compassion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}
