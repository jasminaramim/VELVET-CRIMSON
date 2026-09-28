import React from 'react';
import { useApp } from '../context/AppContext';
import { Crown, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { lang, t } = useApp();

  const features = [
    {
      icon: Crown,
      title: t.features.qualityTitle,
      desc: t.features.qualityDesc,
    },
    {
      icon: ShieldCheck,
      title: t.features.secureTitle,
      desc: t.features.secureDesc,
    },
    {
      icon: Truck,
      title: t.features.deliveryTitle,
      desc: t.features.deliveryDesc,
    },
    {
      icon: RotateCcw,
      title: t.features.returnsTitle,
      desc: t.features.returnsDesc,
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#B11226] text-xs font-semibold tracking-[0.25em] uppercase">
            {lang === 'bn' ? 'আমাদের মানদণ্ড' : 'THE VELVET CRIMSON PROMISE'}
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#111111] mt-2 mb-3">
            {t.sections.whyChooseUs}
          </h2>
          <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base font-light">
            {t.sections.whyChooseSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-xl bg-gray-50/70 border border-gray-100 hover:border-red-100 hover:bg-[#FFF0F2]/40 transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center mb-5 group-hover:border-[#B11226] group-hover:scale-110 transition-all">
                  <Icon className="w-6 h-6 text-[#B11226]" />
                </div>
                <h3 className="font-editorial text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
