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
  Package,
} from 'lucide-react';
import { Product } from '../types';
import { formatAriary, formatDateMg } from '../utils/formatters';
import { deleteProduct, saveProduct, publishAllDrafts } from '../services/productService';
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
  const [statusFilter, setStatusFilter] = useState<'Rehetra' | 'Navoaka' | 'Brouillon'>('Rehetra');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  const draftCount = useMemo(() => {
    return products.filter((p) => p.isActive === false).length;
  }, [products]);

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
      const isAct = p.isActive !== false;
      const matchStatus =
        statusFilter === 'Rehetra' ||
        (statusFilter === 'Navoaka' && isAct) ||
        (statusFilter === 'Brouillon' && !isAct);
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleToggleActive = async (product: Product) => {
    const nextActive = product.isActive === false; // If currently false, switch to true. If true/undefined, switch to false.
    try {
      await saveProduct({ ...product, isActive: nextActive }, product.id);
      showToast(
        nextActive
          ? `Navoaka ho an'ny besinimaro (Actif) ny vokatra "${product.name}".`
          : `Nafenina ho brouillon ny vokatra "${product.name}".`,
        'success'
      );
      onRefreshData();
    } catch (err: any) {
      showToast('Tsy nahomby: ' + err.message, 'error');
    }
  };

  const handlePublishAllDrafts = async () => {
    setIsPublishingAll(true);
    try {
      const count = await publishAllDrafts();
      showToast(`Vokatra ${count} navoaka ho Actif soa aman-tsara! Hitan'ny mpanjifa avy hatrany izy ireo.`, 'success');
      onRefreshData();
    } catch (err: any) {
      showToast('Nisy olana: ' + err.message, 'error');
    } finally {
      setIsPublishingAll(false);
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

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      showToast(`Voafafa soa aman-tsara ny vokatra "${productToDelete.name}".`, 'success');
      setProductToDelete(null);
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Fitantanana Vokatra
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
              Gestion des Produits
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Azonao ovaina (modifier), fafana (supprimer), na ampidirina eto ireo Pocket WiFi sy Router
          </p>
        </div>

        <button
          onClick={() => onOpenProductForm()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Manampy Vokatra Vaovao / Ajouter</span>
        </button>
      </div>

      {/* Drafts Alert Banner if any drafts exist */}
      {draftCount > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {draftCount} ao amin'ny Brouillon
                </span>
                <h3 className="text-sm font-bold text-white">Misy vokatra mbola tsy navoaka ho an'ny mpanjifa</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Ireo vokatra ao amin'ny Brouillon dia tsy mbola hitan'ny mpanjifa. Tsindrio ny bokotra eto mba hamoahana azy rehetra ho <strong>Actif</strong> amin'ny tsindry iray.
              </p>
            </div>
          </div>

          <button
            onClick={handlePublishAllDrafts}
            disabled={isPublishingAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isPublishingAll ? 'Eo am-pamoahana...' : `Avoaka ho Actif daholo (${draftCount})`}</span>
          </button>
        </div>
      )}

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
            placeholder="Mitady amin'ny anarana na famaritana / Rechercher..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Filter by Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-52 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'Rehetra' ? 'Sokajy rehetra / Toutes catégories' : c}
            </option>
          ))}
        </select>

        {/* Filter by Status (Navoaka vs Brouillon) */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full sm:w-52 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          <option value="Rehetra">Sata rehetra / Tous les statuts</option>
          <option value="Navoaka">Navoaka ihany (Actifs)</option>
          <option value="Brouillon">Brouillon ihany (Nafenina)</option>
        </select>
      </div>

      {/* Desktop & Tablet Products Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {filteredProducts.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] bg-slate-950/40">
                  <tr>
                    <th className="py-3.5 px-4">Sary & Vokatra / Produit</th>
                    <th className="py-3.5 px-4">Sokajy / Catégorie</th>
                    <th className="py-3.5 px-4">Vidiny / Prix</th>
                    <th className="py-3.5 px-4">Tahiry / Stock</th>
                    <th className="py-3.5 px-4">Sata / Statut</th>
                    <th className="py-3.5 px-4 text-right">Asa / Actions</th>
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

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleActive(p)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              p.isActive !== false
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                                : 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900/60'
                            }`}
                            title={p.isActive !== false ? "Tsindrio raha havadika ho Brouillon" : "Tsindrio raha havoaka ho Actif"}
                          >
                            {p.isActive !== false ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Navoaka (Actif)</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                                <span>Brouillon (Nafenina)</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Star Toggle */}
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                p.isFeatured
                                  ? 'bg-amber-950/50 border-amber-500/40 text-amber-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                              }`}
                              title={p.isFeatured ? 'Esory amin\'ny malaza' : 'Asongadino ho malaza'}
                            >
                              <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                            </button>

                            {/* Prominent Edit Button */}
                            <button
                              onClick={() => onOpenProductForm(p)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                              title="Modifier ce produit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Hanova / Modifier</span>
                            </button>

                            {/* Prominent Delete Button */}
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/70 text-rose-300 hover:text-rose-200 border border-rose-500/40 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                              title="Supprimer ce produit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hamafa / Supprimer</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-800/80">
              {filteredProducts.map((p) => {
                const img = p.images?.[0];
                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {img?.dataUrl ? (
                          <img src={img.dataUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Wifi className="w-6 h-6 text-slate-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                          {p.isFeatured && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{p.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-cyan-400 text-sm">
                            {formatAriary(p.price)}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              p.stockQuantity > 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            Stock: {p.stockQuantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Featured row on mobile */}
                    <div className="flex items-center justify-between pt-1 pb-1 border-t border-b border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Sata:</span>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            p.isActive !== false
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
                              : 'bg-amber-950/90 text-amber-300 border-amber-500/50 hover:bg-amber-900/60'
                          }`}
                        >
                          {p.isActive !== false ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Navoaka (Actif)</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                              <span>Brouillon (Nafenina)</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        className={`px-2 py-1 rounded-lg border flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                          p.isFeatured
                            ? 'bg-amber-950/50 border-amber-500/40 text-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                        title={p.isFeatured ? 'Esory amin\'ny malaza' : 'Asongadino ho malaza'}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                        <span>{p.isFeatured ? 'Malaza' : 'Tsotra'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onOpenProductForm(p)}
                        className="py-2 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Hanova / Modifier</span>
                      </button>

                      <button
                        onClick={() => setProductToDelete(p)}
                        className="py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hamafa / Supprimer</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs space-y-3">
            <Package className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              Tsy misy vokatra mifanaraka amin'ny sivana / Aucun produit trouvé
            </p>
            <p className="text-slate-500">
              Tsindrio ny bokotra "Manampy Vokatra Vaovao" hanampiana vokatra vaovao.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Fanamafisana famafana</h3>
                <span className="text-[11px] text-slate-400">Confirmation de suppression</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              {productToDelete.images?.[0]?.dataUrl ? (
                <img
                  src={productToDelete.images[0].dataUrl}
                  alt=""
                  className="w-12 h-12 object-contain rounded-xl bg-slate-900 p-1"
                />
              ) : (
                <Wifi className="w-8 h-8 text-slate-600" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{productToDelete.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold">{formatAriary(productToDelete.price)}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tena te-hamafa ity vokatra ity ve ianao? Ho voafafa tanteraka ao amin'ny Cloud Firestore sy ny tranonkala izy.
              <br />
              <span className="text-slate-400 text-xs italic">
                (Ce produit sera définitivement supprimé de la base de données et de la boutique.)
              </span>
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Aoka ihany / Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Eo am-pamafana...' : 'Eny, fafao / Oui, supprimer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
