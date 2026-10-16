import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wifi, MessageSquare, Menu, X, Sun, Moon } from 'lucide-react';
import { SiteSettings } from '../types';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from './ThemeContext';

interface NavbarProps {
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<any>(null);

  const handleLogoIconClick = () => {
    clickCountRef.current += 1;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      navigate('/admin');
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };

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
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all ${
      theme === 'light'
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
        : 'bg-slate-950/85 border-slate-800/80 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div
              onClick={handleLogoIconClick}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-0.5 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all duration-300 cursor-pointer"
              title="BOX WIFI"
            >
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-slate-950'}`}>
                <Wifi className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-lg sm:text-xl tracking-tight transition-colors ${theme === 'light' ? 'text-slate-950 group-hover:text-red-600' : 'text-white group-hover:text-red-300'}`}>
                  BOX WIFI
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/20 text-red-600 border border-red-500/30">
                  POCKET
                </span>
              </div>
              <p className={`text-[11px] font-medium tracking-wider hidden sm:block ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
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
                    ? 'text-red-600 bg-red-50 border border-red-200 font-bold'
                    : theme === 'light'
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions: Theme Switcher, Language Switcher & WhatsApp CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Mode Jour / Mode Nuit Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                theme === 'light'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800'
              }`}
              title={theme === 'light' ? 'Hivadika Mode Nuit' : 'Hivadika Mode Jour'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Mode Jour</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>Mode Nuit</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className={`flex items-center p-1 rounded-xl border ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <button
                type="button"
                onClick={() => setLang('mg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'mg'
                    ? 'bg-red-600 text-white shadow-sm'
                    : theme === 'light' ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
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
                    ? 'bg-red-600 text-white shadow-sm'
                    : theme === 'light' ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{t.navWhatsApp}</span>
              </a>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${theme === 'light' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-900 text-amber-400 border-slate-800'}`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-3 shadow-xl ${theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'text-red-600 bg-red-50 border border-red-200'
                  : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-500">Teny / Langue:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang('mg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${lang === 'mg' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}
                >
                  MG
                </button>
                <button
                  type="button"
                  onClick={() => setLang('fr')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${lang === 'fr' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}
                >
                  FR
                </button>
              </div>
            </div>

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
