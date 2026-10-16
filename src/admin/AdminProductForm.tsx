import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Product, CompressedImage } from '../types';
import { formatAriary, createSlug } from '../utils/formatters';
import { compressImageFile, formatBytes, estimateDocumentSizeBytes, FIRESTORE_DOC_MAX_SAFE_BYTES } from '../services/imageCompressionService';
import { saveProduct } from '../services/productService';
import { useToast } from '../components/Toast';

interface AdminProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState<number>(product?.price || 150000);
  const [category, setCategory] = useState(product?.category || 'Pocket WiFi 4G LTE');
  const [stockQuantity, setStockQuantity] = useState<number>(product?.stockQuantity ?? 10);
  const [isActive, setIsActive] = useState<boolean>(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured ?? false);
  const [images, setImages] = useState<CompressedImage[]>(product?.images || []);

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionFeedback, setCompressionFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug when name changes if new product
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!product) {
      setSlug(createSlug(val));
    }
  };

  // Estimate total payload size
  const currentPayloadPreview = {
    name,
    slug,
    shortDescription,
    description,
    price,
    currency: 'MGA',
    images,
    category,
    stockQuantity,
    isActive,
    isFeatured,
  };
  const totalSizeBytes = estimateDocumentSizeBytes(currentPayloadPreview);
  const isDocumentTooLarge = totalSizeBytes > FIRESTORE_DOC_MAX_SAFE_BYTES;
  const sizePercentage = Math.min(100, Math.round((totalSizeBytes / FIRESTORE_DOC_MAX_SAFE_BYTES) * 100));

  // Handle image upload with Canvas Compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setCompressionFeedback(null);

    const newCompressedList: CompressedImage[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await compressImageFile(file);

      if (!result.success || !result.image) {
        showToast(result.error || `Tsy nahomby ny compression an'i ${file.name}`, 'error');
        continue;
      }

      newCompressedList.push(result.image);
      setCompressionFeedback(
        `Sary "${file.name}" voatsindry: ${formatBytes(result.originalSizeBytes)} ➔ ${formatBytes(
          result.compressedSizeBytes
        )} (-${result.savedPercentage}%)`
      );
    }

    setImages(newCompressedList);
    setIsCompressing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    setCompressionFeedback(null);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Tsy maintsy fenoina ny anaran\'ny vokatra.';
    if (price <= 0) errs.price = 'Tokony ho mihoatra ny 0 Ariary ny vidiny.';
    if (stockQuantity < 0) errs.stockQuantity = 'Tsy azo atao latsaky ny 0 ny tahiry.';
    if (images.length === 0) errs.images = 'Ampidiro farafahakeliny sary 1 ho an\'ny vokatra.';

    if (isDocumentTooLarge) {
      errs.size = `Lehibe loatra ny angona (${formatBytes(totalSizeBytes)}). Ny fetra azo antoka ho an'ny Firestore dia ${formatBytes(
        FIRESTORE_DOC_MAX_SAFE_BYTES
      )}. Mba esory na ahenao ny sary.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await saveProduct(
        {
          name: name.trim(),
          slug: slug.trim() || createSlug(name),
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          price: Number(price),
          currency: 'MGA',
          images,
          category,
          stockQuantity: Number(stockQuantity),
          isActive,
          isFeatured,
          createdAt: product?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        product?.id
      );

      showToast(
        product ? 'Voaova soa aman-tsara ny vokatra!' : 'Voatahiry soa aman-tsara ny vokatra vaovao!',
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Nisy olana nandritra ny fitahirizana: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:px-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {product ? 'Hanova ny Vokatra' : 'Manampy Vokatra Vaovao'}
            </h2>
            <p className="text-xs text-slate-400">
              Famenoana ny mombamomba ny Pocket WiFi na Router
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {errors.size && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errors.size}</span>
            </div>
          )}

          {/* Section: Images & Automatic Compression */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Sarin'ny Vokatra (Base64 & Auto-Compression)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Voatsindry ho azy (max 800×800px, &lt; 150 Ko) ary tehirizina mivantana ao amin'ny Firestore tsy misy Storage.
                </p>
              </div>

              {/* Document Size Gauge */}
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">
                  Haben'ny Document: <strong className={isDocumentTooLarge ? 'text-rose-400' : 'text-cyan-400'}>{formatBytes(totalSizeBytes)}</strong> / 700 Ko
                </span>
                <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden mt-1 inline-block">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDocumentTooLarge ? 'bg-rose-500' : sizePercentage > 75 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${sizePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Compression Feedback */}
            {compressionFeedback && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{compressionFeedback}</span>
              </div>
            )}

            {/* Images List Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl bg-slate-900 border border-slate-800 p-2 group overflow-hidden flex flex-col justify-between"
                >
                  <img src={img.dataUrl} alt="" className="w-full h-full object-contain rounded-xl" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[10px] text-white font-mono font-bold mb-2">
                      {formatBytes(img.sizeBytes)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors"
                      title="Esory ity sary ity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-cyan-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      Sary voalohany
                    </span>
                  )}
                </div>
              ))}

              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-300 transition-all p-3 text-center"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-semibold">
                  {isCompressing ? 'Eo am-panitsiana...' : 'Mampiditra Sary'}
                </span>
                <span className="text-[10px] text-slate-500">JPG, PNG, WebP</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.images && <p className="text-xs text-rose-400">{errors.images}</p>}
          </div>

          {/* Section: General info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">
                Anaran'ny Vokatra <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Ohatra: Huawei E5577 4G LTE Pocket WiFi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Sokajy
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="Pocket WiFi 4G LTE">Pocket WiFi 4G LTE</option>
                <option value="Pocket WiFi 5G Ultra">Pocket WiFi 5G Ultra</option>
                <option value="Router Portable & CPE">Router Portable & CPE</option>
                <option value="Batteries & Kojakoja">Batteries & Kojakoja</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Vidiny (amin'ny Ariary) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                  Ar (MGA)
                </span>
              </div>
              {errors.price && <p className="text-xs text-rose-400">{errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Isan'ny Tahiry (Stock)
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {errors.stockQuantity && <p className="text-xs text-rose-400">{errors.stockQuantity}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Slug (Rohy URL fohy)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="huawei-e5577-4g"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Short description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Famaritana fohy (miseho amin'ny karatra)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ohatra: Haingam-pandeha 150 Mbps, batterie 3000mAh maharitra 12h, puce rehetra."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Full description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Famaritana feno sy antsipiriany ara-teknika
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Soraty eto ny antsipiriany rehetra: tambajotra, batterie, isan'ny fitaovana afaka mifandray..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-sans"
            />
          </div>

          {/* Status Switches */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-white block">Asehoy amin'ny Tranonkala (Navoaka)</span>
                <span className="text-[11px] text-slate-400">Raha vonoina dia lasa brouillon tsy hitan'ny mpanjifa.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-white block">Asongadino (Malaza)</span>
                <span className="text-[11px] text-slate-400">Miseho eo amin'ny pejy fandraisana.</span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Aoka ihany
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressing || isDocumentTooLarge}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Eo am-pitahirizana...' : product ? 'Mitahiry ny fanovana' : 'Mampiditra ny vokatra'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
