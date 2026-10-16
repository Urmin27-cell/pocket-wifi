import React, { useState, useEffect } from 'react';
import { X, MessageSquare, AlertCircle, User, MapPin, Phone, FileText, ArrowRight } from 'lucide-react';
import { Product, SiteSettings } from '../types';
import { formatAriary } from '../utils/formatters';
import { buildWhatsAppOrderUrl, isValidPhoneNumber, OrderFormData } from '../services/whatsappService';
import { createOrder } from '../services/orderService';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from './Toast';

interface OrderModalProps {
  product: Product | null;
  initialQuantity?: number;
  settings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  initialQuantity = 1,
  settings,
  isOpen,
  onClose,
}) => {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState(initialQuantity);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setQuantity(initialQuantity > 0 ? initialQuantity : 1);
      setErrors({});
    }
  }, [product, initialQuantity]);

  if (!isOpen || !product) return null;

  const unitPrice = product.price;
  const estimatedTotal = unitPrice * quantity;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = lang === 'fr' ? 'Veuillez renseigner votre nom.' : 'Ampidiro azafady ny anaranao.';
    }

    if (!quantity || quantity <= 0) {
      errs.quantity =
        lang === 'fr'
          ? 'La quantité doit être supérieure à 0.'
          : 'Tokony ho isa mihoatra ny 0 ny isan\'ny vokatra.';
    } else if (product.stockQuantity && quantity > product.stockQuantity) {
      errs.quantity =
        lang === 'fr'
          ? `Désolé, il ne reste que ${product.stockQuantity} pièces en stock.`
          : `Miala tsiny, ${product.stockQuantity} ihany ny tahiry misy amin'izao.`;
    }

    if (!deliveryLocation.trim()) {
      errs.deliveryLocation =
        lang === 'fr'
          ? 'Veuillez préciser le lieu ou quartier de livraison.'
          : 'Soraty azafady ny toerana andefasana ny entana.';
    }

    if (!contactPhone.trim()) {
      errs.contactPhone =
        lang === 'fr'
          ? 'Veuillez renseigner votre numéro de téléphone.'
          : 'Ampidiro ny laharana finday ahafahana miantso anao.';
    } else if (!isValidPhoneNumber(contactPhone)) {
      errs.contactPhone =
        lang === 'fr'
          ? 'Numéro de téléphone invalide (au moins 8 chiffres).'
          : 'Laharana finday tsy manan-kery (farafahakeliny 8 isa).';
    }

    if (!settings.whatsappNumber || settings.whatsappNumber.trim().length < 8) {
      errs.whatsapp = t.whatsappMissing;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const orderData: OrderFormData = {
      productName: product.name,
      productId: product.id,
      unitPrice,
      quantity,
      customerName,
      deliveryLocation,
      contactPhone,
      notes,
      lang,
    };

    const { url, error } = buildWhatsAppOrderUrl(settings.whatsappNumber, orderData);

    if (error || !url) {
      showToast(error || (lang === 'fr' ? 'Erreur lors de la génération du lien.' : 'Tsy afaka novolavolaina ny rohy.'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        productName: product.name,
        productId: product.id,
        unitPrice,
        quantity,
        totalPrice: estimatedTotal,
        customerName: customerName.trim(),
        deliveryLocation: deliveryLocation.trim(),
        contactPhone: contactPhone.trim(),
        notes: notes.trim(),
        status: 'Nomanina halefa amin\'ny WhatsApp',
      });
    } catch (saveError) {
      console.warn('Fanamarihana:', saveError);
    }

    setIsSubmitting(false);
    showToast(lang === 'fr' ? 'Ouverture de WhatsApp...' : 'Misokatra ny WhatsApp...', 'success');

    window.location.href = url;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.orderModalTitle}
              </h2>
              <p className="text-xs text-slate-400">{t.orderModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errors.whatsapp && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errors.whatsapp}</span>
            </div>
          )}

          {/* Selected Product Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {product.images?.[0]?.dataUrl && (
                <img
                  src={product.images[0].dataUrl}
                  alt=""
                  className="w-12 h-12 object-contain rounded-lg bg-slate-900 p-1 shrink-0"
                />
              )}
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  {t.selectedProduct}
                </span>
                <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                <span className="text-xs text-slate-400">
                  {t.priceLabel}: <strong className="text-slate-200">{formatAriary(unitPrice)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Field 1: Customer Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.fieldName} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.fieldNamePlaceholder}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  errors.customerName ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-rose-400 pl-1">{errors.customerName}</p>
            )}
          </div>

          {/* Field 2: Quantity */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.fieldQuantity} <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={product.stockQuantity || 99}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className={`w-32 px-3 py-2.5 rounded-xl bg-slate-950 border text-sm text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  errors.quantity ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              <span className="text-xs text-slate-400">
                ({t.inStock}: <strong className="text-emerald-400">{product.stockQuantity}</strong>)
              </span>
            </div>
            {errors.quantity && <p className="text-xs text-rose-400 pl-1">{errors.quantity}</p>}
          </div>

          {/* Field 3: Delivery Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.fieldLocation} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder={t.fieldLocationPlaceholder}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  errors.deliveryLocation ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.deliveryLocation && (
              <p className="text-xs text-rose-400 pl-1">{errors.deliveryLocation}</p>
            )}
          </div>

          {/* Field 4: Contact Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.fieldPhone} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder={t.fieldPhonePlaceholder}
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  errors.contactPhone ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.contactPhone && (
              <p className="text-xs text-rose-400 pl-1">{errors.contactPhone}</p>
            )}
          </div>

          {/* Field 5: Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.fieldNotes} <span className="text-slate-500 text-[11px]">{t.optionalLabel}</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.fieldNotesPlaceholder}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Price Calculation Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t.priceLabel}:</span>
              <span>{formatAriary(unitPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t.fieldQuantity}:</span>
              <span>× {quantity}</span>
            </div>
            <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.estimatedTotal}
              </span>
              <span className="text-lg font-black text-cyan-400">
                {formatAriary(estimatedTotal)}
              </span>
            </div>
          </div>

          {/* Notice about verification */}
          <p className="text-[11px] text-slate-400 leading-relaxed italic bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            {t.orderNotice}
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            <span>{isSubmitting ? t.orderSubmitting : t.orderSubmitBtn}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
