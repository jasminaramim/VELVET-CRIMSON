import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Search,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface OrderTrackerProps {
  initialOrderId?: string | null;
  onBackToOrders?: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  initialOrderId,
  onBackToOrders,
}) => {
  const { lang, t, orders, trackingOrderId, setTrackingOrderId, setCurrentPage } = useApp();
  const [searchInput, setSearchInput] = useState('');

  // Determine active order
  const activeOrder = useMemo<Order | null>(() => {
    const targetId = initialOrderId || trackingOrderId;
    if (targetId) {
      const found = orders.find(
        (o) => o.id.toLowerCase() === targetId.toLowerCase() || o.id.toLowerCase() === `#${targetId.toLowerCase()}`
      );
      if (found) return found;
    }
    // Default to the first order if available
    return orders[0] || null;
  }, [initialOrderId, trackingOrderId, orders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const cleaned = searchInput.trim().replace(/^#/, '');
    const found = orders.find((o) => o.id.toLowerCase() === cleaned.toLowerCase() || o.id.toLowerCase() === `#${cleaned.toLowerCase()}`);
    if (found) {
      setTrackingOrderId(found.id);
    } else {
      setTrackingOrderId(cleaned);
    }
  };

  // Determine stages
  const getStageStatus = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'Delivered':
        return { step: 4, percent: 100, label: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন' };
      case 'Shipped':
        return { step: 3, percent: 75, label: 'In Transit', labelBn: 'ডেলিভারির পথে' };
      case 'Processing':
        return { step: 2, percent: 50, label: 'Atelier Tailoring', labelBn: 'অ্যাটেলিয়ারে প্রস্তুতকরণ' };
      case 'Confirmed':
      default:
        return { step: 1, percent: 25, label: 'Order Confirmed', labelBn: 'অর্ডার নিশ্চিত হয়েছে' };
    }
  };

  const stageInfo = activeOrder ? getStageStatus(activeOrder.status) : { step: 1, percent: 25, label: 'Confirmed', labelBn: 'নিশ্চিত হয়েছে' };

  const steps = [
    {
      num: 1,
      title: lang === 'bn' ? 'অর্ডার নিশ্চিতকরণ' : 'Order Confirmed',
      desc: lang === 'bn' ? 'অর্ডার সফলভাবে যাচাই করা হয়েছে' : 'Order verified & payment acknowledged',
      date: activeOrder ? activeOrder.date : 'Recent',
      icon: CheckCircle2,
    },
    {
      num: 2,
      title: lang === 'bn' ? 'অ্যাটেলিয়ার প্রস্তুতি' : 'Atelier Tailoring',
      desc: lang === 'bn' ? 'ভেলভেট ও সিল্ক ফেব্রিক কাটিং ও ফিনিশিং' : 'Bespoke tailoring, cutting & quality inspection',
      date: activeOrder ? `${activeOrder.date} +1 Day` : '',
      icon: Sparkles,
    },
    {
      num: 3,
      title: lang === 'bn' ? 'কুরিয়ারে হস্তান্তর' : 'Dispatched / In Transit',
      desc: lang === 'bn' ? 'হোয়াইট গ্লাভস এক্সপ্রেস কুরিয়ারে হস্তান্তরিত' : 'Handed to Velvet Crimson VIP Express Courier',
      date: activeOrder ? `${activeOrder.date} +2 Days` : '',
      icon: Truck,
    },
    {
      num: 4,
      title: lang === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered to Doorstep',
      desc: lang === 'bn' ? 'গ্রাহকের হাতে সফলভাবে হস্তান্তর' : 'Signature delivery & unboxing at residence',
      date: activeOrder && activeOrder.status === 'Delivered' ? `${activeOrder.date} +3 Days` : 'Expected Soon',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Selector Bar */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#B11226] font-bold block">
              {lang === 'bn' ? 'রিয়েলটাইম পার্সেল ট্র্যাকার' : 'Live Shipment Tracker'}
            </span>
            <h3 className="font-editorial text-lg font-bold text-gray-900 mt-0.5">
              {lang === 'bn' ? 'অর্ডারের বর্তমান অবস্থান ট্র্যাক করুন' : 'Track Your Order Journey'}
            </h3>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={lang === 'bn' ? 'অর্ডার নং লিখুন (উদা: VC-10027)' : 'Enter Order # (e.g. VC-10027)'}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none bg-gray-50/50"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'bn' ? 'অনুসন্ধান' : 'Track'}
            </button>
          </form>
        </div>

        {/* Quick Order Pill Selectors */}
        {orders.length > 1 && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-gray-400 text-[11px] whitespace-nowrap">
              {lang === 'bn' ? 'সাম্প্রতিক অর্ডার:' : 'Recent Orders:'}
            </span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setTrackingOrderId(ord.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeOrder?.id === ord.id
                    ? 'bg-[#B11226] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                #{ord.id} ({ord.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {!activeOrder ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-800 text-sm">
            {lang === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No Order Found'}
          </p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {lang === 'bn'
              ? 'অনুগ্রহ করে একটি সঠিক অর্ডার আইডি লিখুন অথবা আপনার সাম্প্রতিক অর্ডারসমূহ থেকে নির্বাচন করুন।'
              : 'Please enter a valid order ID or select one of your orders from the list above.'}
          </p>
        </div>
      ) : (
        <>
          {/* Active Order Overview Card */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    {lang === 'bn' ? 'ট্র্যাকিং রেফারেন্স' : 'Tracking Ref'}
                  </span>
                  <span className="text-xl font-mono font-bold text-gray-900">#{activeOrder.id}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {lang === 'bn' ? 'অর্ডারের তারিখ:' : 'Placed:'} {activeOrder.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {lang === 'bn' ? 'আনুমানিক ডেলিভারি:' : 'Est. Arrival:'} 2-3 Business Days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeOrder.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : activeOrder.status === 'Shipped'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : activeOrder.status === 'Processing'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {lang === 'bn' ? stageInfo.labelBn : activeOrder.status}
                </span>

                <span className="font-bold text-gray-900 text-lg">
                  {t.currency}{activeOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Visual Stepper Progress Bar */}
            <div className="py-8">
              <div className="relative mb-8">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
                {/* Active Colored Line */}
                <div
                  className="absolute top-1/2 left-0 h-1.5 bg-[#B11226] -translate-y-1/2 z-0 transition-all duration-700 rounded-full"
                  style={{ width: `${stageInfo.percent}%` }}
                />

                {/* Stepper Nodes */}
                <div className="relative z-10 flex items-center justify-between">
                  {steps.map((s) => {
                    const isPassed = s.num <= stageInfo.step;
                    const isCurrent = s.num === stageInfo.step;
                    const Icon = s.icon;

                    return (
                      <div key={s.num} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isPassed
                              ? 'bg-[#B11226] border-[#B11226] text-white shadow-md'
                              : 'bg-white border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-red-100 scale-110' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stepper Labels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {steps.map((s) => {
                  const isPassed = s.num <= stageInfo.step;
                  const isCurrent = s.num === stageInfo.step;
                  return (
                    <div
                      key={s.num}
                      className={`p-3 rounded-lg text-left md:text-center transition-colors ${
                        isCurrent ? 'bg-[#FFF0F2]/60 border border-[#B11226]/20' : ''
                      }`}
                    >
                      <span
                        className={`text-xs font-bold block ${
                          isPassed ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {s.title}
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">{s.desc}</p>
                      {s.date && <p className="text-[10px] font-mono text-[#B11226] font-semibold mt-1">{s.date}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Delivery Details Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-xs">
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold uppercase text-[11px] tracking-wider">
                  <Truck className="w-4 h-4 text-[#B11226]" />
                  <span>{lang === 'bn' ? 'কুরিয়ার বিবরণ' : 'Courier Details'}</span>
                </div>
                <p className="font-semibold text-gray-900">Velvet Crimson White-Glove VIP Express</p>
                <p className="text-gray-500 font-mono text-[11px] mt-0.5">Tracking No: VC-EXP-{activeOrder.id}-BD</p>
                <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Helpline:</span>
                  <a href="tel:+8801712345678" className="text-[#B11226] font-semibold hover:underline">
                    +880 1712-345678
                  </a>
                </div>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold uppercase text-[11px] tracking-wider">
                  <MapPin className="w-4 h-4 text-[#B11226]" />
                  <span>{lang === 'bn' ? 'গন্তব্য ঠিকানা' : 'Shipping Destination'}</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {activeOrder.shippingInfo.firstName} {activeOrder.shippingInfo.lastName}
                </p>
                <p className="text-gray-600 mt-0.5">{activeOrder.shippingInfo.address}</p>
                <p className="text-gray-600">
                  {activeOrder.shippingInfo.city}, Bangladesh ({activeOrder.shippingInfo.postalCode || '1205'})
                </p>
                <p className="text-gray-500 mt-1 font-mono">{activeOrder.shippingInfo.phone}</p>
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold uppercase text-[11px] tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#B11226]" />
                  <span>{lang === 'bn' ? 'পেমেন্ট ও নিশ্চয়তা' : 'Payment & Security'}</span>
                </div>
                <p className="font-semibold text-gray-900 uppercase">
                  {activeOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : activeOrder.paymentMethod.toUpperCase()}
                </p>
                <p className="text-gray-500 mt-0.5">
                  Payment Status:{' '}
                  <span
                    className={`font-semibold ${
                      activeOrder.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {activeOrder.paymentStatus}
                  </span>
                </p>
                <div className="mt-2.5 pt-2 border-t border-gray-200/60 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Inspection:</span>
                  <span className="text-gray-800 font-medium">Open-box check allowed</span>
                </div>
              </div>
            </div>

            {/* Items inside this order */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {lang === 'bn' ? 'অর্ডারকৃত পোশাকসমূহ' : 'Items In Shipment'} ({activeOrder.items.length})
              </h4>
              <div className="divide-y divide-gray-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-12 h-14 object-cover rounded-md bg-gray-100 border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {lang === 'bn' ? item.product.nameBn : item.product.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          Size: <span className="font-medium text-gray-700">{item.selectedSize}</span> · Color:{' '}
                          <span className="font-medium text-gray-700">{item.selectedColor}</span> · Qty:{' '}
                          <span className="font-medium text-gray-700">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-sm">
                        {t.currency}{((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation back and support */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              {onBackToOrders && (
                <button
                  onClick={onBackToOrders}
                  className="px-4 py-2 border border-gray-300 hover:border-gray-900 text-gray-700 text-xs font-semibold rounded-md transition-colors"
                >
                  {lang === 'bn' ? '← সব অর্ডার দেখুন' : '← Back to All Orders'}
                </button>
              )}
              <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
                <span>{lang === 'bn' ? 'কোনো জিজ্ঞাসা আছে?' : 'Have delivery questions?'}</span>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="text-[#B11226] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'bn' ? 'কাস্টমার সাপোর্ট' : 'Contact Concierge'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
