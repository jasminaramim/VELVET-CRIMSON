import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { lang, t, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast(lang === 'bn' ? 'দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন' : 'Please enter a valid email address', 'info');
      return;
    }
    setSubmitted(true);
    showToast(t.sections.subscribedSuccess, 'success');
    setEmail('');
  };

  return (
    <section className="py-20 bg-[#111111] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B11226_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[#B11226] text-xs font-semibold tracking-[0.25em] uppercase">
          {lang === 'bn' ? 'প্রাইভেট সার্কেল' : 'EXCLUSIVE PRIVILEGE'}
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">
          {t.sections.newsletterTitle}
        </h2>
        <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-5" />
        <p className="text-gray-300 text-sm sm:text-base font-light max-w-xl mx-auto mb-8">
          {t.sections.newsletterSubtitle}
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#B11226]/20 border border-[#B11226] rounded-lg text-white text-sm">
            <CheckCircle2 className="w-5 h-5 text-[#B11226]" />
            <span>{t.sections.subscribedSuccess}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.sections.newsletterPlaceholder}
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#B11226] focus:ring-1 focus:ring-[#B11226] transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-sm font-semibold tracking-wider uppercase rounded-md transition-colors shadow-lg cursor-pointer shrink-0"
            >
              {t.sections.subscribe}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
