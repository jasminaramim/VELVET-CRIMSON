import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ArrowLeft,
  X,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    lang,
    t,
    products,
    selectedProductSlug,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentPage,
    addReview,
    showToast,
  } = useApp();

  const product = products.find((p) => p.slug === selectedProductSlug) || products[0];

  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Crimson Red');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Form state
  const [newReviewer, setNewReviewer] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Crimson Red');
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = product.discountPrice ?? product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Related products from the same category or brand
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setCurrentPage('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer.trim() || !newComment.trim()) return;

    addReview(product.id, {
      customerName: newReviewer,
      rating: newRating,
      comment: newComment,
    });

    setNewReviewer('');
    setNewComment('');
    showToast(lang === 'bn' ? 'আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Thank you! Your review has been recorded.', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(lang === 'bn' ? 'পোশাকের লিংক কপি করা হয়েছে' : 'Product link copied to clipboard', 'info');
    }
  };

  return (
    <div className="py-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between text-xs text-gray-500">
          <button
            onClick={() => setCurrentPage('shop')}
            className="flex items-center gap-1.5 hover:text-[#B11226] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}</span>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <span>{t.nav.home}</span>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {lang === 'bn' ? product.nameBn : product.name}
            </span>
          </div>
        </div>

        {/* Top Section: Media Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery Area */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#B11226] text-white rounded-sm shadow-md">
                  -{discountPercent}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all cursor-pointer shadow-md ${
                  isWishlisted
                    ? 'bg-[#B11226] text-white'
                    : 'bg-white/90 text-gray-700 hover:bg-[#B11226] hover:text-white backdrop-blur-xs'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImage === img ? 'border-[#B11226] shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Purchase Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gray-500 mb-2">
                <span className="text-[#B11226] font-semibold">{product.brand}</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
                {lang === 'bn' ? product.nameBn : product.name}
              </h1>

              {/* Rating and Stock badge */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {product.rating.toFixed(1)} ({product.reviewCount} {t.productCard.reviews})
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {t.productDetail.inStockText} ({product.stock} available)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-gray-100">
                <span className="text-3xl font-bold text-[#B11226]">
                  {t.currency}{currentPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {t.currency}{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="py-5 text-sm text-gray-600 leading-relaxed font-light">
                {lang === 'bn' ? product.shortDescriptionBn : product.shortDescription}
              </p>

              {/* Color Swatches */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2.5">
                  <span>
                    {t.productDetail.selectColor}: <span className="font-normal text-gray-500">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor === col.name ? 'border-[#B11226] scale-110 shadow-md ring-2 ring-red-100' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColor === col.name && (
                        <Check className={`w-4 h-4 ${col.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector with Size Guide Button */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2.5">
                  <span>{t.productDetail.selectSize}</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#B11226] hover:underline flex items-center gap-1 normal-case font-medium cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{t.productDetail.sizeGuide}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] px-4 py-2 text-xs font-semibold rounded-lg border-2 transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'border-[#B11226] bg-[#B11226] text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 text-gray-600 hover:bg-gray-100 font-bold h-full cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 text-gray-600 hover:bg-gray-100 font-bold h-full cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-gray-900 hover:bg-[#B11226] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.productDetail.addToCart}</span>
                  </button>
                </div>

                {/* Buy Now Direct Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer shadow-lg"
                  >
                    {t.productDetail.buyNow}
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3.5 border border-gray-200 hover:border-gray-400 text-gray-600 rounded-lg transition-colors cursor-pointer"
                    title="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery & Authenticity Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#B11226] mb-1" />
                <span className="font-semibold text-gray-900">{lang === 'bn' ? 'দ্রুত ডেলিভারি' : 'Express Delivery'}</span>
                <span className="text-[10px] text-gray-400">{lang === 'bn' ? 'সারা দেশে' : 'Nationwide 2-4 days'}</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-[#B11226] mb-1" />
                <span className="font-semibold text-gray-900">{lang === 'bn' ? 'সহজ রিটার্ন' : 'Easy Returns'}</span>
                <span className="text-[10px] text-gray-400">{lang === 'bn' ? '৭ দিনের মধ্যে' : 'Within 7 days'}</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#B11226] mb-1" />
                <span className="font-semibold text-gray-900">{lang === 'bn' ? 'শতভাগ অরিজিনাল' : '100% Authentic'}</span>
                <span className="text-[10px] text-gray-400">{lang === 'bn' ? 'প্রিমিয়াম ফেব্রিক' : 'Luxury craft'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Specs, Reviews */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex border-b border-gray-200 space-x-8 text-sm font-semibold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'desc'
                  ? 'border-[#B11226] text-[#B11226]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {t.productDetail.tabDescription}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#B11226] text-[#B11226]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {t.productDetail.tabInfo}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-[#B11226] text-[#B11226]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {t.productDetail.tabReviews} ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'desc' && (
              <div className="prose max-w-3xl text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                <p>{lang === 'bn' ? product.descriptionBn : product.description}</p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200/80 mt-6">
                  <h4 className="font-editorial text-lg font-bold text-gray-900 mb-2">
                    {lang === 'bn' ? 'ডিজাইনারের বিশেষ মন্তব্য' : 'Atelier Notes'}
                  </h4>
                  <p className="text-gray-600 text-sm italic">
                    {lang === 'bn'
                      ? 'প্রতিটি ভেলভেট ক্রিমসন পোশাক দক্ষ কারিগরদের নিখুঁত বুননে তৈরি। আধুনিক আভিজাত্য এবং রাজকীয় আরামদায়ক অনুভূতির সংমিশ্রণ ঘটাতে আমরা শুধুমাত্র সেরা সুতা ও ডাই ব্যবহার করি।'
                      : 'Every Velvet Crimson garment is crafted with meticulous care by master artisans. We select only the highest grade fibres and rich crimson vat dyes to ensure eternal drape, vibrant tone, and transcendent elegance.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-sm">
                <div className="grid grid-cols-3 p-4 bg-gray-50/70 font-medium">
                  <span className="text-gray-500">{t.productDetail.fabric}:</span>
                  <span className="col-span-2 text-gray-900">{product.fabric}</span>
                </div>
                <div className="grid grid-cols-3 p-4 font-medium">
                  <span className="text-gray-500">{t.productDetail.care}:</span>
                  <span className="col-span-2 text-gray-900">{product.care}</span>
                </div>
                <div className="grid grid-cols-3 p-4 bg-gray-50/70 font-medium">
                  <span className="text-gray-500">{t.productDetail.fit}:</span>
                  <span className="col-span-2 text-gray-900">{product.fit}</span>
                </div>
                <div className="grid grid-cols-3 p-4 font-medium">
                  <span className="text-gray-500">{t.productDetail.origin}:</span>
                  <span className="col-span-2 text-gray-900">{product.origin}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* List Existing Reviews */}
                <div className="space-y-4">
                  {(product.reviews || []).map((rev) => (
                    <div key={rev.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{rev.customerName}</span>
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{rev.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        "{lang === 'bn' && rev.commentBn ? rev.commentBn : rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add a Review Form */}
                <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 max-w-xl">
                  <h4 className="font-editorial text-xl font-bold text-gray-900 mb-4">
                    {lang === 'bn' ? 'আপনার মূল্যবান রিভিউ প্রদান করুন' : 'Write a Customer Review'}
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                        {lang === 'bn' ? 'আপনার নাম' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewer}
                        onChange={(e) => setNewReviewer(e.target.value)}
                        placeholder="e.g. Nusrat Jahan"
                        className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#B11226]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                        {lang === 'bn' ? 'রেটিং' : 'Rating'}
                      </label>
                      <div className="flex gap-2 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${star <= newRating ? 'fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                        {lang === 'bn' ? 'আপনার মন্তব্য' : 'Your Feedback / Comment'} *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={lang === 'bn' ? 'পোশাকটির ফেব্রিক, ফিটিং ও অভিজ্ঞতা সম্পর্কে লিখুন...' : 'Share your thoughts on quality, fitting, and presentation...'}
                        className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#B11226]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                    >
                      {lang === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like / Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
                {lang === 'bn' ? 'সম্পর্কিত পোশাক' : 'CURATED PAIRINGS'}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {t.productDetail.relatedProducts}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Interactive Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-editorial text-2xl font-bold text-gray-900 mb-2">
              {t.productDetail.sizeGuide}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {lang === 'bn'
                ? 'পরিমাপ ইঞ্চিতে (Inches) দেওয়া হলো। আপনার সঠিক মাপ বেছে নিন।'
                : 'All measurements are shown in inches. Take your exact measurements for an artisanal bespoke fit.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-900 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Bust / Chest</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hips</th>
                    <th className="p-3">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3 font-bold text-gray-900">S (Small)</td>
                    <td className="p-3">34" - 36"</td>
                    <td className="p-3">28" - 30"</td>
                    <td className="p-3">36" - 38"</td>
                    <td className="p-3">42"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">M (Medium)</td>
                    <td className="p-3">38" - 40"</td>
                    <td className="p-3">32" - 34"</td>
                    <td className="p-3">40" - 42"</td>
                    <td className="p-3">44"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">L (Large)</td>
                    <td className="p-3">42" - 44"</td>
                    <td className="p-3">36" - 38"</td>
                    <td className="p-3">44" - 46"</td>
                    <td className="p-3">46"</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">XL (Extra Large)</td>
                    <td className="p-3">46" - 48"</td>
                    <td className="p-3">40" - 42"</td>
                    <td className="p-3">48" - 50"</td>
                    <td className="p-3">48"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-6 py-2 bg-gray-900 text-white rounded-md text-xs font-semibold uppercase"
              >
                {lang === 'bn' ? 'বুঝেছি' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
