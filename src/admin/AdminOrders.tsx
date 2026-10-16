import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  User,
  Filter,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatAriary, formatDateMg } from '../utils/formatters';
import { updateOrderStatus } from '../services/orderService';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useToast } from '../components/Toast';

interface AdminOrdersProps {
  orders: Order[];
  onRefreshData: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefreshData }) => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('Rehetra');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses: OrderStatus[] = [
    'Tsy mbola nalefa',
    'Nomanina halefa amin\'ny WhatsApp',
    'Voamarina avy amin\'ny orinasa',
    'Efa vita',
    'Nofoanana',
  ];

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'Rehetra') return true;
    return o.status === filterStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Voaova ho "${newStatus}" ny satan'ny commande.`, 'success');
      onRefreshData();
    } catch (err: any) {
      showToast('Tsy afaka novaova ny sata: ' + err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const openCustomerWhatsApp = (customerPhone: string, customerName: string, productName: string) => {
    const cleaned = normalizeWhatsAppNumber(customerPhone);
    if (!cleaned) {
      showToast('Laharana finday tsy manan-kery.', 'error');
      return;
    }
    const message = `Manao ahoana tompoko ${customerName}, avy amin'ny BOX WIFI izahay mikasika ilay commande ${productName} nalefanao.`;
    window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Fitantanana Commandes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ireo commande nalefan'ny mpanjifa avy amin'ny formulaire WhatsApp
          </p>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="Rehetra">Sata rehetra ({orders.length})</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s} ({orders.filter((o) => o.status === s).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/20">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {order.productName}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateMg(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Sata:</span>
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        order.status === 'Efa vita'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                          : order.status === 'Voamarina avy amin\'ny orinasa'
                          ? 'bg-blue-950 text-blue-400 border-blue-500/40'
                          : order.status === 'Nofoanana'
                          ? 'bg-rose-950 text-rose-400 border-rose-500/40'
                          : 'bg-amber-950 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-white font-medium">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Customer */}
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      Mpanjifa
                    </span>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{order.customerName}</span>
                    </p>
                  </div>

                  {/* Phone & Direct Contact */}
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      Laharana Finday
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${order.contactPhone.replace(/\s+/g, '')}`}
                        className="font-bold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.contactPhone}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          openCustomerWhatsApp(
                            order.contactPhone,
                            order.customerName,
                            order.productName
                          )
                        }
                        className="p-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900 transition-colors"
                        title="Hiresaka amin'ny WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      Toerana andefasana
                    </span>
                    <p className="text-slate-300 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{order.deliveryLocation}</span>
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      Totalin'ny Tombana
                    </span>
                    <p className="font-black text-cyan-300 text-sm">
                      {formatAriary(order.totalPrice || order.unitPrice * order.quantity)}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      ({order.quantity} isa × {formatAriary(order.unitPrice)})
                    </span>
                  </div>
                </div>

                {/* Notes if any */}
                {order.notes && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-400">Notes:</strong> {order.notes}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2 text-slate-400 text-xs">
          <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="font-bold text-white text-sm">Tsy misy commande voatahiry</p>
          <p>Rehefa misy mpanjifa manindry ny WhatsApp commande dia hiseho eto avy hatrany.</p>
        </div>
      )}
    </div>
  );
};
