import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, Crown, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, setCurrentPage } = useApp();

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
            {lang === 'bn' ? 'আমাদের ইতিহাস ও দর্শন' : 'THE MAISON & HERITAGE'}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            {lang === 'bn' ? 'ভেলভেট ক্রিমসন-এর গল্প' : 'The Story of Velvet Crimson'}
          </h1>
          <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-6" />
          <p className="text-gray-600 text-base leading-relaxed font-light">
            {lang === 'bn'
              ? 'রাজকীয় ক্রিমসন রেড এবং চিরন্তন শুভ্র সাদার অপূর্ব মেলবন্ধনে প্রতিটি নারীর স্বকীয় সৌন্দর্যকে প্রকাশ করাই আমাদের অঙ্গীকার।'
              : 'Born from a devotion to crimson opulence and pristine white purity, Velvet Crimson crafts timeless garments for individuals who command presence with grace.'}
          </p>
        </div>

        {/* Visual Storytelling Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFF0F2]">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
              alt="Velvet Crimson Atelier"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#B11226] font-bold">
              {lang === 'bn' ? 'অভিজাত সৃষ্টিশীলতা' : 'OUR PHILOSOPHY'}
            </span>
            <h2 className="font-editorial text-3xl font-bold text-gray-900 leading-tight">
              {lang === 'bn'
                ? 'অনন্য ফ্যাশন, যা সময়ের সীমানা ছাড়িয়ে যায়'
                : 'Where Regal Crimson Meets Pure Contemporary Grace'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
              {lang === 'bn'
                ? 'আমরা বিশ্বাস করি প্রতিটি পোশাক কেবল একটি পরিধান নয়, বরং ব্যক্তিত্বের প্রতিফলন। আমাদের ডিজাইন স্টুডিওতে অভিজ্ঞ কারিগরগণ ঐতিহ্যবাহী সূচিকর্ম এবং আধুনিক কাটের মেলবন্ধনে রূপ দেন প্রতিটি রাজকীয় সৃষ্টি।'
                : 'We believe clothing is not merely attire, but an extension of one’s aura. From bespoke Jamdani inspirations to sculpted evening silks, our atelier blends centuries-old textile heritage with sleek modern tailoring.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Crown className="w-5 h-5 text-[#B11226] mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">{lang === 'bn' ? '১০০% প্রিমিয়াম সিল্ক' : 'Royal Materials'}</h4>
                <p className="text-xs text-gray-500 font-light mt-1">{lang === 'bn' ? 'উন্নত মানের রেশম ও সুতা' : 'Finest velvet, mulmul & silk'}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Award className="w-5 h-5 text-[#B11226] mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">{lang === 'bn' ? 'মাস্টার আর্টিসান' : 'Artisan Craft'}</h4>
                <p className="text-xs text-gray-500 font-light mt-1">{lang === 'bn' ? 'নিখুঁত হস্তশিল্পের বুনন' : 'Hand-embroidered precision'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atelier Values */}
        <div className="bg-[#111111] text-white rounded-2xl p-8 sm:p-14 text-center">
          <Sparkles className="w-8 h-8 text-[#B11226] mx-auto mb-4" />
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold mb-4">
            {lang === 'bn' ? 'ভেলভেট ক্রিমসন অভিজ্ঞতার অংশ হোন' : 'Step Into The Crimson Aura'}
          </h3>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের নতুন কালেকশন ঘুরে দেখুন এবং আপনার পছন্দের সিগনেচার স্টাইল আবিষ্কার করুন।'
              : 'Explore our latest seasonal collections or visit our boutique atelier in Banani, Dhaka for personal styling consultations.'}
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-3.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-lg cursor-pointer"
          >
            {lang === 'bn' ? 'কালেকশন দেখুন' : 'Explore The Collection'}
          </button>
        </div>
      </div>
    </div>
  );
};
