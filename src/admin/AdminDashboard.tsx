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
} from 'lucide-react';
import { Product, Order, SiteSettings } from '../types';
import { formatAriary, formatDateMg } from '../utils/formatters';
import { seedInitialDatabase } from '../services/seedData';
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

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const hiddenProducts = totalProducts - activeProducts;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Nomanina halefa amin\'ny WhatsApp').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Voamarina avy amin\'ny orinasa').length;
  const completedOrders = orders.filter((o) => o.status === 'Efa vita').length;

  const handleSeed = async () => {
    if (!window.confirm("Ampidiro ireo vokatra Pocket WiFi sy ny fandrindrana fototra ho an'ny BOX WIFI?")) {
      return;
    }
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

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Administrateur
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fitantanana ankapobeny ny {settings.companyName}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshData}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Havaozy ny angona"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenProductForm()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Manampy Vokatra Vaovao</span>
          </button>
        </div>
      </div>

      {/* Empty Database Prompt / Seed helper */}
      {totalProducts === 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Fanombohana Haingana
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Mbola tsy misy vokatra ao amin'ny database Firestore
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Azonao ampidirina amin'ny tsindry iray ireo vokatra Pocket WiFi maoderina (Huawei, ZTE, TP-Link, Netgear, kojakoja) miaraka amin'ny sariny Base64 sy ny vidiny amin'ny Ariary.
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
            <span>Hijery ny lisitra</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigate('products')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Navoaka (Aseho)</span>
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
          <p className="text-2xl sm:text-3xl font-black text-amber-400">{hiddenProducts}</p>
          <p className="text-[11px] text-slate-500">Tsy miseho amin'ny besinimaro</p>
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
              Hanova
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
              Hijery rehetra
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

      {/* Recent Products Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Vokatra Vao Nampidirina</span>
          </h3>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            Fitantanana Vokatra rehetra
          </button>
        </div>

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Sary & Anarana</th>
                  <th className="py-3 px-4">Sokajy</th>
                  <th className="py-3 px-4">Vidiny</th>
                  <th className="py-3 px-4">Tahiry</th>
                  <th className="py-3 px-4">Sata</th>
                  <th className="py-3 px-4 text-right">Asa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.dataUrl && (
                          <img
                            src={p.images[0].dataUrl}
                            alt=""
                            className="w-9 h-9 object-contain rounded-lg bg-slate-950 p-1"
                          />
                        )}
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-slate-500">{formatDateMg(p.createdAt)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-cyan-400">{formatAriary(p.price)}</td>
                    <td className="py-3 px-4 text-slate-300">{p.stockQuantity}</td>
                    <td className="py-3 px-4">
                      {p.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          Navoaka
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-400 border border-amber-500/30">
                          Nafenina
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenProductForm(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                      >
                        Hanova
                      </button>
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
    </div>
  );
};
