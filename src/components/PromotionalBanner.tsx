import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

export const PromotionalBanner: React.FC = () => {
  const { lang, t, setCurrentPage, setSelectedCategory, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText('CRIMSON20');
    setCopied(true);
    showToast(lang === 'bn' ? 'কুপন কোড কপি করা হয়েছে: CRIMSON20' : 'Copied coupon code: CRIMSON20', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#8B0E1A] via-[#B11226] to-[#55060E] text-white shadow-2xl p-8 sm:p-12 lg:p-16">
          {/* Subtle background luxury pattern */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -top-12 w-64 h-64 rounded-full bg-black/20 blur-xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs uppercase tracking-widest font-semibold backdrop-blur-xs mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? 'সীমিত সময়ের বিশেষ অফার' : 'LIMITED FESTIVE RUNWAY PROMO'}</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                {t.sections.seasonSale}
              </h2>

              <p className="text-gray-100 text-base sm:text-lg font-light leading-relaxed max-w-xl mb-6">
                {t.sections.saleSubtitle}
              </p>

              {/* Coupon code box */}
              <div className="inline-flex items-center gap-3 bg-black/40 border border-white/25 rounded-lg p-2.5 backdrop-blur-md mb-8">
                <div className="px-3 py-1 bg-white text-gray-900 font-mono font-bold tracking-widest text-sm rounded">
                  CRIMSON20
                </div>
                <span className="text-xs text-gray-200 hidden sm:inline">
                  {lang === 'bn' ? '২০% অতিরিক্ত ছাড়ের জন্য কোডটি কপি করুন' : 'Copy for extra 20% off at checkout'}
                </span>
                <button
                  onClick={copyCoupon}
                  className="px-3 py-1 bg-[#B11226] hover:bg-[#8B0E1A] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি করুন' : 'Copy')}</span>
                </button>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage('shop');
                  }}
                  className="px-8 py-3.5 bg-white text-[#8B0E1A] hover:bg-gray-100 text-sm font-bold tracking-widest uppercase rounded-sm shadow-xl transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t.sections.shopSale}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Fashion Model Vignette */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative mx-auto w-72 h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
                  alt="Velvet Crimson Festive Edit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-xs font-medium uppercase tracking-widest text-amber-200">
                    {lang === 'bn' ? 'রাজকীয় ফ্যাশন সম্ভার' : 'AUTUMN SOIRÉE 2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
