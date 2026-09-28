import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { lang, t, reviews } = useApp();

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#B11226] text-xs font-semibold tracking-[0.25em] uppercase">
            {lang === 'bn' ? 'সম্মানিত ক্লায়েন্টদের অভিজ্ঞতা' : 'PATRON ACCOLADES'}
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#111111] mt-2 mb-3">
            {t.sections.customerReviews}
          </h2>
          <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base font-light">
            {t.sections.reviewsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-red-100 absolute top-6 right-6 pointer-events-none" />

              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review comment quote */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  "{lang === 'bn' && rev.commentBn ? rev.commentBn : rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{rev.customerName}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-0.5">
                    <CheckCircle className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified Buyer'}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
