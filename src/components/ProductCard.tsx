import React from 'react';
import { MessageSquare, Eye, Wifi, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { formatAriary } from '../utils/formatters';
import { useLanguage } from '../i18n/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onOrder }) => {
  const { t } = useLanguage();
  const primaryImage = product.images?.[0]?.dataUrl;
  const inStock = product.stockQuantity > 0;

  return (
    <div className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-cyan-950/20 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        {product.isFeatured && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-950 shadow-md">
            {t.featuredBadge}
          </span>
        )}
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-slate-700">
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
        className="relative w-full aspect-square bg-slate-950/50 overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
            <Wifi className="w-12 h-12 text-slate-700" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Hover quick preview button overlay */}
        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-cyan-300 text-xs font-semibold backdrop-blur-md border border-cyan-500/30">
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
            className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription || 'Pocket WiFi & routeurs portables haut débit.'}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400">{t.priceLabel}</span>
            <span className="text-lg font-extrabold text-cyan-400 tracking-tight">
              {formatAriary(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="w-full py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.viewDetails}</span>
            </button>

            <button
              type="button"
              onClick={() => onOrder(product)}
              disabled={!inStock}
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md focus:outline-none cursor-pointer ${
                inStock
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/30 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>{t.buyWhatsApp}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
