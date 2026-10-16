import React from 'react';
import { Wifi, Zap, BatteryCharging, Users, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { SiteSettings } from '../types';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroSectionProps {
  settings: SiteSettings;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onExploreClick }) => {
  const { t, lang } = useLanguage();
  const cleanedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
  const waUrl = cleanedWhatsApp
    ? `https://wa.me/${cleanedWhatsApp}?text=${encodeURIComponent(
        lang === 'mg'
          ? `Manao ahoana tompoko, te-hividy Pocket WiFi ao amin'ny ${settings.companyName} aho azafady.`
          : `Bonjour, je souhaite acheter un Pocket WiFi auprès de ${settings.companyName} s'il vous plaît.`
      )}`
    : null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-md">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              {settings.heroTitle || t.heroDefaultTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {settings.heroSubtitle || t.heroDefaultSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.heroCtaExplore}</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2.5 shadow-md"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                  <span>{t.heroCtaContact}</span>
                </a>
              )}
            </div>

            {/* Key Advantages Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Wifi className="w-5 h-5 text-cyan-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">{t.spec4g5g}</h4>
                <p className="text-[11px] text-slate-400">{t.spec4g5gDesc}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <BatteryCharging className="w-5 h-5 text-emerald-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">{t.specBattery}</h4>
                <p className="text-[11px] text-slate-400">{t.specBatteryDesc}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Users className="w-5 h-5 text-indigo-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">{t.specConnected}</h4>
                <p className="text-[11px] text-slate-400">{t.specConnectedDesc}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-amber-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">{t.specUnlocked}</h4>
                <p className="text-[11px] text-slate-400">{t.specUnlockedDesc}</p>
              </div>
            </div>
          </div>

          {/* Right Visual / Product Presentation */}
          <div className="lg:col-span-5 flex items-center justify-center">
            {settings.heroImage ? (
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl max-w-md w-full aspect-square bg-slate-950 p-4">
                <img
                  src={settings.heroImage}
                  alt={settings.companyName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-slate-900 to-slate-950 rounded-3xl border border-cyan-500/20 p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-cyan-950/40">
                <div className="relative">
                  <div className="w-44 h-44 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-xl flex flex-col items-center justify-center p-4">
                    <div className="w-28 h-14 rounded-lg bg-slate-900 border border-cyan-400/30 flex items-center justify-center gap-2 mb-3">
                      <Wifi className="w-6 h-6 text-cyan-400 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-white">150 Mbps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] font-semibold text-emerald-400">4G LTE CONNECTED</span>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-4 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-blue-400/40">
                    PORTABLE
                  </div>
                  <div className="absolute -bottom-3 -left-4 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-emerald-400/40">
                    DÉBLOQUÉ
                  </div>
                </div>

                <div className="mt-8 space-y-1">
                  <h3 className="text-lg font-extrabold text-white">Pocket WiFi & Routeurs</h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'mg'
                      ? "Mandeha amin'ny tambajotra rehetra eto Madagasikara"
                      : 'Compatible tous opérateurs à Madagascar'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
