'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Mocked Cloudinary Posters (A4 Format)
const HALL_OF_FAME = [
    { id: 'p1', src: '/p1.jpg', title: 'Academic Distinction' },
    { id: 'p2', src: '/p2.jpeg', title: 'Scholarly Achievement' },
    { id: '1', src: 'https://images.unsplash.com/photo-1544813545-4827233fcbc2?q=80&w=800&auto=format&fit=crop', title: 'Academic Excellence 2024' },
    { id: '2', src: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop', title: 'Global Scholars Award' },
    { id: '3', src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop', title: 'Community Leadership' },
    { id: '4', src: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop', title: 'Innovation & Research' },
];

export default function AchievementSlider() {
    return (
        <section className="py-16 bg-[#FFFFFF] overflow-hidden relative group/section h-[600px] flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-6 mb-10 shrink-0">
                <div className="flex items-center gap-4 mb-2">
                    <span className="w-8 h-[1px] bg-[#B1976B]"></span>
                    <span className="text-[#B1976B] font-label text-[10px] font-bold uppercase tracking-[0.3em]">Excellence</span>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl text-[#005D91] font-bold tracking-tight">Hall of Fame</h2>
            </div>

            {/* The Infinite Shift Gallery */}
            <div className="w-full relative">
                <Swiper
                    modules={[Autoplay, Navigation]}
                    grabCursor={true}
                    centeredSlides={false}
                    slidesPerView={'auto'}
                    spaceBetween={40}
                    loop={true}
                    speed={12000} 
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    className="infinite-gallery-swiper"
                >
                    {HALL_OF_FAME.map((poster) => (
                        <SwiperSlide 
                            key={poster.id} 
                            className="w-[300px] aspect-[1/1.4]"
                        >
                            <div className="w-full h-full bg-white rounded-md overflow-hidden border border-slate-100 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] group/poster cursor-pointer">
                                <Image 
                                    src={poster.src} 
                                    alt={poster.title} 
                                    className="w-full h-full object-cover"
                                    fill
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Arrows (Visible on Section Hover) */}
                <button className="swiper-button-prev-custom absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-white shadow-lg text-[#005D91]">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <button className="swiper-button-next-custom absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-white shadow-lg text-[#005D91]">
                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
            </div>

            <style jsx global>{`
                .swiper-pagination-bullet { background: rgba(255, 255, 255, 0.5); width: 8px; height: 8px; transition: all 0.3s; }
                .swiper-pagination-bullet-active { background: #B1976B; width: 24px; border-radius: 12px; }
                .infinite-gallery-swiper {
                    overflow: visible !important;
                }
                /* Ensure linear motion for constant flow */
                .infinite-gallery-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>
        </section>
    );
}
