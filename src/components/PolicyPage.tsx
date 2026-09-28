import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

interface PolicyPageProps {
  type: 'returns' | 'privacy' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const { lang, t } = useApp();

  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {type === 'returns' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <RotateCcw className="w-10 h-10 text-[#B11226] mx-auto mb-3" />
              <h1 className="font-editorial text-4xl font-bold text-gray-900">
                {lang === 'bn' ? 'রিটার্ন ও এক্সচেঞ্জ নীতি' : 'Shipping & 7-Day Return Policy'}
              </h1>
              <div className="w-12 h-0.5 bg-[#B11226] mx-auto mt-4" />
            </div>

            <div className="prose text-gray-700 text-sm leading-relaxed space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200/80">
                <h3 className="font-editorial text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#B11226]" />
                  <span>{lang === 'bn' ? 'ডেলিভারি সংক্রান্ত নিয়মাবলী' : 'Delivery Guidelines'}</span>
                </h3>
                <p>
                  {lang === 'bn'
                    ? 'ঢাকা সিটির অভ্যন্তরে ১-২ কার্যদিবস এবং ঢাকার বাইরে ২-৪ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করা হয়। ৫,০০০ টাকার অধিক অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি।'
                    : 'We deliver within 24-48 hours inside Dhaka metropolitan, and 2-4 business days nationwide across Bangladesh. All orders above ৳5,000 enjoy complimentary priority courier.'}
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200/80">
                <h3 className="font-editorial text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#B11226]" />
                  <span>{lang === 'bn' ? '৭ দিনের সহজ রিটার্ন নীতি' : '7-Day Return & Size Exchange'}</span>
                </h3>
                <p>
                  {lang === 'bn'
                    ? 'পণ্য গ্রহণের ৭ দিনের মধ্যে অব্যবহৃত অবস্থায় অরিজিনাল ট্যাগ ও ইনভয়েস সহ যেকোনো সাইজ বদল বা রিটার্ন করা যাবে। ডেলিভারি পার্টনারের সামনে চেক করে রিসিভ করার অনুরোধ করা হচ্ছে।'
                    : 'Items can be returned or exchanged for an alternative size within 7 days of delivery, provided the garment is unworn, unwashed, and retains all original tags, velvet ribbon packaging, and sales memo.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <ShieldCheck className="w-10 h-10 text-[#B11226] mx-auto mb-3" />
              <h1 className="font-editorial text-4xl font-bold text-gray-900">
                {t.footer.privacyPolicy}
              </h1>
              <div className="w-12 h-0.5 bg-[#B11226] mx-auto mt-4" />
            </div>

            <div className="prose text-gray-700 text-sm leading-relaxed space-y-4">
              <p>
                {lang === 'bn'
                  ? 'ভেলভেট ক্রিমসন আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। আপনার নাম, ঠিকানা, ফোন নম্বর এবং পেমেন্ট সংক্রান্ত তথ্য আধুনিক এনক্রিপশন পদ্ধতির মাধ্যমে সুরক্ষিত রাখা হয়।'
                  : 'At Velvet Crimson, your privacy and discreet confidentiality are paramount. We strictly collect only necessary billing, shipping, and patron preference details to fulfill orders and tailor haute couture recommendations.'}
              </p>
              <p>
                {lang === 'bn'
                  ? 'আমরা কখনোই কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রয় বা হস্তান্তর করি না। সমস্ত অনলাইন লেনদেন SSL 256-বিট এনক্রিপশনের মাধ্যমে নিরাপদ।'
                  : 'We never sell, lease, or distribute patron databases to third-party advertisers. All online transactions are processed through 256-bit encrypted gateways.'}
              </p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <FileText className="w-10 h-10 text-[#B11226] mx-auto mb-3" />
              <h1 className="font-editorial text-4xl font-bold text-gray-900">
                {t.footer.termsConditions}
              </h1>
              <div className="w-12 h-0.5 bg-[#B11226] mx-auto mt-4" />
            </div>

            <div className="prose text-gray-700 text-sm leading-relaxed space-y-4">
              <p>
                {lang === 'bn'
                  ? 'আমাদের ওয়েবসাইটে প্রদর্শিত সকল ছবি, ডিজাইন ও কন্টেন্ট ভেলভেট ক্রিমসনের নিজস্ব বৌদ্ধিক সম্পত্তি। অনুমোদন ব্যতীত এর বাণিজ্যিক ব্যবহার আইনত দণ্ডনীয়।'
                  : 'All imagery, typography, editorial copy, and bespoke dress cuts displayed on this website represent proprietary intellectual assets of Velvet Crimson Ltd.'}
              </p>
              <p>
                {lang === 'bn'
                  ? 'মূল্য ও স্টক পরিস্থিতি যেকোনো সময় পরিবর্তিত হতে পারে। অর্ডার নিশ্চিতকরণের পর গ্রাহককে এসএমএস ও ইমেইলের মাধ্যমে জানানো হবে।'
                  : 'Pricing, seasonal edits, and available silhouettes remain subject to boutique inventory availability. Verified orders receive immediate confirmation receipts via SMS and email.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
