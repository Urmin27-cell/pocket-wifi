import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Phone, Mail, MapPin, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { SiteSettings } from '../types';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const { t, lang, setLang } = useLanguage();
  const cleanedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
  const waUrl = cleanedWhatsApp ? `https://wa.me/${cleanedWhatsApp}` : null;

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {settings.companyName}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {settings.tagline ||
                (lang === 'mg'
                  ? 'Vahaolana Pocket WiFi sy Router Portable maoderina ho an\'ny aterineto haingana na aiza na aiza eto Madagasikara.'
                  : 'Solutions Pocket WiFi et routeurs portables modernes pour un internet rapide partout à Madagascar.')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t.footerGuarantee}</span>
            </div>
          </div>

          {/* Quick links (NO ADMIN LINK) */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              {t.footerQuickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/vokatra" className="hover:text-cyan-400 transition-colors">
                  {t.navProducts}
                </Link>
              </li>
              <li>
                <Link to="/momba-anay" className="hover:text-cyan-400 transition-colors">
                  {t.navAbout}
                </Link>
              </li>
              <li>
                <Link to="/fifandraisana" className="hover:text-cyan-400 transition-colors">
                  {t.navContact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              {t.footerCategories}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="text-slate-300">{t.cat4g}</span>
              </li>
              <li>
                <span className="text-slate-300">{t.cat5g}</span>
              </li>
              <li>
                <span className="text-slate-300">{t.catRouter}</span>
              </li>
              <li>
                <span className="text-slate-300">{t.catAccessories}</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-4">
              {t.footerContact}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {waUrl && (
                <li>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>WhatsApp: {settings.whatsappNumber}</span>
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{settings.email}</span>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footerText || `© 2026 ${settings.companyName}.`}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-500">
              <Zap className="w-3.5 h-3.5" /> {t.footerTagline}
            </span>
            <span>Madagascar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
