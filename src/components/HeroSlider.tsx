import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { initialHeroBanners } from '../data/mockData';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { lang, setCurrentPage, setSelectedCategory } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = initialHeroBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const banner = banners[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#111111] text-white">
      {/* Background Image Carousel with Overlay */}
      <div className="relative min-h-[580px] lg:h-[680px] w-full flex items-center">
        {banners.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B0E1A]/25 to-transparent" />
          </div>
        ))}

        {/* Floating Monogram Watermark */}
        <div className="absolute text-[160px] sm:text-[240px] font-serif font-bold text-white/5 select-none right-6 top-8 leading-none pointer-events-none z-10">
          V/C
        </div>

        {/* Content Box with Grid matching theme */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 text-left animate-in fade-in slide-in-from-left-6 duration-700">
            {/* Hairline Badge */}
            <div className="flex items-center space-x-2 text-[11px] font-bold text-[#B11226] tracking-widest uppercase mb-4">
              <span className="w-8 h-[1px] bg-[#B11226]" />
              <span className="text-white/90">{lang === 'bn' ? banner.badgeBn : banner.badge}</span>
            </div>

            {/* Headline with High-Fashion Serif and Crimson Accent */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[0.95] mt-3 mb-6 font-bold tracking-tight">
              {banner.title.includes('Crimson') ? (
                <>
                  {banner.title.split('Crimson')[0]}
                  <span className="italic text-[#B11226]">Crimson</span>
                  {banner.title.split('Crimson')[1]}
                </>
              ) : (
                banner.title
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 max-w-xl text-sm sm:text-base mb-10 leading-relaxed font-light">
              {lang === 'bn' ? banner.subtitleBn : banner.subtitle}
            </p>

            {/* CTA Buttons - Professional Polish Style */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage('shop');
                }}
                className="bg-[#B11226] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#8B0E1A] shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 group"
              >
                <span>{lang === 'bn' ? banner.buttonTextBn : banner.buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentPage('categories')}
                className="border border-white/80 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-all duration-200 cursor-pointer"
              >
                {lang === 'bn' ? banner.secondaryButtonTextBn : banner.secondaryButtonText}
              </button>
            </div>
          </div>

          {/* Right editorial signature badge */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-end text-right z-20">
            <div className="p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
              <div className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-semibold mb-1">
                {lang === 'bn' ? 'এক্সক্লুসিভ ব্রাইডাল কালেকশন' : 'Exclusive Bridal & Evening'}
              </div>
              <div className="text-white text-2xl font-serif italic">
                Redesigned.
              </div>
              <div className="w-10 h-0.5 bg-[#B11226] ml-auto mt-3" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#B11226] text-white backdrop-blur-xs border border-white/10 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#B11226] text-white backdrop-blur-xs border border-white/10 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#B11226]' : 'w-2 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
