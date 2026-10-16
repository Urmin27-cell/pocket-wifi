import React from 'react';
import { MessageSquare, Eye, Wifi, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { formatAriary } from '../utils/formatters';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from './ThemeContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onOrder }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const primaryImage = product.images?.[0]?.dataUrl;
  const inStock = product.stockQuantity > 0;

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:-translate-y-1 ${
      theme === 'light'
        ? 'bg-white border border-slate-200 hover:border-red-500 shadow-slate-200 hover:shadow-xl'
        : 'bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 shadow-red-950/20'
    }`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        {product.isFeatured && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-md">
            {t.featuredBadge}
          </span>
        )}
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border ${
          theme === 'light'
            ? 'bg-white/90 text-red-600 border-red-200 shadow-sm'
            : 'bg-slate-950/80 text-red-300 border-slate-700'
        }`}>
          {product.category}
        </span>
      </div>

      {/* Stock status badge */}
      <div className="absolute top-3 right-3 z-10">
        {inStock ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t.inStock} ({product.stockQuantity})</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950/80 backdrop-blur-md text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>{t.outOfStock}</span>
          </span>
        )}
      </div>

      {/* Image Container with Base64 display */}
      <div
        onClick={() => onSelect(product)}
        className={`relative w-full aspect-square overflow-hidden cursor-pointer flex items-center justify-center p-4 ${
          theme === 'light' ? 'bg-slate-50' : 'bg-slate-950/50'
        }`}
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
            <Wifi className="w-12 h-12 text-slate-400" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Hover quick preview button overlay */}
        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-red-300 text-xs font-semibold backdrop-blur-md border border-red-500/30">
            <Eye className="w-3.5 h-3.5" />
            <span>{t.viewDetails}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            onClick={() => onSelect(product)}
            className={`font-bold text-base transition-colors cursor-pointer line-clamp-1 ${
              theme === 'light' ? 'text-slate-900 group-hover:text-red-600' : 'text-white group-hover:text-red-300'
            }`}
            title={product.name}
          >
            {product.name}
          </h3>
          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {product.shortDescription || 'Pocket WiFi & routeurs portables haut débit.'}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className={`pt-3 border-t space-y-3 ${theme === 'light' ? 'border-slate-100' : 'border-slate-800/80'}`}>
          <div className="flex items-baseline justify-between">
            <span className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-300'}`}>{t.priceLabel}</span>
            <span className="text-lg font-extrabold text-red-600 tracking-tight">
              {formatAriary(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.viewDetails}</span>
            </button>

            <button
              type="button"
              onClick={() => onOrder(product)}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>{t.buyWhatsApp}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
