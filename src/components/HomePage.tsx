import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSlider } from './HeroSlider';
import { FeaturedCategories } from './FeaturedCategories';
import { ProductCard } from './ProductCard';
import { PromotionalBanner } from './PromotionalBanner';
import { WhyChooseUs } from './WhyChooseUs';
import { CustomerReviews } from './CustomerReviews';
import { Newsletter } from './Newsletter';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { lang, t, products, setCurrentPage, setSelectedCategory } = useApp();

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSelling).slice(0, 4);

  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section Slider */}
      <HeroSlider />

      {/* Professional Polish Editorial Highlights Ribbon */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {/* Item 1: New Arrival teaser */}
          <div
            onClick={() => {
              if (newArrivals[0]) {
                setCurrentPage('shop');
              }
            }}
            className="flex flex-col cursor-pointer group"
          >
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
              {lang === 'bn' ? 'নতুন কালেকশন' : 'New Arrivals'}
            </div>
            <div className="flex items-center space-x-3.5">
              <img
                src={newArrivals[0]?.images[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                alt=""
                className="w-14 h-16 object-cover rounded bg-gray-100 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="text-xs font-bold text-gray-900 group-hover:text-[#B11226] transition-colors line-clamp-1">
                  {lang === 'bn' ? (newArrivals[0]?.nameBn || 'ভেলভেট ইভনিং গাউন') : (newArrivals[0]?.name || 'Velvet Evening Gown')}
                </div>
                <div className="text-xs text-[#B11226] font-semibold mt-0.5">
                  {t.currency}{newArrivals[0]?.discountPrice?.toLocaleString() || newArrivals[0]?.price?.toLocaleString() || '4,500'}
                </div>
              </div>
            </div>
          </div>

          {/* Item 2: Featured Category teaser */}
          <div
            onClick={() => {
              setSelectedCategory('sarees');
              setCurrentPage('shop');
            }}
            className="flex flex-col cursor-pointer group"
          >
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
              {lang === 'bn' ? 'নির্বাচিত ক্যাটাগরি' : 'Featured Category'}
            </div>
            <div className="flex items-center space-x-3.5">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="w-14 h-16 object-cover rounded bg-gray-100 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="text-xs font-bold text-gray-900 group-hover:text-[#B11226] transition-colors">
                  {lang === 'bn' ? 'সিগনেচার শাড়ি' : 'Signature Sarees'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {lang === 'bn' ? '১২৪টি এক্সক্লুসিভ পিস' : '124 Bespoke Items'}
                </div>
              </div>
            </div>
          </div>

          {/* Item 3 & 4: Season Sale Crimson Banner */}
          <div className="col-span-1 sm:col-span-2 bg-[#B11226] p-4 sm:p-5 rounded-lg text-white flex flex-row items-center justify-between shadow-md">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/90">
                {lang === 'bn' ? 'সিজনাল সেল' : 'Season Sale'}
              </div>
              <div className="text-xl sm:text-2xl font-serif italic text-white mt-0.5">
                {lang === 'bn' ? '৪০% পর্যন্ত আকর্ষণীয় ছাড়' : 'Up to 40% Off'}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage('shop');
              }}
              className="bg-white text-[#B11226] hover:bg-gray-100 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded shadow-md transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'অফার দেখুন' : 'Shop Sale'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Featured Categories Section */}
      <FeaturedCategories />

      {/* 3. New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#B11226] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'তাজা কালেকশন' : 'JUST ARRIVED'}</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900">
                {t.sections.newArrivals}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-light mt-1 max-w-xl">
                {t.sections.newArrivalsSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage('shop');
              }}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B11226] hover:text-[#8B0E1A] group cursor-pointer"
            >
              <span>{t.sections.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner with Coupon Code */}
      <PromotionalBanner />

      {/* 5. Best Sellers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#B11226] mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{lang === 'bn' ? 'জনপ্রিয় স্টাইল' : 'MOST ADMIRED'}</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900">
                {t.sections.bestSellers}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-light mt-1 max-w-xl">
                {t.sections.bestSellersSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage('shop');
              }}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B11226] hover:text-[#8B0E1A] group cursor-pointer"
            >
              <span>{t.sections.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us (4 feature badges) */}
      <WhyChooseUs />

      {/* 7. Customer Reviews Testimonials */}
      <CustomerReviews />

      {/* 8. Newsletter Subscription */}
      <Newsletter />
    </div>
  );
};
