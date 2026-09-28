import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { lang, t, wishlist, products, setCurrentPage } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 bg-[#FAFAFA] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#B11226] flex items-center gap-1.5 transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}</span>
            </button>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-7 h-7 text-[#B11226] fill-[#B11226]" />
              <span>{t.wishlist.title}</span>
            </h1>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {wishlistedProducts.length} {lang === 'bn' ? 'টি সংরক্ষিত পণ্য' : 'Saved Items'}
          </span>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200/80 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#B11226] mx-auto flex items-center justify-center mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-gray-900 mb-2">
              {t.wishlist.empty}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 font-light">
              {t.wishlist.emptySub}
            </p>
            <button
              onClick={() => setCurrentPage('shop')}
              className="px-6 py-3 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-md"
            >
              {t.wishlist.exploreShop}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
