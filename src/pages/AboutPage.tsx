import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { SiteSettings } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AboutPageProps {
  settings: SiteSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  const { t, lang } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
          {t.aboutBadge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {settings.companyName}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {lang === 'mg'
            ? "Mpaninjara fitaovana Pocket WiFi, router portable sy fitaovam-pifandraisana manome aterineto haingana sy azo antoka eto Madagasikara."
            : "Fournisseur d'équipements Pocket WiFi, routeurs portables et accessoires offrant un internet haut débit fiable partout à Madagascar."}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">{t.aboutMissionTitle}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t.aboutMissionDesc}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">{t.aboutQualityTitle}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t.aboutQualityDesc}
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">{t.howItWorksTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-400">{t.howItWorksSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-2xl font-black text-cyan-400">01</span>
            <h4 className="font-bold text-white text-sm">{t.step1Title}</h4>
            <p className="text-xs text-slate-400">{t.step1Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-2xl font-black text-cyan-400">02</span>
            <h4 className="font-bold text-white text-sm">{t.step2Title}</h4>
            <p className="text-xs text-slate-400">{t.step2Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-2xl font-black text-cyan-400">03</span>
            <h4 className="font-bold text-white text-sm">{t.step3Title}</h4>
            <p className="text-xs text-slate-400">{t.step3Desc}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-2xl font-black text-cyan-400">04</span>
            <h4 className="font-bold text-white text-sm">{t.step4Title}</h4>
            <p className="text-xs text-slate-400">{t.step4Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
