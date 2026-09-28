import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    t,
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartGrandTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setCurrentPage,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B11226]" />
              <h3 className="font-editorial text-xl font-bold text-gray-900">
                {t.cart.title} ({cart.length})
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3 bg-[#FFF0F2] border-b border-red-100 text-xs">
            {remainingForFree === 0 ? (
              <span className="font-semibold text-[#8B0E1A] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                {lang === 'bn'
                  ? 'অভিনন্দন! আপনি পাচ্ছেন ফ্রি এক্সপ্রেস ডেলিভারি!'
                  : 'Congratulations! You unlocked complimentary delivery!'}
              </span>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-1.5">
                  {lang === 'bn'
                    ? `আর মাত্র ৳${remainingForFree.toLocaleString()} টাকার শপিং করলেই ফ্রি ডেলিভারি!`
                    : `Add ৳${remainingForFree.toLocaleString()} more for complimentary delivery!`}
                </p>
                <div className="w-full bg-red-200/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#B11226] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#B11226]" />
                </div>
                <h4 className="font-editorial text-lg font-bold text-gray-900 mb-1">
                  {t.cart.empty}
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mb-6 font-light">
                  {t.cart.emptySub}
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="px-6 py-2.5 bg-[#B11226] text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-[#8B0E1A] transition-colors cursor-pointer"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const price = item.product.discountPrice ?? item.product.price;
                return (
                  <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info & Adjuster */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h5 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {lang === 'bn' ? item.product.nameBn : item.product.name}
                          </h5>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                            className="text-gray-400 hover:text-[#B11226] transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.selectedSize} · {item.selectedColor}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-7">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="px-2 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="px-2 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#B11226]">
                          {t.currency}{(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Breakdown & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/70 space-y-4">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-900 underline font-semibold cursor-pointer"
                  >
                    {lang === 'bn' ? 'মুছুন' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t.cart.couponPlaceholder}
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#B11226]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-gray-900 hover:bg-[#B11226] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      {t.cart.applyCoupon}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              )}

              {/* Subtotal & Totals */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-gray-900">{t.currency}{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>{t.cart.discount} ({appliedCoupon?.code})</span>
                    <span>-{t.currency}{cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span>{cartShippingFee === 0 ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `${t.currency}${cartShippingFee}`}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                  <span>{t.cart.total}</span>
                  <span className="text-[#B11226] text-base">{t.currency}{cartGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('checkout');
                  }}
                  className="w-full py-3.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.cart.proceedToCheckout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentPage('cart');
                  }}
                  className="w-full py-2.5 text-center text-xs text-gray-600 hover:text-[#B11226] font-semibold transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'সম্পূর্ণ শপিং ব্যাগ দেখুন' : 'View Full Shopping Bag'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
