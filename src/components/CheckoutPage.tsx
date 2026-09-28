import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShippingInfo, PaymentMethod } from '../types';
import { ShieldCheck, Truck, CreditCard, Banknote, Smartphone, ArrowLeft, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    lang,
    t,
    cart,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    placeOrder,
    setCurrentPage,
    user,
  } = useApp();

  const [formData, setFormData] = useState<ShippingInfo>({
    firstName: user.name.split(' ')[0] || 'Jasmin',
    lastName: user.name.split(' ').slice(1).join(' ') || 'Ara Mim',
    email: user.email || 'jasminaramim2005@gmail.com',
    phone: user.phone || '01712345678',
    address: 'House 14, Road 5, Dhanmondi R/A',
    city: 'Dhaka',
    postalCode: '1205',
    country: 'Bangladesh',
    notes: '',
  });

  const [shippingType, setShippingType] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect back to shop
  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <h2 className="font-editorial text-3xl font-bold text-gray-900 mb-4">
          {t.cart.empty}
        </h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-3 bg-[#B11226] text-white text-xs font-bold uppercase rounded-md"
        >
          {t.cart.startShopping}
        </button>
      </div>
    );
  }

  const standardFee = cartSubtotal > 5000 ? 0 : 80;
  const expressFee = 150;
  const calculatedShippingFee = shippingType === 'standard' ? standardFee : expressFee;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + calculatedShippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      placeOrder(formData, paymentMethod);
      setIsSubmitting(false);
    }, 900);
  };

  return (
    <div className="py-12 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentPage('cart')}
              className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#B11226] flex items-center gap-1.5 transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'bn' ? 'শপিং ব্যাগে ফিরে যান' : 'Back to Shopping Bag'}</span>
            </button>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900">
              {t.checkout.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Secure Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Delivery Info, Shipping, Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer & Shipping Details */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <h3 className="font-editorial text-xl font-bold text-gray-900 pb-4 mb-6 border-b border-gray-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B11226] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>{t.checkout.contactInfo}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.firstName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.lastName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.address} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Apartment, suite, house number, street"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.city} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.postalCode}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    {t.checkout.notes}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={lang === 'bn' ? 'ডেলিভারির বিশেষ কোনো নির্দেশনা থাকলে লিখুন' : 'Special delivery instructions (e.g. gate code or preferred hour)'}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Options */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <h3 className="font-editorial text-xl font-bold text-gray-900 pb-4 mb-6 border-b border-gray-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B11226] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>{t.checkout.shippingMethod}</span>
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingType('standard')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingType === 'standard' ? 'border-[#B11226] bg-[#FFF0F2]/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingType === 'standard'}
                      onChange={() => setShippingType('standard')}
                      className="text-[#B11226] focus:ring-[#B11226]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {t.checkout.standardShipping}
                      </span>
                      <span className="text-xs text-gray-500">
                        {lang === 'bn' ? 'সারা দেশে ২-৪ কার্যদিবসের মধ্যে ডেলিভারি' : 'Reliable delivery nationwide in 2-4 business days'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#B11226]">
                    {standardFee === 0 ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `${t.currency}${standardFee}`}
                  </span>
                </label>

                <label
                  onClick={() => setShippingType('express')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingType === 'express' ? 'border-[#B11226] bg-[#FFF0F2]/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingType === 'express'}
                      onChange={() => setShippingType('express')}
                      className="text-[#B11226] focus:ring-[#B11226]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {t.checkout.expressShipping}
                      </span>
                      <span className="text-xs text-gray-500">
                        {lang === 'bn' ? 'ঢাকা সিটিতে ২৪ ঘণ্টার মধ্যে অগ্রাধিকার ডেলিভারি' : 'Priority next-day morning courier service inside Dhaka'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#B11226]">
                    {t.currency}{expressFee}
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <h3 className="font-editorial text-xl font-bold text-gray-900 pb-4 mb-6 border-b border-gray-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B11226] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>{t.checkout.paymentMethod}</span>
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-[#B11226] bg-[#FFF0F2]/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#B11226] focus:ring-[#B11226] mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#B11226]" />
                      <span className="text-sm font-semibold text-gray-900">{t.checkout.cod}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-light">{t.checkout.codDesc}</p>
                  </div>
                </label>

                {/* bKash / Nagad Mobile Banking */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bkash' ? 'border-[#B11226] bg-[#FFF0F2]/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="text-[#B11226] focus:ring-[#B11226] mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#B11226]" />
                      <span className="text-sm font-semibold text-gray-900">{t.checkout.bkash}</span>
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold">bKash / Nagad</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-light">{t.checkout.bkashDesc}</p>
                  </div>
                </label>

                {/* Credit / Debit Card (SSLCommerz) */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-[#B11226] bg-[#FFF0F2]/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-[#B11226] focus:ring-[#B11226] mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#B11226]" />
                      <span className="text-sm font-semibold text-gray-900">{t.checkout.card}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-light">{t.checkout.cardDesc}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-editorial text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                {t.cart.orderSummary} ({cart.length} {lang === 'bn' ? 'পোশাক' : 'items'})
              </h3>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-100 pr-1">
                {cart.map((item, idx) => {
                  const price = item.product.discountPrice ?? item.product.price;
                  return (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-12 h-14 object-cover rounded bg-gray-100 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {lang === 'bn' ? item.product.nameBn : item.product.name}
                          </p>
                          <p className="text-gray-500">
                            {item.quantity} × {t.currency}{price.toLocaleString()} · {item.selectedSize}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">
                        {t.currency}{(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price calculation breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm text-gray-600 pt-4 border-t border-gray-100">
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
                  <span>{calculatedShippingFee === 0 ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `${t.currency}${calculatedShippingFee}`}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
                  <span>{t.cart.total}</span>
                  <span className="text-2xl text-[#B11226] font-bold">
                    {t.currency}{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#B11226] hover:bg-[#8B0E1A] disabled:bg-gray-400 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t.checkout.placingOrder}</span>
                ) : (
                  <span>{t.checkout.placeOrder}</span>
                )}
              </button>

              <div className="p-3 bg-gray-50 rounded-lg text-center text-xs text-gray-500 font-light flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.footer.securePayment}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
