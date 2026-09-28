/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastNotification } from './components/ToastNotification';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoriesPage } from './components/CategoriesPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { WishlistPage } from './components/WishlistPage';
import { AccountPage } from './components/AccountPage';
import { AdminPanel } from './components/AdminPanel';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PolicyPage } from './components/PolicyPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmation />;
      case 'wishlist':
        return <WishlistPage />;
      case 'account':
        return <AccountPage />;
      case 'admin':
        return <AdminPanel />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'returns':
        return <PolicyPage type="returns" />;
      case 'privacy':
        return <PolicyPage type="privacy" />;
      case 'terms':
        return <PolicyPage type="terms" />;
      default:
        return <HomePage />;
    }
  };

  // When in Admin mode at /admin, render a dedicated, separate Admin Portal layout
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F6F6] text-gray-900 selection:bg-[#B11226] selection:text-white font-sans antialiased">
        <AdminPanel />
        <ToastNotification />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-[#B11226] selection:text-white font-sans antialiased">
      {/* Top Header & Navigation */}
      <Header />

      {/* Main Page Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
