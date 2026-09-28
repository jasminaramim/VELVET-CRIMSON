import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShoppingBag, ArrowRight, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    lang,
    t,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    navigateToProduct,
    setCurrentPage,
  } = useApp();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.images[0]);
      setSelectedSize(quickViewProduct.sizes[0] || 'Standard');
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Crimson Red');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentPrice = quickViewProduct.discountPrice ?? quickViewProduct.price;
  const originalPrice = quickViewProduct.discountPrice ? quickViewProduct.price : null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
    setCurrentPage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Preview */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between">
            <div className="aspect-3/4 rounded-xl overflow-hidden bg-white shadow-xs">
              <img
                src={selectedImage || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img ? 'border-[#B11226]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
                {quickViewProduct.brand}
              </span>
              <h3 className="font-editorial text-2xl font-bold text-gray-900 mt-1 mb-2">
                {lang === 'bn' ? quickViewProduct.nameBn : quickViewProduct.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({quickViewProduct.reviewCount} {t.productCard.reviews})
                </span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  {t.productDetail.inStockText}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-bold text-[#B11226]">
                  {t.currency}{currentPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {t.currency}{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {lang === 'bn' ? quickViewProduct.shortDescriptionBn : quickViewProduct.shortDescription}
              </p>

              {/* Color Selector */}
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
                  {t.productDetail.selectColor}: <span className="font-normal text-gray-500">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2">
                  {quickViewProduct.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor === col.name ? 'border-[#B11226] scale-110 shadow-xs' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColor === col.name && (
                        <Check className={`w-3.5 h-3.5 ${col.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
                  {t.productDetail.selectSize}
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-medium rounded border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'border-[#B11226] bg-[#B11226] text-white font-bold'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 text-gray-600 hover:bg-gray-100 h-full font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 text-gray-600 hover:bg-gray-100 h-full font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-10 bg-gray-900 hover:bg-[#B11226] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.productDetail.addToCart}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  {t.productDetail.buyNow}
                </button>
                <button
                  onClick={() => {
                    const slug = quickViewProduct.slug;
                    setQuickViewProduct(null);
                    navigateToProduct(slug);
                  }}
                  className="px-4 py-2.5 border border-gray-200 hover:border-[#B11226] text-gray-700 hover:text-[#B11226] text-xs font-semibold tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'সম্পূর্ণ বিবরণ' : 'Full Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
