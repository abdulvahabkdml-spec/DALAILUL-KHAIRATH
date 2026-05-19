import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#003459] pt-10 pb-6 text-white relative overflow-hidden" style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}>
            <div className="max-w-6xl mx-auto px-6 lg:px-10 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                    {/* Column 1: Brand — flush left */}
                    <div className="w-full md:w-[28%] flex flex-col items-start">
                        <div className="mb-5">
                            <img
                                src="https://res.cloudinary.com/dhdzz9rxz/image/upload/v1776790579/dk-web/general/20260421_203728-1776790570459.png"
                                alt="Dalailul Khairath Logo"
                                className="w-[160px] h-auto brightness-0 invert object-contain"
                            />
                        </div>
                        {/* Description: #E0E0E0, 13px, weight 400, line-height 1.6 */}
                        <p style={{ color: '#E0E0E0', fontSize: '13px', fontWeight: 400, lineHeight: 1.6, textAlign: 'left' }}>
                            Dalailul Khairath Islamic Foundation fosters both scholarship and spirituality, blending classical Islamic teachings with contemporary fields. Its inclusive community promotes thoughtful dialogue, while the peaceful campus encourages balanced development. Guided by strong values and devoted teachers, the DK shapes compassionate, skilled leaders committed to societal service.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="w-full md:w-[15%] flex flex-col">
                        {/* Section Title: #E2AA43, 15px, 700, Title Case, mb-20px */}
                        <h4 style={{ color: '#E2AA43', fontSize: '15px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.01em' }}>Quick Links</h4>
                        <ul className="flex flex-col" style={{ gap: '12px' }}>
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Our Story', href: '/about' },
                                { name: 'Vision & Mission', href: '/about' },
                                { name: 'Contact Us', href: '/contact' }
                            ].map(link => (
                                <li key={link.name}>
                                    {/* Link items: #E0E0E0, 14px, 400 */}
                                    <Link href={link.href} style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 400 }} className="whitespace-nowrap hover:text-[#E2AA43] transition-colors block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Links */}
                    <div className="w-full md:w-[15%] flex flex-col">
                        <h4 style={{ color: '#E2AA43', fontSize: '15px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.01em' }}>Links</h4>
                        <ul className="flex flex-col" style={{ gap: '12px' }}>
                            {[
                                { name: 'About', href: '/about' },
                                { name: 'Events', href: '/updates' },
                                { name: 'News', href: '/updates' },
                                { name: 'Care Donation', href: '/donate' },
                                { name: 'Location', href: '/contact' }
                            ].map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 400 }} className="whitespace-nowrap hover:text-[#E2AA43] transition-colors block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact & Socials */}
                    <div className="w-full md:w-[26%] flex flex-col">
                        <h4 style={{ color: '#E2AA43', fontSize: '15px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.01em' }}>Get In Touch</h4>

                        {/* Contact items: #E0E0E0, 14px, 400, 14px gap between rows */}
                        <div className="flex flex-col" style={{ gap: '14px', marginBottom: '20px' }}>

                            {/* Address */}
                            <div className="flex gap-2.5 items-start">
                                <span className="material-symbols-outlined flex-shrink-0" style={{ color: 'white', fontSize: '16px', marginTop: '1px' }}>location_on</span>
                                <p style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 400, lineHeight: 1.5 }}>
                                    Dalailul Khairath, Kakkidippuram, Malappuram, Kerala 679582
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-2.5 items-center">
                                <span className="material-symbols-outlined flex-shrink-0" style={{ color: 'white', fontSize: '16px' }}>call</span>
                                <p style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 400 }}>+91 8123456789</p>
                            </div>

                            {/* Email */}
                            <div className="flex gap-2.5 items-center">
                                <span className="material-symbols-outlined flex-shrink-0" style={{ color: 'white', fontSize: '16px' }}>mail</span>
                                <a href="mailto:info@dalailulkhairath.com" style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 400 }} className="hover:text-white hover:underline break-all">
                                    info@dalailulkhairath.com
                                </a>
                            </div>
                        </div>

                        {/* Connect With Us */}
                        <h5 style={{ color: '#E2AA43', fontSize: '15px', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.01em' }}>Connect With Us</h5>
                        <div className="flex gap-[10px]">
                            <a href="https://www.facebook.com/profile.php?id=100095405598376&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                            </a>
                            <a href="https://www.instagram.com/dalailul_khairath_?igsh=eXZiYXBrMGtlN2U2" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright Bar: rgba(255,255,255,0.7), 12px, 400, centered */}
                <div className="mt-8 pt-4 border-t border-white/10 flex justify-center">
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 400, textAlign: 'center' }}>
                        &copy; 2026 Dalailul Khairath Islamic Foundation. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
