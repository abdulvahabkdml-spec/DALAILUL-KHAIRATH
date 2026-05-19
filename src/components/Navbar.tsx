'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Hidden Admin Shortcut: Ctrl + Shift + A
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                router.push('/hq');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [router]);

    const navLinks = [
        { name: 'Home', href: '/', active: isHomePage },
        { 
            name: 'About', 
            href: '/about', 
            hasDropdown: true, 
            subLinks: [
                { name: 'Our Story', href: '/about#our-story' },
                { name: 'Vision & Mission', href: '/about#vision-mission' }
            ] 
        },
        { 
            name: 'Updates', 
            href: '/updates', 
            hasDropdown: true, 
            subLinks: [
                { name: 'News', href: '/updates#news' },
                { name: 'Events', href: '/updates#events' }
            ] 
        },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav 
            className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
                ${isScrolled 
                    ? 'top-4 w-[90%] lg:w-[85%] max-w-5xl' 
                    : 'top-6 w-[95%] lg:w-[92%] max-w-7xl'
                }`}
        >
            <div className={`transition-all duration-500 rounded-[40px] pl-6 pr-8 lg:pl-12 lg:pr-16 flex items-center justify-between relative group/nav
                ${isScrolled 
                    ? 'h-22 bg-[#003459] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' 
                    : (isHomePage 
                        ? 'h-32 bg-[#0F172A]/10 backdrop-blur-md border border-white/10'
                        : 'h-24 lg:h-28 bg-[#003459] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]')
                }`}>
                {/* Subtle internal glow - rounded to match parent */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-1000 rounded-[40px] pointer-events-none"></div>

                {/* Logo Section */}
                <div className={`flex-shrink-0 relative z-10 transition-all duration-500 ${isScrolled ? '-ml-2 lg:-ml-4' : '-ml-4 lg:-ml-8'}`}>
                    <Link href="/" className="flex items-center">
                        <img 
                            src="https://res.cloudinary.com/dhdzz9rxz/image/upload/v1776790579/dk-web/general/20260421_203728-1776790570459.png" 
                            alt="Dalailul Khairath Logo" 
                            className={`w-auto object-contain brightness-0 invert transition-all duration-500 hover:opacity-100 drop-shadow-xl
                                ${isScrolled 
                                    ? 'h-14 lg:h-16 opacity-90' 
                                    : 'h-20 lg:h-24 opacity-100'
                                }`} 
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden xl:flex items-center gap-2 relative z-10">
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative group/link">
                            <Link 
                                href={link.href}
                                className={`px-4 py-2 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 rounded-xl
                                    ${link.active 
                                        ? 'bg-white/10 text-white' 
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                                {link.hasDropdown && (
                                    <span className="material-symbols-outlined text-[16px] opacity-60 group-hover/link:rotate-180 transition-transform duration-300">expand_more</span>
                                )}
                            </Link>
                            
                            {/* Dropdown Menu */}
                            {link.hasDropdown && (
                                <div className="absolute top-full left-0 pt-6 opacity-0 invisible translate-y-4 group-hover/link:opacity-100 group-hover/link:visible group-hover/link:translate-y-0 transition-all duration-500 w-56 z-50">
                                    <div className="bg-[#0F172A]/95 backdrop-blur-3xl border border-white/20 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2.5">
                                        {link.subLinks?.map((sub) => (
                                            <Link 
                                                key={sub.name} 
                                                href={sub.href} 
                                                className="block px-4 py-3 text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all hover:pl-5 group/sub"
                                            >
                                                <span className="flex items-center justify-between">
                                                    {sub.name}
                                                    <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/sub:opacity-100 -translate-x-2 group-hover/sub:translate-x-0 transition-all">chevron_right</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* DONATE Button Integrated into Pill */}
                    <Link href="/donate" className="ml-4 bg-[#005D91] text-white px-6 py-2.5 rounded-2xl font-bold text-[13px] tracking-widest flex items-center gap-2 hover:bg-[#004B7A] transition-all shadow-lg shadow-[#005D91]/20 hover:shadow-[#005D91]/30 active:scale-[0.98]">
                        DONATE <span className="material-symbols-outlined text-sm fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="xl:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-10 group"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className={`w-6 h-[2px] bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-[2px] bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-[2px] bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`xl:hidden absolute left-0 right-0 transition-all duration-500 
                ${isScrolled ? 'top-28' : 'top-44'} 
                ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                <div className="bg-[#0F172A]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl mx-2">
                    <div className="grid grid-cols-1 gap-2 text-center">
                        {navLinks.map((link) => (
                            <div key={link.name} className="flex flex-col">
                                <div className="flex items-center justify-center">
                                    <Link 
                                        href={link.href}
                                        className="flex-grow px-6 py-4 text-sm font-bold text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                        onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                    {link.hasDropdown && (
                                        <button 
                                            onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                            className="p-4 text-white/60"
                                        >
                                            <span className={`material-symbols-outlined transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </button>
                                    )}
                                </div>
                                
                                {link.hasDropdown && activeDropdown === link.name && (
                                    <div className="bg-white/5 rounded-2xl mb-2 py-2 mx-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                        {link.subLinks?.map((sub) => (
                                            <Link 
                                                key={sub.name} 
                                                href={sub.href} 
                                                className="block px-6 py-3 text-xs font-bold text-white/60 hover:text-white"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <Link 
                            href="/donate" 
                            className="mt-4 bg-[#005D91] text-white py-4 rounded-2xl font-bold text-sm tracking-widest flex items-center justify-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            DONATE <span className="material-symbols-outlined text-sm fill-1">favorite</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
