import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  EyeOff,
  ShoppingBag,
  Plus,
  Settings,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  Wifi,
} from 'lucide-react';
import { Product, Order, SiteSettings } from '../types';
import { formatAriary, formatDateMg } from '../utils/formatters';
import { seedInitialDatabase } from '../services/seedData';
import { deleteProduct, publishAllDrafts } from '../services/productService';
import { useToast } from '../components/Toast';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  onNavigate: (tab: 'products' | 'orders' | 'settings') => void;
  onOpenProductForm: (product?: Product) => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  settings,
  onNavigate,
  onOpenProductForm,
  onRefreshData,
}) => {
  const { showToast } = useToast();
  const [seeding, setSeeding] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive !== false).length;
  const hiddenProducts = products.filter((p) => p.isActive === false).length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Nomanina halefa amin\'ny WhatsApp').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Voamarina avy amin\'ny orinasa').length;
  const completedOrders = orders.filter((o) => o.status === 'Efa vita').length;

  const handlePublishAll = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPublishingAll(true);
    try {
      const count = await publishAllDrafts();
      showToast(`Vokatra ${count} navoaka ho Actif soa aman-tsara!`, 'success');
      onRefreshData();
    } catch (err: any) {
      showToast('Nisy olana: ' + err.message, 'error');
    } finally {
      setIsPublishingAll(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const count = await seedInitialDatabase();
      showToast(`Vokatra ${count} sy fikirakirana fototra tafiditra soa aman-tsara ao amin'ny Firestore!`, 'success');
      onRefreshData();
    } catch (err: any) {
      showToast('Nisy olana: ' + err.message, 'error');
    } finally {
      setSeeding(false);
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dashboard Administrateur
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
              Tableau de bord
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fitantanana ankapobeny ny {settings.companyName}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshData}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Havaozy ny angona / Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenProductForm()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Manampy Vokatra / Ajouter</span>
          </button>
        </div>
      </div>

      {/* Empty Database Prompt / Seed helper */}
      {totalProducts === 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Fanombohana Haingana / Initialisation
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Ampidiro ireo vokatra Pocket WiFi fototra
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Ampidiro amin'ny tsindry iray ireo vokatra Pocket WiFi maoderina (Huawei, ZTE, TP-Link, Netgear, kojakoja) miaraka amin'ny sariny Base64 sy ny vidiny amin'ny Ariary.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 shrink-0 flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{seeding ? 'Eo am-pampidirana...' : 'Ampidiro ny Vokatra Fototra'}</span>
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div
          onClick={() => onNavigate('products')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Vokatra Rehetra</span>
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalProducts}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-semibold">
            <span>Fitantanana vokatra</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigate('products')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Navoaka (Actif)</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">{activeProducts}</p>
          <p className="text-[11px] text-slate-500">Miseho amin'ny mpanjifa</p>
        </div>

        {/* Hidden Products */}
        <div
          onClick={() => onNavigate('products')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Nafenina (Brouillon)</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/20">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{hiddenProducts}</p>
            {hiddenProducts > 0 && (
              <button
                type="button"
                onClick={handlePublishAll}
                disabled={isPublishingAll}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{isPublishingAll ? 'Eo am-pamoahana...' : 'Avoaka ho Actif'}</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {hiddenProducts > 0 ? `${hiddenProducts} vokatra tsy mbola hitan'ny mpanjifa` : 'Tsy misy vokatra miafina'}
          </p>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Commandes Voatahiry</span>
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalOrders}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
            <span>{pendingOrders} miandry / WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Quick Access & Configuration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WhatsApp configuration summary */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp an'ny Orinasa</span>
            </h3>
            <button
              onClick={() => onNavigate('settings')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Hanova / Modifier
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-xs text-slate-400">Laharana ampiasaina:</span>
            <p className="text-lg font-black text-emerald-400 tracking-wider">
              {settings.whatsappNumber || 'Mbola tsy voapetraka!'}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Amin'ity laharana ity no mandeha mivantana ireo commande avy amin'ny bokotra "Hividy amin'ny WhatsApp".
            </p>
          </div>
        </div>

        {/* Orders summary */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span>Satan'ireo Commandes</span>
            </h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Hijery rehetra / Voir tout
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">WhatsApp</span>
              <strong className="text-xl font-bold text-cyan-400">{pendingOrders}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Voamarina</span>
              <strong className="text-xl font-bold text-blue-400">{confirmedOrders}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Efa vita</span>
              <strong className="text-xl font-bold text-emerald-400">{completedOrders}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Fitambarany</span>
              <strong className="text-xl font-bold text-white">{totalOrders}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products Table with Both Hanova & Hamafa */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Vokatra Vao Nampidirina / Produits Récents</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Azonao ovaina (modifier) na fafana (supprimer) avy hatrany eto
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Hijery ny vokatra rehetra</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Sary & Anarana / Produit</th>
                  <th className="py-3 px-4">Sokajy / Catégorie</th>
                  <th className="py-3 px-4">Vidiny / Prix</th>
                  <th className="py-3 px-4">Tahiry / Stock</th>
                  <th className="py-3 px-4">Sata / Statut</th>
                  <th className="py-3 px-4 text-right">Asa / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.slice(0, 6).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.dataUrl ? (
                          <img
                            src={p.images[0].dataUrl}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-950 p-1 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-slate-700" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-slate-500">{formatDateMg(p.createdAt)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-cyan-400">{formatAriary(p.price)}</td>
                    <td className="py-3 px-4 text-slate-300">{p.stockQuantity} isa</td>
                    <td className="py-3 px-4">
                      {p.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          Navoaka (Actif)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-400 border border-amber-500/30">
                          Nafenina (Masqué)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Modifier */}
                        <button
                          onClick={() => onOpenProductForm(p)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-semibold text-xs flex items-center gap-1 transition-colors"
                          title="Hanova ity vokatra ity / Modifier"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Hanova / Modifier</span>
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center gap-1 transition-colors"
                          title="Hamafa ity vokatra ity / Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hamafa / Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">Tsy misy vokatra voatahiry.</p>
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
              {productToDelete.images?.[0]?.dataUrl && (
                <img
                  src={productToDelete.images[0].dataUrl}
                  alt=""
                  className="w-12 h-12 object-contain rounded-xl bg-slate-900 p-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{productToDelete.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold">{formatAriary(productToDelete.price)}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tena te-hamafa ity vokatra ity ve ianao? Ho voafafa tanteraka ao amin'ny Cloud Firestore sy ny tranonkala izy.
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
