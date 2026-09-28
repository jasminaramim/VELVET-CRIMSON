import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { lang, t, categories, navigateToCategory } = useApp();

  return (
    <div className="py-16 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
            {lang === 'bn' ? 'এক্সক্লুসিভ ক্যাটাগরি কালেকশন' : 'CURATED COUTURE DEPARTMENTS'}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            {t.sections.featuredCategories}
          </h1>
          <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base font-light">
            {lang === 'bn'
              ? 'ক্রিমসন রেড ও সাদার বৈচিত্র্যময় সম্ভারে সাজানো আমাদের প্রতিটি ক্যাটাগরি। আপনার পছন্দসই ফ্যাশন বিভাগটি নির্বাচন করুন।'
              : 'Immerse yourself in our crimson red and pure white collections, meticulously designed for distinction, comfort, and timeless elegance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateToCategory(cat.slug)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-[#8B0E1A]/90 transition-colors duration-500" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-widest text-red-200">
                  {cat.productCount} {lang === 'bn' ? 'টি পোশাক' : 'Designs'}
                </span>
                <h3 className="font-editorial text-2xl font-bold mt-1 text-white">
                  {lang === 'bn' ? cat.nameBn : cat.name}
                </h3>
                <p className="text-xs text-gray-300 font-light mt-1 line-clamp-2">
                  {lang === 'bn' ? cat.descriptionBn : cat.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-amber-200 transition-colors">
                  <span>{lang === 'bn' ? 'কালেকশন দেখুন' : 'Explore Category'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
