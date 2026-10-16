import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  EyeOff,
  Star,
  AlertTriangle,
  Wifi,
  X,
} from 'lucide-react';
import { Product } from '../types';
import { formatAriary, formatDateMg } from '../utils/formatters';
import { deleteProduct, saveProduct } from '../services/productService';
import { formatBytes } from '../services/imageCompressionService';
import { useToast } from '../components/Toast';

interface AdminProductsProps {
  products: Product[];
  onOpenProductForm: (product?: Product) => void;
  onRefreshData: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onOpenProductForm,
  onRefreshData,
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Rehetra');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Rehetra', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'Rehetra' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleToggleActive = async (product: Product) => {
    try {
      await saveProduct({ ...product, isActive: !product.isActive }, product.id);
      showToast(
        product.isActive
          ? `Nafenina ny vokatra "${product.name}".`
          : `Navoaka ho an'ny besinimaro ny vokatra "${product.name}".`,
        'info'
      );
      onRefreshData();
    } catch (err: any) {
      showToast('Tsy nahomby: ' + err.message, 'error');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await saveProduct({ ...product, isFeatured: !product.isFeatured }, product.id);
      showToast(
        product.isFeatured
          ? `Nesorina tamin'ny lisitry ny vokatra malaza.`
          : `Nampidirina ho vokatra malaza!`,
        'success'
      );
      onRefreshData();
    } catch (err: any) {
      showToast('Tsy nahomby: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      showToast('Voafafa soa aman-tsara ilay vokatra.', 'success');
      setDeleteConfirmId(null);
      onRefreshData();
    } catch (err: any) {
      showToast('Tsy afaka nofafana: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Fitantanana Vokatra
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fampidirana, fanovana, sary Base64 ary famafana vokatra ao amin'ny Firestore
          </p>
        </div>

        <button
          onClick={() => onOpenProductForm()}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Manampy Vokatra Vaovao</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mitady amin'ny anarana na famaritana..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] bg-slate-950/40">
                <tr>
                  <th className="py-3.5 px-4">Sary & Vokatra</th>
                  <th className="py-3.5 px-4">Sokajy</th>
                  <th className="py-3.5 px-4">Vidiny</th>
                  <th className="py-3.5 px-4">Tahiry</th>
                  <th className="py-3.5 px-4">Haben'ny Sary</th>
                  <th className="py-3.5 px-4">Sata</th>
                  <th className="py-3.5 px-4 text-right">Asa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const img = p.images?.[0];
                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            {img?.dataUrl ? (
                              <img src={img.dataUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Wifi className="w-5 h-5 text-slate-700" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-sm">{p.name}</span>
                              {p.isFeatured && (
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {p.shortDescription}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium">{p.category}</td>

                      <td className="py-3.5 px-4 font-bold text-cyan-400 text-sm">
                        {formatAriary(p.price)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold ${
                            p.stockQuantity > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {p.stockQuantity} isa
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-400">
                        {img?.sizeBytes ? formatBytes(img.sizeBytes) : '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            p.isActive
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/50'
                              : 'bg-amber-950/80 text-amber-400 border-amber-500/30 hover:bg-amber-900/50'
                          }`}
                        >
                          {p.isActive ? 'Navoaka' : 'Nafenina'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              p.isFeatured
                                ? 'bg-amber-950/50 border-amber-500/40 text-amber-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                            title="Asongadina ho malaza"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenProductForm(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="Hanova"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 transition-colors"
                            title="Hamafa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Wifi className="w-10 h-10 text-slate-700 mx-auto" />
            <p>Tsy misy vokatra mifanaraka amin'ny sivana.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Fanamafisana famafana</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tena te-hamafa ity vokatra ity ve ianao? Ho voafafa tanteraka ao amin'ny Cloud Firestore ny mombamomba azy sy ny sariny Base64.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Aoka ihany
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Eo am-pamafana...' : 'Eny, fafao'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
