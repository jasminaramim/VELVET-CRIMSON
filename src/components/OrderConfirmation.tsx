import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { lang, t, latestOrder, setCurrentPage, setSelectedCategory } = useApp();

  if (!latestOrder) {
    return (
      <div className="py-24 text-center">
        <button
          onClick={() => setCurrentPage('home')}
          className="px-6 py-2.5 bg-[#B11226] text-white rounded text-xs uppercase"
        >
          {t.nav.home}
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#FAFAFA] min-h-[75vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200/80 shadow-xl text-center">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#B11226] font-bold">
            {lang === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে' : 'TRANSACTION COMPLETED'}
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-3">
            {t.confirmation.title}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-light max-w-md mx-auto mb-8">
            {t.confirmation.subtitle}
          </p>

          {/* Order Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200/70 text-left mb-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-medium">{t.confirmation.orderId}</span>
                <span className="text-lg font-mono font-bold text-[#B11226]">#{latestOrder.id}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block uppercase font-medium">{t.confirmation.date}</span>
                <span className="text-sm font-medium text-gray-800">{latestOrder.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-400 block text-xs uppercase font-medium">{t.confirmation.shippingTo}</span>
                <p className="font-semibold text-gray-800 mt-1">
                  {latestOrder.shippingInfo.firstName} {latestOrder.shippingInfo.lastName}
                </p>
                <p className="text-gray-600">{latestOrder.shippingInfo.address}</p>
                <p className="text-gray-600">
                  {latestOrder.shippingInfo.city}, {latestOrder.shippingInfo.country}
                </p>
                <p className="text-gray-600">{latestOrder.shippingInfo.phone}</p>
              </div>

              <div>
                <span className="text-gray-400 block text-xs uppercase font-medium">{t.confirmation.payment}</span>
                <p className="font-semibold text-gray-800 uppercase mt-1">
                  {latestOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : latestOrder.paymentMethod.toUpperCase()}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-2 bg-amber-100 text-amber-800">
                  <Package className="w-3 h-3" />
                  <span>{latestOrder.status}</span>
                </div>
                <p className="text-base font-bold text-[#B11226] mt-2">
                  {lang === 'bn' ? 'মোট পরিশোধিত' : 'Total Amount'}: {t.currency}{latestOrder.total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Purchased Items thumbnail review */}
            <div className="pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-400 block uppercase font-medium mb-3">
                {lang === 'bn' ? 'অর্ডারকৃত পোশাকসমূহ' : 'Ordered Pieces'} ({latestOrder.items.length})
              </span>
              <div className="space-y-2">
                {latestOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-800">
                      {item.quantity} × {lang === 'bn' ? item.product.nameBn : item.product.name} ({item.selectedSize})
                    </span>
                    <span className="font-bold text-gray-900">
                      {t.currency}{((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('account')}
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-900 hover:bg-[#B11226] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{t.confirmation.viewOrders}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage('home');
              }}
              className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 hover:border-gray-900 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{t.confirmation.continueShopping}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
