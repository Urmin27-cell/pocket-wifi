import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wifi, MessageSquare, Menu, X, Globe } from 'lucide-react';
import { SiteSettings } from '../types';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const cleanedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
  const generalWhatsAppUrl = cleanedWhatsApp
    ? `https://wa.me/${cleanedWhatsApp}?text=${encodeURIComponent(
        lang === 'mg'
          ? `Manao ahoana tompoko, te-hahafantatra misimisy kokoa momba ny vokatra ${settings.companyName} aho azafady.`
          : `Bonjour, je souhaite avoir plus d'informations sur les équipements ${settings.companyName} s'il vous plaît.`
      )}`
    : null;

  const navLinks = [
    { name: t.navHome, path: '/' },
    { name: t.navProducts, path: '/vokatra' },
    { name: t.navAbout, path: '/momba-anay' },
    { name: t.navContact, path: '/fifandraisana' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-cyan-600 to-sky-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Wifi className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  BOX WIFI
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  POCKET
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wider hidden sm:block">
                {t.navTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions: Language Switcher & WhatsApp CTA (NO ADMIN LINK) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setLang('mg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'mg'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Teny Malagasy"
              >
                🇲🇬 MG
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'fr'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Français"
              >
                🇫🇷 FR
              </button>
            </div>

            {/* Direct WhatsApp Action */}
            {generalWhatsAppUrl && (
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{t.navWhatsApp}</span>
              </a>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Language Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setLang('mg')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                  lang === 'mg' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                MG
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                  lang === 'fr' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                FR
              </button>
            </div>

            {generalWhatsAppUrl && (
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (NO ADMIN LINK) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            {generalWhatsAppUrl && (
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{lang === 'mg' ? "Hifandray amin'ny WhatsApp" : 'Nous contacter sur WhatsApp'}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
