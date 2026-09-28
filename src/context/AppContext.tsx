import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActivePage,
  Language,
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  ShippingInfo,
  Coupon,
  Review,
  ContactMessage,
  UserProfile,
} from '../types';
import { translations } from '../i18n/translations';
import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialReviews,
  mockOrders,
  initialUser,
} from '../data/mockData';

interface ToastState {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.en;
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, newQty: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartGrandTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  orders: Order[];
  latestOrder: Order | null;
  placeOrder: (shippingInfo: ShippingInfo, paymentMethod: PaymentMethod) => Order;
  reviews: Review[];
  addReview: (review: { productId?: string; customerName: string; rating: number; comment: string }) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  customerTab: 'orders' | 'track' | 'profile' | 'addresses' | 'privileges';
  setCustomerTab: (tab: 'orders' | 'track' | 'profile' | 'addresses' | 'privileges') => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  logoutCustomer: () => void;
  loginCustomer: (email: string, name?: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  navigateToProduct: (slug: string) => void;
  navigateToCategory: (slug: string) => void;
  // Admin Methods
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  contactMessages: ContactMessage[];
  sendContactMessage: (msg: { name: string; email: string; phone: string; subject: string; message: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with localStorage
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('vc_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('vc_lang', newLang);
  };

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'bn' : 'en';
    setLang(next);
  };

  const t = translations[lang] || translations.en;

  // 2. Navigation State with dedicated /admin routing
  const [currentPage, setCurrentPageState] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  });

  const setCurrentPage = (page: ActivePage) => {
    if (page === 'track-order') {
      setCurrentPageState('account');
      setCustomerTab('track');
      if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
      return;
    }
    setCurrentPageState(page);
    if (typeof window !== 'undefined') {
      if (page === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState(null, '', '/admin');
        }
      } else {
        if (window.location.pathname === '/admin') {
          window.history.pushState(null, '', '/');
        }
      }
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setCurrentPageState('admin');
      } else if (currentPage === 'admin' && path !== '/admin' && hash !== '#admin') {
        setCurrentPageState('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentPage]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Products & Categories State (with MongoDB Atlas real-time sync)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vc_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('vc_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialCategories;
  });

  // Sync with MongoDB backend endpoints on mount
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.log('[API Notice] Products loaded from local state:', err));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('vc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vc_categories', JSON.stringify(categories));
  }, [categories]);

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vc_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('vc_cart', JSON.stringify(cart));
  }, [cart]);

  // 5. Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('vc_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['prod-001', 'prod-002'];
  });

  useEffect(() => {
    localStorage.setItem('vc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 6. Coupons & Orders State
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vc_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockOrders;
  });
  const [latestOrder, setLatestOrder] = useState<Order | null>(orders[0] || null);

  useEffect(() => {
    localStorage.setItem('vc_orders', JSON.stringify(orders));
  }, [orders]);

  // 7. Reviews State
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // 8. User & Customer Auth State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialUser;
  });

  useEffect(() => {
    localStorage.setItem('vc_user', JSON.stringify(user));
  }, [user]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('vc_customer_logged_in');
    return saved === null ? true : saved === 'true';
  });

  const [customerTab, setCustomerTab] = useState<'orders' | 'track' | 'profile' | 'addresses' | 'privileges'>('orders');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>('VC-10027');

  const logoutCustomer = () => {
    setIsLoggedIn(false);
    localStorage.setItem('vc_customer_logged_in', 'false');
    showToast(lang === 'bn' ? 'কাস্টমার অ্যাকাউন্ট থেকে সফলভাবে লগআউট হয়েছে' : 'Signed out of Velvet Crimson customer account', 'info');
  };

  const loginCustomer = (email: string, name?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('vc_customer_logged_in', 'true');
    if (name || email) {
      setUser((prev) => ({
        ...prev,
        email: email || prev.email,
        name: name || prev.name,
      }));
    }
    showToast(lang === 'bn' ? `স্বাগতম, ${name || user.name}!` : `Welcome back, ${name || user.name}!`, 'success');
  };

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 9. Toast Notification State
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3200);
  };

  // 10. Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // 11. Contact messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([
    {
      id: 'msg-1',
      name: 'Farzana Kabir',
      email: 'farzana.kabir@gmail.com',
      phone: '01819998877',
      subject: 'Bridal Saree Custom Color Consultation',
      message: 'Hello, do you offer bespoke color dying for the Scarlet Jamdani saree in darker wine crimson?',
      date: '2026-09-05',
      status: 'new',
    },
  ]);

  // Actions
  const addToCart = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || product.colors[0]?.name || 'Crimson Red';

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity,
          },
        ];
      }
    });

    showToast(t.productCard.addedToCart, 'success');
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (size && color) {
          return !(
            item.productId === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          );
        }
        return item.productId !== productId;
      })
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    color: string,
    newQty: number
  ) => {
    if (newQty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart Calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartDiscount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const cartShippingFee = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 80;

  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(t.productCard.removedFromWishlist, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(t.productCard.addedToWishlist, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.status
    );

    if (!found) {
      return { success: false, message: t.cart.invalidCoupon };
    }

    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `${t.cart.invalidCoupon} (Min. ৳${found.minOrder.toLocaleString()})`,
      };
    }

    setAppliedCoupon(found);
    showToast(t.cart.couponApplied, 'success');
    return { success: true, message: t.cart.couponApplied };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const placeOrder = (
    shippingInfo: ShippingInfo,
    paymentMethod: PaymentMethod
  ): Order => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `VC-${orderNumber}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartShippingFee,
      total: cartGrandTotal,
      shippingInfo,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);

    // Persist order to MongoDB backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.log('[API Notice] Saved to local orders:', err));

    clearCart();
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(t.confirmation.title, 'success');
    return newOrder;
  };

  const addReview = (reviewData: {
    productId?: string;
    customerName: string;
    rating: number;
    comment: string;
  }) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      customerName: reviewData.customerName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast(t.productDetail.reviewSubmitted, 'success');
  };

  const sendContactMessage = (msg: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...msg,
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    showToast(t.contact.sentSuccess, 'success');
  };

  // Navigation helpers
  const navigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Methods (synced with MongoDB Atlas)
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const productWithId: Product = { ...newProd, id };
    setProducts((prev) => [productWithId, ...prev]);

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productWithId),
    }).catch(() => {});

    showToast('Product added successfully to catalog!', 'success');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );

    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});

    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    fetch(`/api/products/${id}`, {
      method: 'DELETE',
    }).catch(() => {});

    showToast('Product removed from catalog', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});

    showToast(`Order ${orderId} updated to ${status}`, 'success');
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} removed`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        t,
        currentPage,
        setCurrentPage,
        selectedCategory,
        setSelectedCategory,
        selectedProductSlug,
        setSelectedProductSlug,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartGrandTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        orders,
        latestOrder,
        placeOrder,
        reviews,
        addReview,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        customerTab,
        setCustomerTab,
        trackingOrderId,
        setTrackingOrderId,
        logoutCustomer,
        loginCustomer,
        isAdmin,
        setIsAdmin,
        toast,
        showToast,
        quickViewProduct,
        setQuickViewProduct,
        navigateToProduct,
        navigateToCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        coupons,
        addCoupon,
        deleteCoupon,
        contactMessages,
        sendContactMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
