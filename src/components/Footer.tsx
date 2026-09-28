import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t, setCurrentPage, setSelectedCategory, setCustomerTab } = useApp();

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-[#B11226] rotate-45" />
              <span className="font-editorial text-2xl font-bold tracking-[0.2em] text-[#111111]">
                VELVET CRIMSON
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6 font-light">
              {t.footer.brandDesc}
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#B11226] hover:text-white flex items-center justify-center transition-colors text-gray-600"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#B11226] hover:text-white flex items-center justify-center transition-colors text-gray-600"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <span className="text-xs text-gray-400 pl-2">@velvetcrimson</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-editorial text-lg font-bold text-gray-900 mb-4 tracking-wider uppercase">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.nav.shop}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.nav.categories}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="font-editorial text-lg font-bold text-gray-900 mb-4 tracking-wider uppercase">
              {t.footer.customerService}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('track');
                    setCurrentPage('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors text-left text-[#B11226] font-medium"
                >
                  {lang === 'bn' ? '🚚 অর্ডার ট্র্যাক করুন' : '🚚 Track Your Order'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('orders');
                    setCurrentPage('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors text-left"
                >
                  {lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('returns');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.footer.shippingPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('returns');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.footer.returnPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B11226] transition-colors"
                >
                  {t.footer.termsConditions}
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Contact */}
          <div>
            <h4 className="font-editorial text-lg font-bold text-gray-900 mb-4 tracking-wider uppercase">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B11226] shrink-0 mt-0.5" />
                <span>House 42, Road 11, Block D, Banani, Dhaka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B11226] shrink-0" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B11226] shrink-0" />
                <span>concierge@velvetcrimson.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mid Bar: Payment methods */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-gray-400 text-xs">
            {lang === 'bn' ? 'নিরাপদ পেমেন্ট গেটওয়ে এবং দ্রুততম হোম ডেলিভারি' : 'Secured Payment Gateways & Express Delivery'}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-700">bKash</span>
            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-700">Nagad</span>
            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-700">Visa / Master</span>
            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-700">COD</span>
          </div>
        </div>
      </div>

      {/* Professional Polish Sleek Dark Bottom Bar */}
      <div className="bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 py-3.5 text-[10px] font-medium tracking-widest uppercase gap-3">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setCurrentPage('returns');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#B11226] transition-colors cursor-pointer"
          >
            {t.footer.shippingPolicy}
          </button>
          <button
            onClick={() => {
              setCurrentPage('privacy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#B11226] transition-colors cursor-pointer"
          >
            {t.footer.privacyPolicy}
          </button>
          <button
            onClick={() => {
              setCurrentPage('terms');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#B11226] transition-colors cursor-pointer"
          >
            Terms
          </button>
        </div>
        <div className="text-gray-400 text-center">
          © 2026 Velvet Crimson. Elegance in Every Thread.
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#B11226] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#B11226] transition-colors"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};
