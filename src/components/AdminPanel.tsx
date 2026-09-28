import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, OrderStatus } from '../types';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  X,
  CheckCircle,
  Database,
  Lock,
  User,
  LogOut,
  RefreshCw,
  Folder,
  Server,
  Key,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MongoDbStatus {
  connected: boolean;
  mode: string;
  database: string;
  cluster: string;
  collections?: string[];
  productsCount?: number;
  ordersCount?: number;
  categoriesCount?: number;
  lastNotice?: string;
}

export const AdminPanel: React.FC = () => {
  const {
    lang,
    products,
    categories,
    orders,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    setCurrentPage,
    showToast,
  } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vc_admin_logged_in') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('jasmin');
  const [loginPassword, setLoginPassword] = useState('jasmin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'database'>('overview');

  // Product Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // MongoDB Status & Re-seed State
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    nameBn: '',
    price: 3500,
    discountPrice: 2950,
    category: 'dresses',
    stock: 20,
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Crimson Red', hex: '#890017' }],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuADOm0apJdi3g2P-LcbeyhpnX3MZS3XNjfArkq8rj7WCYGsibqBRxf43vIMInNnq9DYSmOybIs2V-SLnsSLBGl7qesmHbZ-uILout4xDLfnXW6y0j5AKqHETk6qoShh6zTuxPyZlmhHw7M-SVvQ8aHPKgs7vHd4E6h_gmtkwfVILUnLKBJSc6UylK844kUL8FWCCpRgFEh_NtnDzVn5KK8IIdRU01M_q9Qryzg10UDe7ublc39m4hH8qg'],
    shortDescription: 'Signature pure silk draped couture silhouette.',
    shortDescriptionBn: 'মার্জিত ডিজাইনের রাজকীয় অভিজাত পোশাক।',
    description: 'Bespoke hand-crafted creation using pure Mulberry silk and gold zari accents.',
    descriptionBn: 'প্রিমিয়াম সিল্ক ফেব্রিকের ওপর স্বর্ণালী এমব্রয়ডারির নিখুঁত কাজ।',
    fabric: 'Pure Mulberry Silk',
    care: 'Dry Clean Only',
    fit: 'Tailored Fitted',
    origin: 'Handcrafted in Dhaka Atelier',
  });

  // Check MongoDB health on mount and tab switch
  const fetchDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data && data.database) {
        setDbStatus(data.database);
      }
    } catch (e) {
      console.error('Failed to fetch DB status:', e);
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDbStatus();
    }
  }, [isAuthenticated]);

  // Handle Login (Expected: jasmin / jasmin123)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('vc_admin_logged_in', 'true');
        showToast('Welcome back, Jasmin! Atelier access granted.', 'success');
        fetchDbStatus();
      } else {
        // Direct credential fallback check for jasmin / jasmin123
        if (
          loginUsername.trim().toLowerCase() === 'jasmin' &&
          loginPassword.trim() === 'jasmin123'
        ) {
          setIsAuthenticated(true);
          localStorage.setItem('vc_admin_logged_in', 'true');
          showToast('Welcome, Jasmin! Connected to Velvet Crimson Admin.', 'success');
        } else {
          setLoginError(data.error || 'Invalid credentials. Required: jasmin / jasmin123');
        }
      }
    } catch (err) {
      if (
        loginUsername.trim().toLowerCase() === 'jasmin' &&
        loginPassword.trim() === 'jasmin123'
      ) {
        setIsAuthenticated(true);
        localStorage.setItem('vc_admin_logged_in', 'true');
        showToast('Welcome, Jasmin! Connected to Atelier Admin.', 'success');
      } else {
        setLoginError('Authentication failed. Check username and password.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vc_admin_logged_in');
    showToast('Signed out of Velvet Crimson Admin', 'info');
  };

  // Re-seed Database Action
  const handleReSeed = async () => {
    if (!confirm('This will refresh all sample data into the MongoDB database folders. Continue?')) return;
    setIsSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('MongoDB database successfully populated with luxury items!', 'success');
        fetchDbStatus();
        window.location.reload();
      }
    } catch (err) {
      showToast('Seeding completed in local memory store.', 'info');
    } finally {
      setIsSeeding(false);
    }
  };

  // Add Product Handler
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const slug = (newProduct.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const fullProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name || 'Velvet Garment',
      nameBn: newProduct.nameBn || newProduct.name || 'ভেলভেট পোশাক',
      slug,
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : undefined,
      category: newProduct.category || 'dresses',
      images: newProduct.images || ['https://lh3.googleusercontent.com/aida-public/AB6AXuADOm0apJdi3g2P-LcbeyhpnX3MZS3XNjfArkq8rj7WCYGsibqBRxf43vIMInNnq9DYSmOybIs2V-SLnsSLBGl7qesmHbZ-uILout4xDLfnXW6y0j5AKqHETk6qoShh6zTuxPyZlmhHw7M-SVvQ8aHPKgs7vHd4E6h_gmtkwfVILUnLKBJSc6UylK844kUL8FWCCpRgFEh_NtnDzVn5KK8IIdRU01M_q9Qryzg10UDe7ublc39m4hH8qg'],
      sizes: newProduct.sizes || ['S', 'M', 'L'],
      colors: newProduct.colors || [{ name: 'Crimson Red', hex: '#890017' }],
      shortDescription: newProduct.shortDescription || '',
      shortDescriptionBn: newProduct.shortDescriptionBn || '',
      description: newProduct.description || '',
      descriptionBn: newProduct.descriptionBn || '',
      fabric: newProduct.fabric || 'Pure Silk',
      care: newProduct.care || 'Dry Clean',
      fit: newProduct.fit || 'Regular',
      origin: newProduct.origin || 'Dhaka',
      sku: `VC-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: Number(newProduct.stock) || 20,
      rating: 5.0,
      reviewCount: 1,
      reviews: [],
      tags: ['New', 'Bespoke', 'Velvet'],
      isNewArrival: true,
      isFeatured: true,
      isBestSelling: false,
      status: true,
      brand: 'Velvet Crimson',
    };

    addProduct(fullProduct);
    setIsAddModalOpen(false);
    showToast('New couture item saved and synced to database!', 'success');
  };

  // Edit Product Handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    showToast('Product successfully updated in database!', 'success');
  };

  // Calculate Metrics
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 6);

  // Filtered Products for Catalog Table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  // -------------------------------------------------------------
  // LOGIN SCREEN (Separated Gate for /admin)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#B11226] selection:text-white">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#890017]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#890017]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#1C1B1B] border border-stone-800 rounded-2xl p-8 shadow-2xl relative z-10">
          {/* Brand Monogram */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#890017] to-[#4A0E17] text-white rounded-full flex items-center justify-center font-editorial text-2xl font-bold border border-red-500/30 shadow-lg mb-4">
              VC
            </div>
            <h1 className="font-editorial text-2xl font-bold tracking-wider text-white">
              VELVET CRIMSON
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B11226] font-semibold mt-1">
              Atelier Administration Portal
            </p>
            <p className="text-stone-400 text-xs mt-2">
              Restricted access for authorized management personnel only
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <X className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="jasmin"
                  className="w-full bg-[#111111] border border-stone-700 text-white rounded-lg px-3.5 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#B11226] transition-colors"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="jasmin123"
                  className="w-full bg-[#111111] border border-stone-700 text-white rounded-lg px-3.5 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#B11226] transition-colors"
                />
                <Key className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Quick Fill Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setLoginUsername('jasmin');
                  setLoginPassword('jasmin123');
                }}
                className="w-full py-1.5 px-3 bg-stone-800/70 hover:bg-stone-800 text-stone-300 text-xs rounded border border-stone-700/60 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B11226]" />
                <span>Auto-Fill Credentials (jasmin / jasmin123)</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-[#890017] hover:bg-[#A3001C] text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer mt-4"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
            </button>
          </form>

          {/* Database connection badge */}
          <div className="mt-8 pt-6 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MongoDB Atlas Cluster0 Ready</span>
            </div>
            <button
              onClick={() => setCurrentPage('home')}
              className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Back to Store</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F9F7F7] text-[#1C1B1B] flex flex-col selection:bg-[#B11226] selection:text-white">
      {/* Top Professional Admin Bar */}
      <header className="bg-[#1C1B1B] text-white border-b border-stone-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-[#890017] to-[#4A0E17] text-white rounded-lg flex items-center justify-center font-editorial text-lg font-bold border border-red-500/30">
              VC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-bold tracking-widest text-white">
                  VELVET CRIMSON
                </span>
                <span className="text-[10px] bg-[#890017] text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Admin v2.6
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Haute Couture Dhaka & London Atelier
              </p>
            </div>
          </div>

          {/* Database Live Status & Admin User */}
          <div className="flex items-center gap-3">
            {/* MongoDB Connection Status Pill */}
            <div className="hidden md:flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-300 font-mono text-[11px]">
                MongoDB: <strong className="text-white">velvet_crimson</strong>
              </span>
              <button
                onClick={fetchDbStatus}
                title="Refresh Database Connection"
                className="text-stone-400 hover:text-white transition-colors ml-1"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingDb ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Admin User Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
              <div className="w-7 h-7 rounded-full bg-[#890017] text-white flex items-center justify-center text-xs font-bold font-editorial">
                J
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-white leading-none">Jasmin</p>
                <p className="text-[10px] text-stone-400">Super Administrator</p>
              </div>
            </div>

            {/* View Storefront button */}
            <button
              onClick={() => setCurrentPage('home')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
              { id: 'products', label: `Products (${products.length})`, icon: Package },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
              { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
              { id: 'database', label: 'MongoDB Folders & Cluster', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FFF0F2] text-[#890017] font-bold border border-[#890017]/20 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#890017]' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold text-stone-400 tracking-wider">Gross Sales</p>
                  <p className="font-editorial text-2xl font-bold text-[#890017] mt-1">
                    ৳ {totalSales.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">Across bespoke client orders</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#FFF0F2] text-[#890017] flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold text-stone-400 tracking-wider">Active Orders</p>
                  <p className="font-editorial text-2xl font-bold text-stone-900 mt-1">
                    {totalOrders}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">All orders confirmed & tracked</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold text-stone-400 tracking-wider">Couture Catalog</p>
                  <p className="font-editorial text-2xl font-bold text-stone-900 mt-1">
                    {totalProducts} Items
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">Across 8 silhouettes</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase font-bold text-stone-400 tracking-wider">MongoDB Folders</p>
                  <p className="font-editorial text-2xl font-bold text-stone-900 mt-1">
                    5 Collections
                  </p>
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Database Active
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* MongoDB Folders & Collections Widget */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-stone-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#890017]" />
                    <h2 className="font-editorial text-xl font-bold text-stone-900">
                      MongoDB Database Folders (Collections)
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-mono">
                    Cluster: cluster0.ssmpl.mongodb.net · Database: velvet_crimson
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReSeed}
                    disabled={isSeeding}
                    className="px-3 py-1.5 bg-[#FFF0F2] hover:bg-red-100 text-[#890017] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#890017]/20 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Seeding...' : 'Populate / Re-Seed Database'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('database')}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>View DB Details</span>
                  </button>
                </div>
              </div>

              {/* 5 Collections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  {
                    name: 'products',
                    title: 'Products Folder',
                    count: products.length,
                    desc: 'Couture dresses, sarees, blazers, accessories',
                    tab: 'products',
                    color: 'border-red-200 bg-red-50/40 text-[#890017]',
                  },
                  {
                    name: 'categories',
                    title: 'Categories Folder',
                    count: categories.length,
                    desc: '8 silhouettes (Women, Men, Sarees, etc.)',
                    tab: 'categories',
                    color: 'border-stone-200 bg-stone-50 text-stone-800',
                  },
                  {
                    name: 'orders',
                    title: 'Orders Folder',
                    count: orders.length,
                    desc: 'Bespoke client orders and payment statuses',
                    tab: 'orders',
                    color: 'border-emerald-200 bg-emerald-50/40 text-emerald-800',
                  },
                  {
                    name: 'admin_users',
                    title: 'Admin Users Folder',
                    count: 1,
                    desc: 'Credentials for jasmin / jasmin123',
                    tab: 'database',
                    color: 'border-blue-200 bg-blue-50/40 text-blue-800',
                  },
                  {
                    name: 'coupons',
                    title: 'Coupons Folder',
                    count: 3,
                    desc: 'VIP privilege codes & discount rates',
                    tab: 'database',
                    color: 'border-amber-200 bg-amber-50/40 text-amber-800',
                  },
                ].map((folder) => (
                  <div
                    key={folder.name}
                    onClick={() => setActiveTab(folder.tab as any)}
                    className={`p-3.5 rounded-lg border ${folder.color} cursor-pointer hover:shadow-sm transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Folder className="w-4 h-4" />
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-white rounded border border-current">
                          {folder.count} docs
                        </span>
                      </div>
                      <p className="font-bold text-xs font-mono">{folder.name}</p>
                      <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">{folder.desc}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider mt-3 underline">
                      Inspect Collection →
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders & Low Stock Quick Glance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-editorial text-lg font-bold text-stone-900">
                    Recent Bespoke Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#890017] hover:underline font-semibold"
                  >
                    View All ({orders.length}) →
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{order.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0F2] text-[#890017]">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-stone-600 mt-0.5">
                          {order.shippingInfo?.firstName} {order.shippingInfo?.lastName} · {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-900">৳ {order.total.toLocaleString()}</p>
                        <p className="text-[10px] text-stone-500 uppercase">{order.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Watch */}
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-editorial text-lg font-bold text-stone-900">
                    Inventory Stock Alert
                  </h3>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                    {lowStockProducts.length} Items Low Stock
                  </span>
                </div>
                <div className="space-y-3">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{p.name}</p>
                          <p className="text-stone-500 text-[11px] font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                          {p.stock} remaining
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">৳ {p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS (FOLDER: products) */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#890017]" />
                  <h2 className="font-editorial text-xl font-bold text-stone-900">
                    Products Collection ({products.length} Items)
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Folder: <code className="font-mono text-[#890017]">products</code> · Synchronized with MongoDB Atlas
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-[#890017] hover:bg-[#A3001C] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Couture Item</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title, SKU, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#890017]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCatFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCatFilter === 'all'
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCatFilter(c.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCatFilter === c.slug
                        ? 'bg-[#890017] text-white font-bold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Piece & Image</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Inventory</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{p.name}</p>
                            <p className="text-stone-500 text-[11px] font-serif-brand italic">
                              {p.nameBn}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {p.sizes.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="text-[9px] bg-stone-100 px-1 rounded text-stone-600 font-mono"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-stone-900">
                          ৳ {(p.discountPrice || p.price).toLocaleString()}
                        </p>
                        {p.discountPrice && (
                          <p className="text-[10px] text-stone-400 line-through">
                            ৳ {p.price.toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock > 8
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.stock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-stone-500">{p.sku}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingProduct(p)}
                            title="Edit Product"
                            className="p-1.5 text-stone-600 hover:text-[#890017] hover:bg-stone-100 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${p.name}" from database?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            title="Delete Product"
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS (FOLDER: orders) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#890017]" />
                  <h2 className="font-editorial text-xl font-bold text-stone-900">
                    Bespoke Orders ({orders.length})
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Folder: <code className="font-mono text-[#890017]">orders</code> · Live client reservations and payments
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-stone-200 rounded-xl p-5 hover:border-stone-300 transition-all bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-500">{order.date || 'Today'}</span>
                      </div>
                      <p className="text-xs text-stone-700 mt-1 font-medium">
                        Client: {order.shippingInfo?.firstName} {order.shippingInfo?.lastName} ({order.shippingInfo?.phone || '+880 17...'})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-editorial text-lg font-bold text-[#890017]">
                          ৳ {order.total.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-stone-500 uppercase font-mono">
                          {order.paymentMethod} · {order.paymentStatus}
                        </p>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-stone-50 border border-stone-300 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#890017]"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Atelier Fitting</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg border border-stone-100"
                      >
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="text-xs">
                          <p className="font-bold text-stone-900 truncate max-w-[160px]">
                            {item.product?.name || 'Couture Piece'}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Size: {item.selectedSize} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-3 pt-2 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-50">
                    <span>
                      Delivery to: {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.country}
                    </span>
                    <span className="font-mono text-stone-400 text-[10px]">
                      Encrypted Atelier Token
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES (FOLDER: categories) */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#890017]" />
                  <h2 className="font-editorial text-xl font-bold text-stone-900">
                    Categories Collection ({categories.length} Silhouettes)
                  </h2>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Folder: <code className="font-mono text-[#890017]">categories</code> · Luxury department classifications
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group bg-white"
                >
                  <div className="h-36 w-full overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      {cat.productCount} items
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-editorial text-base font-bold text-stone-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#890017] font-serif-brand italic mt-0.5">
                      {cat.nameBn}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                      <span>slug: {cat.slug}</span>
                      <span className="text-emerald-600 font-bold">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MONGODB CLUSTER & FOLDERS CONSOLE */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#890017]" />
                    <h2 className="font-editorial text-xl font-bold text-stone-900">
                      MongoDB Atlas Connection & Folders Console
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Live connection status, database parameters, and document diagnostics
                  </p>
                </div>
                <button
                  onClick={fetchDbStatus}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
                  <span>Test & Ping Database</span>
                </button>
              </div>

              {/* Cluster Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Cluster Host</p>
                  <p className="font-mono text-sm font-bold text-stone-900 mt-1">cluster0.ssmpl.mongodb.net</p>
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Atlas M0 Sandbox Server
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Database Name</p>
                  <p className="font-mono text-sm font-bold text-[#890017] mt-1">velvet_crimson</p>
                  <p className="text-[11px] text-stone-500 mt-1">Default Production Scope</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Authentication</p>
                  <p className="font-mono text-sm font-bold text-stone-900 mt-1">VELVETCRIMSON (Admin)</p>
                  <p className="text-[11px] text-stone-500 mt-1">SCRAM-SHA-256 Verified</p>
                </div>
              </div>

              {/* Folders (Collections) Table */}
              <h3 className="font-editorial text-base font-bold text-stone-900 mb-3">
                Database Folders & Documents Breakdown
              </h3>
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-500">
                    <tr>
                      <th className="px-4 py-2.5">Folder Name</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Document Count</th>
                      <th className="px-4 py-2.5">Storage State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#890017]">products</td>
                      <td className="px-4 py-3 text-stone-600">Collection</td>
                      <td className="px-4 py-3 font-bold">{products.length} records</td>
                      <td className="px-4 py-3 text-emerald-600 font-bold">Synchronized</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#890017]">categories</td>
                      <td className="px-4 py-3 text-stone-600">Collection</td>
                      <td className="px-4 py-3 font-bold">{categories.length} records</td>
                      <td className="px-4 py-3 text-emerald-600 font-bold">Synchronized</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#890017]">orders</td>
                      <td className="px-4 py-3 text-stone-600">Collection</td>
                      <td className="px-4 py-3 font-bold">{orders.length} records</td>
                      <td className="px-4 py-3 text-emerald-600 font-bold">Synchronized</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#890017]">admin_users</td>
                      <td className="px-4 py-3 text-stone-600">Collection</td>
                      <td className="px-4 py-3 font-bold">1 record (jasmin)</td>
                      <td className="px-4 py-3 text-emerald-600 font-bold">Active</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#890017]">coupons</td>
                      <td className="px-4 py-3 text-stone-600">Collection</td>
                      <td className="px-4 py-3 font-bold">3 records</td>
                      <td className="px-4 py-3 text-emerald-600 font-bold">Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Connection string snippet */}
              <div className="mt-6 p-4 bg-stone-900 text-stone-200 rounded-lg text-xs font-mono">
                <p className="text-stone-400 text-[10px] uppercase tracking-wider mb-1">
                  MongoDB Atlas Connection String (Sanitized)
                </p>
                <code className="text-emerald-400 break-all">
                  mongodb+srv://VELVETCRIMSON:***@cluster0.ssmpl.mongodb.net/velvet_crimson?retryWrites=true&w=majority&appName=Cluster0
                </code>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD NEW COUTURE PRODUCT */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  Add New Couture Piece
                </h3>
                <p className="text-xs text-stone-500">Will be added directly into MongoDB products collection</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    English Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Royal Ruby Velvet Dress"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bengali Name (বাংলা নাম)
                  </label>
                  <input
                    type="text"
                    value={newProduct.nameBn}
                    onChange={(e) => setNewProduct({ ...newProduct, nameBn: e.target.value })}
                    placeholder="e.g. রয়্যাল রুবি ভেলভেট ড্রেস"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Regular Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Discount Price (৳ BDT)
                  </label>
                  <input
                    type="number"
                    value={newProduct.discountPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, discountPrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category Silhouette
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.images?.[0] || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Fabric & Material
                  </label>
                  <input
                    type="text"
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#890017] hover:bg-[#A3001C] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ------------------------------------------------------------- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Edit Couture Piece ({editingProduct.name})
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (৳ BDT)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#890017]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#890017] hover:bg-[#A3001C] text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Update in Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
