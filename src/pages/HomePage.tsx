import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Wifi, BatteryCharging, Zap, Globe, MessageSquare } from 'lucide-react';
import { Product, SiteSettings } from '../types';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useLanguage } from '../i18n/LanguageContext';

interface HomePageProps {
  products: Product[];
  settings: SiteSettings;
  onSelectProduct: (product: Product) => void;
  onOrderProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  settings,
  onSelectProduct,
  onOrderProduct,
}) => {
  const { t, lang } = useLanguage();
  const productsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive !== false);
  const recentProducts = products.filter((p) => p.isActive !== false).slice(0, 6);

  const cleanedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
  const waUrl = cleanedWhatsApp
    ? `https://wa.me/${cleanedWhatsApp}?text=${encodeURIComponent(
        lang === 'mg'
          ? `Manao ahoana tompoko, te-hahafantatra misimisy kokoa momba ny ${settings.companyName} aho azafady.`
          : `Bonjour, je souhaite en savoir plus sur les offres de ${settings.companyName} s'il vous plaît.`
      )}`
    : null;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <HeroSection settings={settings} onExploreClick={scrollToProducts} />

      {/* Featured Products Section */}
      <section ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'mg' ? 'Ireo Be Mpitady Indrindra' : 'Les Plus Demandés'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'mg' ? 'Vokatra Malaza sy Atolotra' : 'Produits Populaires & Recommandés'}
            </h2>
          </div>
          <Link
            to="/vokatra"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{lang === 'mg' ? 'Hijery ny katalaogy feno' : 'Voir tout le catalogue'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onOrder={onOrderProduct}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
            <Wifi className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">{t.noProductsFound}</h3>
          </div>
        )}
      </section>

      {/* Why Choose Pocket WiFi Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-cyan-500/20 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {t.benefitsSubtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {t.benefitsTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.benefitsDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.benefit1Title}</h4>
                  <p className="text-xs text-slate-400">{t.benefit1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.benefit2Title}</h4>
                  <p className="text-xs text-slate-400">{t.benefit2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.benefit3Title}</h4>
                  <p className="text-xs text-slate-400">{t.benefit3Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.benefit4Title}</h4>
                  <p className="text-xs text-slate-400">{t.benefit4Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All / Recent Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'mg' ? 'Vokatra Vaovao sy Azo Vidiana' : 'Nouveaux Produits Disponibles'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'mg'
                ? 'Fitaovana efa voasedra sy manana garantie'
                : 'Équipements certifiés avec garantie'}
            </p>
          </div>
          <Link
            to="/vokatra"
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>{t.viewAllProducts}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onOrder={onOrderProduct}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
            <p className="text-sm text-slate-400">{t.noProductsFound}</p>
          </div>
        )}
      </section>

      {/* Direct WhatsApp Callout */}
      {waUrl && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {lang === 'mg'
                  ? 'Mila fanampiana na toro-hevitra momba ny Pocket WiFi?'
                  : 'Besoin de conseils pour choisir votre Pocket WiFi ?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {lang === 'mg'
                  ? 'Mifandraisa mivantana amin\'ny mpanolotsainay amin\'ny WhatsApp handraisana toro-hevitra maimaim-poana.'
                  : 'Contactez directement nos conseillers sur WhatsApp pour une assistance rapide et personnalisée.'}
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>{lang === 'mg' ? "Hiresaka amin'ny WhatsApp" : 'Discuter sur WhatsApp'}</span>
            </a>
          </div>
        </section>
      )}
    </div>
  );
};
