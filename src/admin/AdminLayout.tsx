import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  LogOut,
  Wifi,
  ExternalLink,
  BookOpen,
  User,
  KeyRound,
} from 'lucide-react';
import { logoutUser } from '../services/authService';
import { clearPinSession } from '../services/pinService';
import { AdminUser, SiteSettings } from '../types';
import { AdminGuideModal } from './AdminGuideModal';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminLayoutProps {
  user: AdminUser;
  settings: SiteSettings;
  activeTab: 'dashboard' | 'products' | 'orders' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'products' | 'orders' | 'settings') => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  settings,
  activeTab,
  setActiveTab,
  children,
}) => {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [guideOpen, setGuideOpen] = useState(false);

  const handleLogout = async () => {
    clearPinSession();
    await logoutUser();
    navigate('/');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: lang === 'mg' ? 'Dashboard' : 'Tableau de bord',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      label: lang === 'mg' ? 'Fitantanana Vokatra' : 'Gestion Produits',
      icon: Package,
    },
    {
      id: 'orders',
      label: lang === 'mg' ? 'Commandes Mpanjifa' : 'Commandes Clients',
      icon: ShoppingBag,
    },
    {
      id: 'settings',
      label: lang === 'mg' ? 'Fikirakirana & Fiarovana' : 'Paramètres & Sécurité',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">BOX WIFI</span>
                <span className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">
                  ESPACE ADMIN
                </span>
              </div>
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setLang('mg')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  lang === 'mg' ? 'bg-red-600 text-white' : 'text-slate-300'
                }`}
              >
                MG
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  lang === 'fr' ? 'bg-red-600 text-white' : 'text-slate-300'
                }`}
              >
                FR
              </button>
            </div>
          </div>

          {/* User badge */}
          <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center text-red-400">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user.email || 'boutiquemevasoa@gmail.com'}
              </p>
              <span className="inline-block text-[10px] text-emerald-400 font-semibold">
                ● {lang === 'mg' ? 'Admin voaaro' : 'Admin sécurisé'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Guide button */}
          <button
            onClick={() => setGuideOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-cyan-300 transition-colors border border-cyan-500/20 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'mg' ? "Torolalana ho an'ny Mpitarika" : 'Guide du Propriétaire'}</span>
          </button>

          {/* View live site */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'mg' ? 'Hijery ny Tranonkala' : 'Voir le Site Public'}</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'mg' ? 'Hivoaka (Déconnexion)' : 'Déconnexion'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Owner Guide Modal */}
      <AdminGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};
