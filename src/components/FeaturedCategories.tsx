import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight } from 'lucide-react';

export const FeaturedCategories: React.FC = () => {
  const { lang, t, categories, navigateToCategory } = useApp();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#B11226] text-xs font-semibold tracking-[0.25em] uppercase">
            {lang === 'bn' ? 'এক্সক্লুসিভ কালেকশন' : 'CURATED SELECTIONS'}
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#111111] mt-2 mb-3">
            {t.sections.featuredCategories}
          </h2>
          <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base font-light">
            {t.sections.categoriesSubtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateToCategory(cat.slug)}
              className="group relative h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-[#8B0E1A]/90 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white z-10">
                <span className="text-xs uppercase tracking-widest text-gray-300 group-hover:text-red-200 transition-colors">
                  {cat.productCount} {lang === 'bn' ? 'টি পোশাক' : 'Designs'}
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-wide mt-1 text-white">
                  {lang === 'bn' ? cat.nameBn : cat.name}
                </h3>
                
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <span>{lang === 'bn' ? 'কালেকশন দেখুন' : 'Shop Now'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
