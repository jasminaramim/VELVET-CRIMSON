import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderTracker } from './OrderTracker';
import { UserAddress, OrderStatus } from '../types';
import {
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Settings,
  ShieldCheck,
  LogOut,
  Search,
  Plus,
  Trash2,
  Check,
  Lock,
  Bell,
  Heart,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    lang,
    t,
    user,
    setUser,
    orders,
    isLoggedIn,
    loginCustomer,
    logoutCustomer,
    customerTab,
    setCustomerTab,
    setTrackingOrderId,
    setCurrentPage,
    wishlist,
    showToast,
  } = useApp();

  // Login / Register state if logged out
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  // Orders tab filter & search
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Profile Settings form state
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [emailInput, setEmailInput] = useState(user.email);
  const [avatarInput, setAvatarInput] = useState(user.avatar || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [notifySms, setNotifySms] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);

  // Address modal / form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Office');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Dhaka');
  const [newAddrPostal, setNewAddrPostal] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState(user.phone);

  // Quick avatar options
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  ];

  // Handle Login
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে ইমেইল লিখুন' : 'Please enter an email address', 'error');
      return;
    }
    loginCustomer(authEmail, authName || undefined);
  };

  const handleDemoLogin = () => {
    loginCustomer('jasminaramim2005@gmail.com', 'Jasmin Ara Mim');
  };

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
      avatar: avatarInput || prev.avatar,
    }));
    showToast(lang === 'bn' ? 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে' : 'Profile updated successfully!', 'success');
  };

  // Handle Password Update
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast(lang === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না' : 'New passwords do not match', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে' : 'Password updated successfully!', 'success');
  };

  // Handle Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে ঠিকানা লিখুন' : 'Please enter the street address', 'error');
      return;
    }
    const newAddressItem: UserAddress = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      address: newAddrStreet,
      city: newAddrCity,
      postalCode: newAddrPostal,
      phone: newAddrPhone,
      isDefault: user.addresses.length === 0,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddressItem],
    }));
    setIsAddingAddress(false);
    setNewAddrStreet('');
    setNewAddrPostal('');
    showToast(lang === 'bn' ? 'নতুন ঠিকানা যোগ হয়েছে' : 'Address added to your address book', 'success');
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = (index: number) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, idx) => ({
        ...addr,
        isDefault: idx === index,
      })),
    }));
    showToast(lang === 'bn' ? 'প্রধান ডেলিভারি ঠিকানা নির্ধারণ করা হয়েছে' : 'Default delivery address updated', 'success');
  };

  // Handle Delete Address
  const handleDeleteAddress = (index: number) => {
    if (user.addresses.length <= 1) {
      showToast(lang === 'bn' ? 'কমপক্ষে একটি ঠিকানা থাকা আবশ্যক' : 'You must have at least one delivery address', 'info');
      return;
    }
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, idx) => idx !== index),
    }));
    showToast(lang === 'bn' ? 'ঠিকানা মুছে ফেলা হয়েছে' : 'Address removed from address book', 'info');
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter !== 'all' && ord.status.toLowerCase() !== orderFilter.toLowerCase()) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchItem = ord.items.some((it) => it.product.name.toLowerCase().includes(q) || it.product.nameBn.includes(q));
      if (!matchId && !matchItem) return false;
    }
    return true;
  });

  // If customer is logged out, show the login/register screen
  if (!isLoggedIn) {
    return (
      <div className="py-16 bg-[#FAFAFA] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
            <div className="text-center mb-6">
              <span className="w-2.5 h-2.5 bg-[#B11226] rotate-45 inline-block mb-3" />
              <h2 className="font-editorial text-2xl font-bold text-gray-900 tracking-wider">
                VELVET CRIMSON
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-[#B11226] font-bold block mt-1">
                {lang === 'bn' ? 'কাস্টমার পোর্টাল ও অ্যাকাউন্ট' : 'Customer Account & Tracking'}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                {authMode === 'login'
                  ? lang === 'bn'
                    ? 'আপনার অর্ডার ট্র্যাকিং ও প্রোফাইল দেখতে সাইন ইন করুন'
                    : 'Sign in to access your orders, track shipments, and manage profile'
                  : lang === 'bn'
                  ? 'ভেলভেট ক্রিমসনের বিশেষ সুবিধার জন্য নতুন অ্যাকাউন্ট খুলুন'
                  : 'Create a customer profile for bespoke tailoring and order tracking'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex border-b border-gray-100 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer ${
                  authMode === 'login'
                    ? 'text-[#B11226] border-b-2 border-[#B11226] font-bold'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer ${
                  authMode === 'register'
                    ? 'text-[#B11226] border-b-2 border-[#B11226] font-bold'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {lang === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'Create Account'}
              </button>
            </div>

            {/* Quick Demo Customer Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mb-5 py-2.5 px-4 bg-[#FFF0F2] hover:bg-[#FFE2E6] border border-[#B11226]/30 text-[#B11226] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'bn' ? 'এক ক্লিকে কাস্টমার সাইন ইন (Jasmin Ara Mim)' : 'Quick Demo Customer Sign In (Jasmin Ara Mim)'}</span>
            </button>

            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink mx-3 text-[11px] text-gray-400 uppercase font-medium">
                {lang === 'bn' ? 'অথবা ইমেইলে' : 'or with credentials'}
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">
                      {lang === 'bn' ? 'পুরো নাম' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Jasmin Ara Mim"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">
                      {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+880 1712-345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="jasminaramim2005@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 uppercase mb-1">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B11226] hover:bg-[#8B0E1A] text-white font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-md mt-2"
              >
                {authMode === 'login'
                  ? lang === 'bn'
                    ? 'কাস্টমার হিসেবে প্রবেশ করুন'
                    : 'Sign In as Customer'
                  : lang === 'bn'
                  ? 'অ্যাকাউন্ট তৈরি করুন'
                  : 'Create Customer Account'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'গোপনীয়তা ও অর্ডার সুরক্ষা নিশ্চিত' : 'Encrypted & Confidential Patron Records'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Customer Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User Identity Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#B11226]/20 shadow-xs"
                  />
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#FFF0F2] text-[#B11226] flex items-center justify-center font-editorial text-3xl font-bold border-2 border-red-100">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span
                  className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"
                  title="Active Session"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  {/* Customer Role Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF0F2] text-[#B11226] border border-[#B11226]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'গ্রাহক রোল' : 'Customer Role'}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{user.email}</span>
                  <span>·</span>
                  <span>{user.phone}</span>
                  <span>·</span>
                  <span className="font-mono text-[#B11226] font-semibold">{user.id}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                    {user.membershipTier || 'Crimson Elite Patron'}
                  </span>
                  <span>·</span>
                  <span>{lang === 'bn' ? 'সদস্যপদ:' : 'Member since:'} {user.memberSince || 'September 2024'}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics & Logout Action */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
              <div className="flex items-center gap-4 text-center">
                <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-lg font-bold text-gray-900">{orders.length}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">{lang === 'bn' ? 'অর্ডার' : 'Orders'}</span>
                </div>
                <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-lg font-bold text-[#B11226]">{wishlist.length}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">{lang === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}</span>
                </div>
                <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="block text-lg font-bold text-gray-900">{user.addresses.length}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">{lang === 'bn' ? 'ঠিকানা' : 'Addresses'}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logoutCustomer}
                className="px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Log Out of Customer Account"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগআউট' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto pb-1 text-xs font-semibold gap-2">
          <button
            onClick={() => setCustomerTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
              customerTab === 'orders'
                ? 'bg-white border-b-2 border-[#B11226] text-[#B11226] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'} ({orders.length})</span>
          </button>

          <button
            onClick={() => setCustomerTab('track')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
              customerTab === 'track'
                ? 'bg-white border-b-2 border-[#B11226] text-[#B11226] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Orders'}</span>
          </button>

          <button
            onClick={() => setCustomerTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
              customerTab === 'profile'
                ? 'bg-white border-b-2 border-[#B11226] text-[#B11226] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}</span>
          </button>

          <button
            onClick={() => setCustomerTab('addresses')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
              customerTab === 'addresses'
                ? 'bg-white border-b-2 border-[#B11226] text-[#B11226] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Delivery Addresses'} ({user.addresses.length})</span>
          </button>

          <button
            onClick={() => setCustomerTab('privileges')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
              customerTab === 'privileges'
                ? 'bg-white border-b-2 border-[#B11226] text-[#B11226] font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'bn' ? 'গ্রাহক সুবিধা' : 'Customer Privileges'}</span>
          </button>
        </div>

        {/* Tab 1: Orders Tab */}
        {customerTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and search toolbar */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
                {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map((statusKey) => (
                  <button
                    key={statusKey}
                    onClick={() => setOrderFilter(statusKey)}
                    className={`px-3 py-1.5 rounded-full capitalize transition-colors whitespace-nowrap cursor-pointer ${
                      orderFilter === statusKey
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {statusKey === 'all'
                      ? lang === 'bn'
                        ? 'সব অর্ডার'
                        : 'All'
                      : statusKey === 'processing'
                      ? lang === 'bn'
                        ? 'অ্যাটেলিয়ার'
                        : 'Atelier Processing'
                      : statusKey}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder={lang === 'bn' ? 'অর্ডার বা পোশাক অনুসন্ধান...' : 'Search by ID or piece...'}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-800 text-sm">
                  {lang === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Orders Found'}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  {orderSearch || orderFilter !== 'all'
                    ? lang === 'bn'
                      ? 'ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                      : 'Try resetting the status filter or search keyword.'
                    : lang === 'bn'
                    ? 'আমাদের প্রিমিয়াম কালেকশন ঘুরে দেখুন এবং নতুন পোশাক অর্ডার করুন।'
                    : 'Discover our luxury collection and place your first atelier order.'}
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="mt-4 px-5 py-2.5 bg-[#B11226] text-white text-xs font-bold uppercase rounded-md"
                >
                  {lang === 'bn' ? 'কালেকশন দেখুন' : 'Explore Catalog'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-gray-200 hover:border-red-200 transition-all rounded-xl p-6 shadow-2xs"
                  >
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-gray-900 text-base">#{ord.id}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {ord.date}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-600 uppercase font-semibold">
                          {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : ord.paymentMethod.toUpperCase()} (
                          {ord.paymentStatus})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : ord.status === 'Processing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {ord.status}
                        </span>
                        <span className="font-bold text-gray-900 text-base">
                          {t.currency}{ord.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Ordered items list */}
                    <div className="py-4 space-y-3">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
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
                          <span className="font-bold text-gray-900 text-sm">
                            {t.currency}{((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order card footer with Track button */}
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B11226]" />
                        <span>
                          {ord.shippingInfo.address}, {ord.shippingInfo.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTrackingOrderId(ord.id);
                            setCustomerTab('track');
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="px-4 py-2 bg-[#B11226] hover:bg-[#8B0E1A] text-white rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Order Tracker */}
        {customerTab === 'track' && (
          <OrderTracker onBackToOrders={() => setCustomerTab('orders')} />
        )}

        {/* Tab 3: Profile Settings */}
        {customerTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {/* Personal Details Form */}
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B11226]">
                      {lang === 'bn' ? 'গ্রাহক তথ্য' : 'Personal Profile'}
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-gray-900 mt-0.5">
                      {lang === 'bn' ? 'ব্যক্তিগত তথ্য হালনাগাদ' : 'Update Personal Information'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF0F2] text-[#B11226]">
                    Customer
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">
                      {lang === 'bn' ? 'পুরো নাম' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'ইমেইল' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">
                      {lang === 'bn' ? 'প্রোফাইল ছবি URL' : 'Avatar Photo URL'}
                    </label>
                    <input
                      type="text"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                    />
                    {/* Quick Avatar Presets */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-gray-400">{lang === 'bn' ? 'দ্রুত নির্বাচন:' : 'Presets:'}</span>
                      {avatarPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarInput(preset)}
                          className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 hover:border-[#B11226] cursor-pointer"
                        >
                          <img src={preset} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#B11226] hover:bg-[#8B0E1A] text-white font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-xs mt-2"
                  >
                    {lang === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Password & Security Card */}
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
                  <Lock className="w-4 h-4 text-[#B11226]" />
                  <h3 className="font-editorial text-xl font-bold text-gray-900">
                    {lang === 'bn' ? 'পাসওয়ার্ড ও নিরাপত্তা' : 'Security & Password'}
                  </h3>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">
                      {lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right column: Notification preferences & Concierge card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-2xs">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
                  <Bell className="w-4 h-4 text-[#B11226]" />
                  <h3 className="font-editorial text-lg font-bold text-gray-900">
                    {lang === 'bn' ? 'বিজ্ঞপ্তি পছন্দসমূহ' : 'Notification Preferences'}
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lang === 'bn' ? 'এসএমএস ডেলিভারি আপডেট' : 'SMS Order Updates'}
                      </p>
                      <p className="text-gray-500 text-[11px]">Receive live parcel transit alerts on your phone</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifySms}
                      onChange={(e) => setNotifySms(e.target.checked)}
                      className="w-4 h-4 accent-[#B11226] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lang === 'bn' ? 'হোয়াটসঅ্যাপ স্টাইলিস্ট নোটিশ' : 'WhatsApp Concierge Alerts'}
                      </p>
                      <p className="text-gray-500 text-[11px]">Direct WhatsApp alerts from our tailoring atelier</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyWhatsapp}
                      onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                      className="w-4 h-4 accent-[#B11226] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lang === 'bn' ? 'বিশেষ ছাড় ও প্রিভিউ' : 'Exclusive Seasonal Previews'}
                      </p>
                      <p className="text-gray-500 text-[11px]">Private invitations to seasonal crimson exhibitions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyPromos}
                      onChange={(e) => setNotifyPromos(e.target.checked)}
                      className="w-4 h-4 accent-[#B11226] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Role Card */}
              <div className="bg-gradient-to-br from-stone-950 via-[#1C1B1B] to-stone-900 text-white p-6 rounded-xl border border-stone-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-widest text-[#B11226] uppercase">
                    Customer Role
                  </span>
                  <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded font-mono text-red-200">
                    Privilege Verified
                  </span>
                </div>
                <h4 className="font-editorial text-xl font-bold mb-2">Velvet Crimson Patron</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed mb-4">
                  {lang === 'bn'
                    ? 'আপনার কাস্টমার প্রোফাইল সম্পূর্ণ সক্রিয়। আপনি পাচ্ছেন ফ্রি ডেলিভারি ও ব্যক্তিগত স্টাইলিস্ট সহায়তা।'
                    : 'Your customer account unlocks white-glove courier delivery, tailored alterations, and 24/7 client concierge.'}
                </p>
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span>Concierge Hotline:</span>
                  <a href="tel:+8801712345678" className="text-white font-medium hover:underline">
                    +880 1712-345678
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Saved Addresses */}
        {customerTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-xl font-bold text-gray-900">
                  {lang === 'bn' ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Delivery Addresses'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'bn'
                    ? 'দ্রুত চেকআউট ও হোম ডেলিভারির জন্য ঠিকানা পরিচালনা করুন'
                    : 'Manage your preferred shipping destinations for express checkout'}
                </p>
              </div>

              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="px-4 py-2 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'নতুন ঠিকানা' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <div className="bg-white rounded-xl p-6 border border-[#B11226]/30 shadow-md animate-in fade-in">
                <h4 className="font-editorial text-base font-bold text-gray-900 mb-4">
                  {lang === 'bn' ? 'নতুন ডেলিভারি ঠিকানা যোগ করুন' : 'Add New Shipping Address'}
                </h4>
                <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'ঠিকানার ধরন' : 'Address Label'}
                      </label>
                      <input
                        type="text"
                        value={newAddrTitle}
                        onChange={(e) => setNewAddrTitle(e.target.value)}
                        placeholder="e.g. Home, Office, Studio"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'যোগাযোগের ফোন নম্বর' : 'Contact Phone'}
                      </label>
                      <input
                        type="tel"
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">
                      {lang === 'bn' ? 'পূর্ণ ঠিকানা (রোড, বাড়ি, এলাকা)' : 'Street Address'}
                    </label>
                    <input
                      type="text"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      placeholder="e.g. House 42, Road 11, Block D, Banani"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'শহর / জেলা' : 'City / District'}
                      </label>
                      <input
                        type="text"
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">
                        {lang === 'bn' ? 'পোস্টাল কোড' : 'Postal Code'}
                      </label>
                      <input
                        type="text"
                        value={newAddrPostal}
                        onChange={(e) => setNewAddrPostal(e.target.value)}
                        placeholder="1213"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#B11226] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#B11226] hover:bg-[#8B0E1A] text-white font-bold uppercase tracking-wider rounded-md transition-colors"
                    >
                      {lang === 'bn' ? 'ঠিকানা সংরক্ষণ' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.addresses.map((addr, idx) => (
                <div
                  key={addr.id || idx}
                  className={`bg-white rounded-xl p-6 border transition-all ${
                    addr.isDefault
                      ? 'border-[#B11226] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#B11226]" />
                      <span className="font-bold text-gray-900 text-sm">{addr.title}</span>
                    </div>
                    {addr.isDefault ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F2] text-[#B11226] border border-[#B11226]/20">
                        {lang === 'bn' ? 'প্রধান ঠিকানা' : 'Default'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultAddress(idx)}
                        className="text-[11px] text-gray-500 hover:text-[#B11226] underline cursor-pointer"
                      >
                        {lang === 'bn' ? 'প্রধান করুন' : 'Set as Default'}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">{addr.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {addr.city} {addr.postalCode ? `- ${addr.postalCode}` : ''}
                  </p>
                  {addr.phone && <p className="text-xs font-mono text-gray-500 mt-1">{addr.phone}</p>}

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Customer Role & Privileges */}
        {customerTab === 'privileges' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
                <ShieldCheck className="w-6 h-6 text-[#B11226]" />
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-gray-900">
                    {lang === 'bn' ? 'গ্রাহক সুবিধা ও প্রিভিলেজ' : 'Customer Privileges & Patron Benefits'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lang === 'bn'
                      ? 'ভেলভেট ক্রিমসনের কাস্টমার হিসেবে আপনার প্রাপ্য সুবিধাসমূহ'
                      : 'Exclusive couture courtesies included with your customer membership'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Truck className="w-4 h-4 text-[#B11226]" />
                    <span>Complimentary Express Delivery</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Enjoy zero delivery charges on all haute couture orders above ৳5,000 across Bangladesh with real-time live dispatch tracking.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Sparkles className="w-4 h-4 text-[#B11226]" />
                    <span>Bespoke Atelier Alterations</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Complimentary fitting adjustments and blouse alterations within 30 days of receiving your garments at our Banani or Dhanmondi atelier.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Phone className="w-4 h-4 text-[#B11226]" />
                    <span>Dedicated Personal Fashion Concierge</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Direct access to our chief stylist via phone and WhatsApp (+880 1712-345678) for bridal styling, color customization, and urgent orders.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <ShieldCheck className="w-4 h-4 text-[#B11226]" />
                    <span>Authenticity Guarantee & 7-Day Returns</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Every garment arrives with a certificate of fabric origin (pure silk, jamdani, velvet) and a seamless 7-day hassle-free exchange window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
