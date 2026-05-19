'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const SLIDES = [
    {
        bg: '/h1.jpg',
        h1: 'The Pursuit of Wisdom',
        h2: 'Deepening the roots of knowledge through dedicated personal study.',
        h3: 'Foundation Level',
    },
    {
        bg: '/h2.jpg',
        h1: 'Intellectual Dialogue',
        h2: 'Building a community of scholars through shared inquiry and debate.',
        h3: 'Academic Exchange',
    },
    {
        bg: '/h3.jpg',
        h1: 'A Circle of Excellence',
        h2: 'A global network of learning that connects hearts and minds across borders.',
        h3: 'Our Global Campus',
    },
];

export default function HeroSlider() {
    return (
        <section className="relative w-full h-screen bg-[#0A1118] overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                speed={1500}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="w-full h-full"
            >
                {SLIDES.map((slide, idx) => (
                    <SwiperSlide key={idx} className="relative w-full h-full overflow-hidden">
                        {({ isActive }) => (
                            <>
                                <div
                                    className={`absolute inset-0 w-full h-full transition-transform duration-[10000ms] ease-out ${
                                        isActive ? 'scale-110 translate-x-0' : 'scale-100 translate-x-4'
                                    }`}
                                    style={{
                                        backgroundImage: `url(${slide.bg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/60"></div>
                                </div>

                                <div className="absolute inset-0 z-10 flex items-center justify-center px-6 mt-16">
                                    <div 
                                        className={`max-w-4xl w-full text-center flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-8 md:p-14 lg:p-16 transition-all duration-1000 delay-300 shadow-2xl ${
                                            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                    >
                                        <div className="mb-6 px-6 py-2 rounded-[24px] bg-white/20 backdrop-blur-lg border border-white/30 shadow-sm inline-block">
                                            <span className="text-white font-sans tracking-[0.2em] uppercase text-xs md:text-sm font-semibold">
                                                {slide.h3}
                                            </span>
                                        </div>

                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline text-white font-bold tracking-tight mb-6 drop-shadow-lg leading-[1.1]">
                                            {slide.h1}
                                        </h1>

                                        <h2 className="text-white/95 font-sans text-base md:text-xl lg:text-2xl font-light tracking-wide max-w-2xl leading-relaxed">
                                            {slide.h2}
                                        </h2>
                                    </div>
                                </div>
                            </>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            <style jsx global>{`
                .swiper-pagination-bullet { background: rgba(255, 255, 255, 0.5); width: 8px; height: 8px; transition: all 0.3s; }
                .swiper-pagination-bullet-active { background: #B1976B; width: 24px; border-radius: 12px; }
            `}</style>
        </section>
    );
}
