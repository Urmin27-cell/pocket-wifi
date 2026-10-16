import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, CheckCircle2, AlertTriangle, ShieldCheck, Truck, Wifi, Plus, Minus, Edit2 } from 'lucide-react';
import { Product } from '../types';
import { formatAriary } from '../utils/formatters';
import { useLanguage } from '../i18n/LanguageContext';
import { isPinSessionValid } from '../services/pinService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOrder: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onOrder }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = isPinSessionValid();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inStock = product.stockQuantity > 0;
  const images = product.images || [];
  const currentImage = images[selectedImageIndex]?.dataUrl || images[0]?.dataUrl;

  const handleIncrease = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {product.category}
            </span>
            {product.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500 text-slate-950">
                {t.featuredBadge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="w-full aspect-square bg-slate-950 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                    <Wifi className="w-16 h-16 text-slate-700" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 p-1 bg-slate-950 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'border-slate-800 hover:border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={img.dataUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
                    {formatAriary(product.price)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{t.perUnit}</span>
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2">
                  {inStock ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.inStock} ({product.stockQuantity})</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t.outOfStock}</span>
                    </div>
                  )}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pt-2">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t.qualityGuarantee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t.fastDelivery}</span>
                </div>
              </div>

              {/* Quantity selector & WhatsApp Order button */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">{t.quantityLabel}</span>
                  <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1 || !inStock}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-white text-sm px-2">{quantity}</span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={quantity >= product.stockQuantity || !inStock}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between text-xs text-slate-400">
                  <span>{t.estimatedTotal}</span>
                  <span className="text-base font-bold text-cyan-300">
                    {formatAriary(product.price * quantity)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOrder(product, quantity)}
                  disabled={!inStock}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    inStock
                      ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  <span>{t.sendOrderBtn}</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/admin');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Hanova ity vokatra ity ao amin'ny Admin / Modifier dans l'admin</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
