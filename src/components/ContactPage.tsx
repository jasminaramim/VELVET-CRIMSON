import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, t, showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    showToast(
      lang === 'bn'
        ? 'আপনার বার্তা পাঠানো হয়েছে। আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।'
        : 'Message sent! Our boutique concierge will respond within 24 hours.',
      'success'
    );
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-16 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
            {lang === 'bn' ? 'আমাদের সাথে যোগাযোগ' : 'ATELIER CONCIERGE'}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            {t.nav.contact}
          </h1>
          <div className="w-12 h-0.5 bg-[#B11226] mx-auto mb-6" />
          <p className="text-gray-500 text-sm sm:text-base font-light">
            {lang === 'bn'
              ? 'বিশেষ অর্ডার, মাপজোখ বা যেকোনো অনুসন্ধানের জন্য আমাদের বনানী স্টুডিওতে স্বাগতম বা অনলাইন বার্তা পাঠান।'
              : 'Whether you require bespoke bespoke fittings, styling advice, or assistance with an order, our concierge is at your service.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-xs space-y-6">
              <h3 className="font-editorial text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                {lang === 'bn' ? 'বনানী ফ্ল্যাগশিপ স্টোর' : 'Banani Flagship Atelier'}
              </h3>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-[#B11226] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">
                      {lang === 'bn' ? 'ঠিকানা' : 'Location'}
                    </h5>
                    <p className="font-light">House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-[#B11226] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">
                      {lang === 'bn' ? 'হটলাইন' : 'Phone'}
                    </h5>
                    <p className="font-light">+880 1712-345678 / +880 1987-654321</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-[#B11226] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">
                      {lang === 'bn' ? 'ইমেইল' : 'Email'}
                    </h5>
                    <p className="font-light">concierge@velvetcrimson.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-[#B11226] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">
                      {lang === 'bn' ? 'খোলার সময়' : 'Store Hours'}
                    </h5>
                    <p className="font-light">Saturday – Thursday: 10:00 AM – 9:00 PM</p>
                    <p className="font-light">Friday: 3:00 PM – 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 border border-gray-200/80 shadow-xs">
              <h3 className="font-editorial text-2xl font-bold text-gray-900 mb-2">
                {lang === 'bn' ? 'সরাসরি বার্তা পাঠান' : 'Send an Inquiry'}
              </h3>
              <p className="text-xs text-gray-500 mb-6 font-light">
                {lang === 'bn'
                  ? 'আপনার প্রশ্ন বা প্রতিক্রিয়া জানাতে নিচের ফর্মটি পূরণ করুন।'
                  : 'Fill out the form below and our styling team will be in touch shortly.'}
              </p>

              {sent ? (
                <div className="p-8 bg-emerald-50 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-editorial text-xl font-bold text-gray-900">
                    {lang === 'bn' ? 'ধন্যবাদ!' : 'Message Received'}
                  </h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    {lang === 'bn'
                      ? 'আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে। আমাদের কনসিয়ার্জ টিম শীঘ্রই উত্তর দেবে।'
                      : 'We have received your message. Our atelier director will review and reply within 24 hours.'}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 px-5 py-2 bg-gray-900 text-white rounded text-xs font-semibold uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase text-gray-700 mb-1">
                        {lang === 'bn' ? 'আপনার নাম' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase text-gray-700 mb-1">
                        {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-gray-700 mb-1">
                      {lang === 'bn' ? 'বিষয়' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Bespoke Bridal Saree Inquiry"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-gray-700 mb-1">
                      {lang === 'bn' ? 'বার্তা' : 'Message'} *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={lang === 'bn' ? 'আপনার বিস্তারিত বার্তা এখানে লিখুন...' : 'Type your message or custom fitting request here...'}
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#B11226]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-bold uppercase tracking-widest rounded-md transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
