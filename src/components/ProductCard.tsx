import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    lang,
    t,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    navigateToProduct,
  } = useApp();

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = product.discountPrice ?? product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white border border-gray-100/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Area */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-gray-50 cursor-pointer" onClick={() => navigateToProduct(product.slug)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges: Discount / New Arrival / Best Seller */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#B11226] text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#111111] text-white">
              {lang === 'bn' ? 'নতুন' : 'NEW'}
            </span>
          )}
        </div>

        {/* Wishlist Heart Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-[#B11226] text-white shadow-md'
              : 'bg-white/90 text-gray-700 hover:bg-[#B11226] hover:text-white backdrop-blur-xs'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full py-2.5 px-4 bg-white/95 hover:bg-[#B11226] hover:text-white text-gray-900 text-xs font-bold tracking-widest uppercase shadow-md backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.productCard.quickView}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand or Category Tag */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-wider mb-1">
            <span>{product.brand || 'Velvet Crimson'}</span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h4
            onClick={() => navigateToProduct(product.slug)}
            className="font-editorial text-lg sm:text-xl font-bold text-gray-900 line-clamp-1 hover:text-[#B11226] transition-colors cursor-pointer"
            title={lang === 'bn' ? product.nameBn : product.name}
          >
            {lang === 'bn' ? product.nameBn : product.name}
          </h4>

          {/* Color Dots Swatch */}
          <div className="flex items-center gap-1.5 my-2">
            {product.colors.slice(0, 3).map((col, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-gray-300 shadow-2xs"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-gray-400">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Pricing and Add to Cart Action */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#B11226]">
                {t.currency}{currentPrice.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {t.currency}{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2.5 sm:px-3 sm:py-2 bg-gray-900 hover:bg-[#B11226] text-white rounded-md text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title={t.productCard.addToCart}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline">{t.productCard.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
