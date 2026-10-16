import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Wifi, X } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../i18n/LanguageContext';

interface CatalogPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOrderProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  onSelectProduct,
  onOrderProduct,
}) => {
  const { t, lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;

        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t.catalogTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
          {t.catalogSubtitle}
        </p>
      </div>

      {/* Search & Filters Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-56 px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
              <option value="name">{t.sortName}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {t.catAll}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          {t.productsFound} <strong className="text-white font-bold">{filteredProducts.length}</strong>
        </span>
        {(searchTerm || selectedCategory !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            {t.resetFilters}
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onOrder={onOrderProduct}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Wifi className="w-14 h-14 text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t.noProductsFound}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {t.noProductsHint}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            {t.viewAllProducts}
          </button>
        </div>
      )}
    </div>
  );
};
