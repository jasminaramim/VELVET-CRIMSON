import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Globe,
  Package,
  Truck,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    toggleLanguage,
    t,
    currentPage,
    setCurrentPage,
    cartTotalCount,
    setIsCartDrawerOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    user,
    isLoggedIn,
    setCustomerTab,
    logoutCustomer,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('shop');
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: t.nav.home, page: 'home' as const },
    { label: t.nav.shop, page: 'shop' as const },
    { label: t.nav.categories, page: 'categories' as const },
    { label: t.nav.about, page: 'about' as const },
    { label: t.nav.contact, page: 'contact' as const },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#111111] text-white text-xs py-2 px-4 text-center tracking-wider flex items-center justify-center relative">
        <p className="font-light truncate text-gray-200">
          <span className="text-[#B11226] font-semibold mr-2">FESTIVE EDIT:</span>
          {lang === 'bn'
            ? '৳৫,০০০-এর বেশি অর্ডারে সারা দেশে ফ্রি এক্সপ্রেস ডেলিভারি | কোড: CRIMSON20'
            : 'Complimentary VIP Courier on orders over ৳5,000 | Use Code CRIMSON20 for 20% Off'}
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-6 sm:px-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-800 hover:text-[#B11226] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-800 hover:text-[#B11226] transition-colors ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Desktop Nav grouped as in Professional Polish */}
          <div className="flex items-center space-x-8 lg:space-x-12">
            <div
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage('home');
              }}
              className="cursor-pointer flex flex-col items-start select-none group"
            >
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tighter text-[#B11226] group-hover:text-[#8B0E1A] transition-colors">
                VELVET CRIMSON
              </span>
              <span className="text-[9px] tracking-[0.35em] text-gray-400 uppercase font-medium -mt-1 hidden sm:block">
                {lang === 'bn' ? 'আভিজাত্যময় ফ্যাশন' : 'HAUTE COUTURE DHAKA'}
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest text-[#111111]">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => {
                      if (item.page === 'shop') setSelectedCategory(null);
                      setCurrentPage(item.page);
                    }}
                    className={`transition-colors pb-1 cursor-pointer ${
                      isActive
                        ? 'text-[#B11226] border-b-2 border-[#B11226]'
                        : 'hover:text-[#B11226] text-[#111111]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-5 sm:space-x-6 text-gray-700">
            {/* Desktop Search Bar */}
            <div className="relative hidden md:block">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.nav.search}
                  className="w-40 lg:w-56 pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#B11226] focus:border-[#B11226] transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>
            </div>

            {/* Language Switcher Badge (Theme styled) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-[10px] font-bold border border-gray-200 rounded px-2.5 py-1 bg-gray-50 uppercase hover:border-gray-300 transition-colors cursor-pointer"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <span className={lang === 'en' ? 'text-[#B11226]' : 'text-gray-400'}>EN</span>
              <span className="text-gray-300">|</span>
              <span className={lang === 'bn' ? 'text-[#B11226]' : 'text-gray-400'}>বাংলা</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setCurrentPage('wishlist')}
              className="relative text-gray-700 hover:text-[#B11226] transition-colors p-1"
              aria-label="Wishlist"
              title={t.nav.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B11226] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative text-gray-700 hover:text-[#B11226] transition-colors p-1"
              aria-label="Shopping Cart"
              title={t.nav.cart}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B11226] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="text-gray-700 hover:text-[#B11226] transition-colors p-1 flex items-center gap-1.5"
                aria-label="User Account"
                title={isLoggedIn ? user.name : t.nav.account}
              >
                {isLoggedIn && user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#B11226]/30"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {isUserDropdownOpen && (
                <div
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-sm animate-in fade-in"
                >
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-[#FAFAFA]/70">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            {lang === 'bn' ? 'কাস্টমার প্রোফাইল' : 'Customer Account'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F2] text-[#B11226]">
                            <ShieldCheck className="w-3 h-3" />
                            {lang === 'bn' ? 'গ্রাহক' : 'Customer'}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 truncate text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCustomerTab('orders');
                            setCurrentPage('account');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-[#FFF0F2] hover:text-[#B11226] transition-colors flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2.5 text-xs font-medium">
                            <Package className="w-4 h-4 text-gray-400 group-hover:text-[#B11226]" />
                            {lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B11226]" />
                        </button>

                        <button
                          onClick={() => {
                            setCustomerTab('track');
                            setCurrentPage('account');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-[#FFF0F2] hover:text-[#B11226] transition-colors flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2.5 text-xs font-medium">
                            <Truck className="w-4 h-4 text-gray-400 group-hover:text-[#B11226]" />
                            {lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Orders'}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B11226]" />
                        </button>

                        <button
                          onClick={() => {
                            setCustomerTab('profile');
                            setCurrentPage('account');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-[#FFF0F2] hover:text-[#B11226] transition-colors flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2.5 text-xs font-medium">
                            <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#B11226]" />
                            {lang === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#B11226]" />
                        </button>

                        <button
                          onClick={() => {
                            setCurrentPage('wishlist');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-[#FFF0F2] hover:text-[#B11226] transition-colors flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2.5 text-xs font-medium">
                            <Heart className="w-4 h-4 text-gray-400 group-hover:text-[#B11226]" />
                            {t.account.tabs.wishlist}
                          </span>
                          <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-semibold">
                            {wishlist.length}
                          </span>
                        </button>
                      </div>

                      <div className="pt-1 mt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            logoutCustomer();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-xs font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'লগআউট করুন' : 'Log Out'}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <div className="text-center py-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {lang === 'bn' ? 'কাস্টমার অ্যাকাউন্ট' : 'Customer Account'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {lang === 'bn' ? 'অর্ডার ট্র্যাকিং ও প্রোফাইল দেখতে সাইন ইন করুন' : 'Sign in to track orders & manage profile'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentPage('account');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full mt-2 py-2 bg-[#B11226] hover:bg-[#8B0E1A] text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        {lang === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input when toggled */}
        {isSearchOpen && (
          <div className="py-3 border-t border-gray-100 md:hidden animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B11226]"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative ml-0 w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <span className="font-editorial text-xl font-bold tracking-widest text-[#111111]">
                  VELVET CRIMSON
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-[#B11226]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="mt-4 pb-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {lang === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-[#FFF0F2] text-[#B11226] font-semibold border border-[#B11226]/30 flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'বাংলা সংস্করণ' : 'English Edition'}</span>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation List */}
              <nav className="mt-6 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      if (item.page === 'shop') setSelectedCategory(null);
                      setCurrentPage(item.page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-base font-medium py-2 transition-colors ${
                      currentPage === item.page
                        ? 'text-[#B11226] font-bold border-l-2 border-[#B11226] pl-3'
                        : 'text-gray-800 hover:text-[#B11226] pl-1'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {/* Customer Account Links in Mobile Drawer */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      {lang === 'bn' ? 'কাস্টমার মেনু' : 'Customer Account'}
                    </span>
                    {isLoggedIn && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F2] text-[#B11226]">
                        <ShieldCheck className="w-3 h-3" />
                        {lang === 'bn' ? 'গ্রাহক' : 'Customer'}
                      </span>
                    )}
                  </div>

                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setCustomerTab('orders');
                          setCurrentPage('account');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-left py-2 px-2 text-sm text-gray-700 hover:text-[#B11226]"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          {lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerTab('track');
                          setCurrentPage('account');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-left py-2 px-2 text-sm text-gray-700 hover:text-[#B11226]"
                      >
                        <span className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          {lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Orders'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerTab('profile');
                          setCurrentPage('account');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-left py-2 px-2 text-sm text-gray-700 hover:text-[#B11226]"
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-400" />
                          {lang === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </button>

                      <button
                        onClick={() => {
                          logoutCustomer();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 text-left py-2 px-2 text-sm text-red-600 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        {lang === 'bn' ? 'লগআউট' : 'Log Out'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentPage('account');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 text-center bg-[#B11226] text-white rounded text-xs font-semibold"
                    >
                      {lang === 'bn' ? 'কাস্টমার সাইন ইন / রেজিস্টার' : 'Sign In / Register'}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('wishlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-base font-medium py-2 text-gray-800 hover:text-[#B11226] pl-1 flex items-center justify-between"
                >
                  <span>{t.nav.wishlist}</span>
                  {wishlist.length > 0 && (
                    <span className="bg-[#B11226] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-center text-[11px] text-gray-400">
                © 2026 Velvet Crimson. Haute Couture Dhaka & London.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
