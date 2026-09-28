import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    lang,
    t,
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useApp();

  // Filter States
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('latest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Available Sizes and Colors across all products
  const allSizes = ['S', 'M', 'L', 'XL', 'Free Size'];
  const allColors = [
    { name: 'Crimson Red', hex: '#B11226' },
    { name: 'Deep Burgundy', hex: '#8B0E1A' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Ivory White', hex: '#FAFAFA' },
    { name: 'Obsidian Black', hex: '#111111' },
  ];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesNameBn = p.nameBn?.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesNameBn && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // 3. Price filter
      const effectivePrice = p.discountPrice ?? p.price;
      if (effectivePrice > maxPrice) {
        return false;
      }

      // 4. Size filter
      if (selectedSize && !p.sizes.includes(selectedSize)) {
        return false;
      }

      // 5. Color filter
      if (
        selectedColor &&
        !p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      ) {
        return false;
      }

      // 6. Stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best-selling') return (b.isBestSelling ? 1 : 0) - (a.isBestSelling ? 1 : 0);
      return 0; // 'latest'
    });
  }, [products, searchQuery, selectedCategory, maxPrice, selectedSize, selectedColor, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSelectedSize(null);
    setSelectedColor(null);
    setMaxPrice(15000);
    setInStockOnly(false);
    setSortBy('latest');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchQuery) ||
    Boolean(selectedSize) ||
    Boolean(selectedColor) ||
    maxPrice < 15000 ||
    inStockOnly;

  return (
    <div className="py-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-gray-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B11226] font-semibold">
              {lang === 'bn' ? 'ভেলভেট ক্রিমসন পোশাক সম্ভার' : 'EXCLUSIVE RED & WHITE COUTURE'}
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              {t.shop.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t.shop.showing} <span className="font-bold text-gray-800">{filteredProducts.length}</span> {t.shop.of} {products.length} {t.shop.products}
            </p>
          </div>

          {/* Controls: Search, Sort, Mobile Filter toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="w-full sm:w-60 pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#B11226]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-[#B11226] cursor-pointer"
            >
              <option value="latest">{t.shop.sortLatest}</option>
              <option value="best-selling">{t.shop.sortBestSelling}</option>
              <option value="price-asc">{t.shop.sortPriceLowHigh}</option>
              <option value="price-desc">{t.shop.sortPriceHighLow}</option>
              <option value="rating">{t.shop.sortTopRated}</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#B11226] flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t.shop.filters}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-lg border border-gray-200/80">
            <span className="text-xs text-gray-500 font-medium">
              {lang === 'bn' ? 'সক্রিয় ফিল্টার:' : 'Active Filters:'}
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-[#B11226] text-xs font-medium">
                {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                Size: {selectedSize}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize(null)} />
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                Color: {selectedColor}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedColor(null)} />
              </span>
            )}
            {maxPrice < 15000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                Max: ৳{maxPrice.toLocaleString()}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(15000)} />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                In Stock Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#B11226] hover:underline font-semibold ml-auto flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.shop.clearFilters}</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-editorial text-lg font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B11226]" />
                <span>{t.shop.filters}</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-400 hover:text-[#B11226] transition-colors"
                >
                  {t.shop.clearFilters}
                </button>
              )}
            </div>

            {/* Categories filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
                {t.shop.category}
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left py-1 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === null
                        ? 'bg-[#FFF0F2] text-[#B11226] font-bold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>{t.shop.allCategories}</span>
                    <span>{products.length}</span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1 px-2 rounded transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-[#FFF0F2] text-[#B11226] font-bold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>{lang === 'bn' ? cat.nameBn : cat.name}</span>
                      <span className="text-gray-400 text-[11px]">{cat.productCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                <span>{t.shop.priceRange}</span>
                <span className="text-[#B11226] font-bold">{t.currency}{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#B11226] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>৳1,000</span>
                <span>৳15,000</span>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
                {t.shop.sizes}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                    className={`px-3 py-1.5 text-xs rounded border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'border-[#B11226] bg-[#B11226] text-white font-bold'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
                {t.shop.colors}
              </h4>
              <div className="flex flex-wrap gap-2">
                {allColors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(selectedColor === col.name ? null : col.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === col.name ? 'border-[#B11226] scale-110 shadow-md ring-2 ring-red-200' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* In stock checkbox */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#B11226] focus:ring-[#B11226]"
                />
                <span>{t.shop.inStockOnly}</span>
              </label>
            </div>
          </aside>

          {/* Products Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <p className="font-editorial text-2xl font-bold text-gray-800 mb-2">
                  {t.shop.noProductsFound}
                </p>
                <p className="text-xs text-gray-500 mb-6 font-light">
                  {t.shop.resetSearch}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#B11226] text-white text-xs font-semibold uppercase rounded-md"
                >
                  {t.shop.clearFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="font-editorial text-lg font-bold text-gray-900">
                  {t.shop.filters}
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                  {t.shop.category}
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1 px-2 rounded ${
                      selectedCategory === null ? 'bg-[#FFF0F2] text-[#B11226] font-bold' : 'text-gray-700'
                    }`}
                  >
                    {t.shop.allCategories}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1 px-2 rounded ${
                        selectedCategory === c.slug ? 'bg-[#FFF0F2] text-[#B11226] font-bold' : 'text-gray-700'
                      }`}
                    >
                      {lang === 'bn' ? c.nameBn : c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase text-gray-900 mb-2">
                  <span>{t.shop.priceRange}</span>
                  <span className="text-[#B11226]">৳{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B11226]"
                />
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                  {t.shop.sizes}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                      className={`px-3 py-1 text-xs rounded border ${
                        selectedSize === sz ? 'bg-[#B11226] text-white' : 'border-gray-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#B11226] text-white text-xs font-bold uppercase rounded-md"
              >
                {lang === 'bn' ? 'ফলাফল দেখুন' : 'Apply Filters'}
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-900"
              >
                {t.shop.clearFilters}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
