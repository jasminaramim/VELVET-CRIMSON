import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Tag, ShieldCheck, Check } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    lang,
    t,
    cart,
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
    setSelectedCategory,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

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

  if (cart.length === 0) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 text-[#B11226] mx-auto flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-editorial text-3xl font-bold text-gray-900 mb-2">
          {t.cart.empty}
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 font-light">
          {t.cart.emptySub}
        </p>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentPage('shop');
          }}
          className="px-8 py-3.5 bg-[#B11226] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#8B0E1A] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.cart.startShopping}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
            {lang === 'bn' ? 'অর্ডার প্রস্তুতি' : 'STEP 1 OF 2'}
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
            {t.cart.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Products Table / Cards */}
          <div className="lg:col-span-8">
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <div className="col-span-6">{t.cart.product}</div>
                <div className="col-span-2 text-center">{t.cart.price}</div>
                <div className="col-span-2 text-center">{t.cart.quantity}</div>
                <div className="col-span-2 text-right">{t.cart.subtotal}</div>
              </div>

              {/* Rows */}
              {cart.map((item, idx) => {
                const unitPrice = item.product.discountPrice ?? item.product.price;
                const lineTotal = unitPrice * item.quantity;
                return (
                  <div
                    key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Product info */}
                    <div className="sm:col-span-6 flex gap-4">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#B11226]">
                            {item.product.brand}
                          </span>
                          <h4 className="font-editorial text-base sm:text-lg font-bold text-gray-900">
                            {lang === 'bn' ? item.product.nameBn : item.product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {lang === 'bn' ? 'সাইজ' : 'Size'}: <span className="font-medium text-gray-800">{item.selectedSize}</span> · {lang === 'bn' ? 'রঙ' : 'Color'}: <span className="font-medium text-gray-800">{item.selectedColor}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 mt-2 cursor-pointer w-fit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.cart.remove}</span>
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-left sm:text-center text-sm font-semibold text-gray-800">
                      <span className="sm:hidden text-xs text-gray-400 mr-2">{t.cart.price}:</span>
                      {t.currency}{unitPrice.toLocaleString()}
                    </div>

                    {/* Quantity controls */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden h-8">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="px-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="px-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="sm:col-span-2 text-right text-base font-bold text-[#B11226]">
                      {t.currency}{lineTotal.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage('shop');
                }}
                className="text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#B11226] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.cart.continueShopping}</span>
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
              <h3 className="font-editorial text-xl font-bold text-gray-900 pb-4 border-b border-gray-200">
                {t.cart.orderSummary}
              </h3>

              {/* Coupon Form */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
                  {lang === 'bn' ? 'প্রোমো কোড' : 'Promotional Code'}
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <div className="flex items-center gap-2 font-medium">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>
                        {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)
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
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={t.cart.couponPlaceholder}
                        className="flex-1 px-3.5 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#B11226]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 hover:bg-[#B11226] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        {t.cart.applyCoupon}
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                    <p className="text-[11px] text-gray-400">
                      {lang === 'bn' ? 'টিপ: ২০% ছাড়ের জন্য CRIMSON20 ব্যবহার করুন' : 'Tip: Try code CRIMSON20 for 20% discount'}
                    </p>
                  </form>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-3 text-sm text-gray-600 pt-4 border-t border-gray-200">
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
                  <span>
                    {cartShippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">{lang === 'bn' ? 'ফ্রি' : 'FREE'}</span>
                    ) : (
                      `${t.currency}${cartShippingFee}`
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
                  <span>{t.cart.total}</span>
                  <span className="text-xl text-[#B11226]">{t.currency}{cartGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setCurrentPage('checkout')}
                className="w-full py-4 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.cart.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.footer.securePayment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
