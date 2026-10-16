import React from 'react';
import { MessageSquare, Phone, Mail, MapPin, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const { t, lang } = useLanguage();
  const cleanedWhatsApp = normalizeWhatsAppNumber(settings.whatsappNumber);
  const waUrl = cleanedWhatsApp ? `https://wa.me/${cleanedWhatsApp}` : null;

  const faqs = lang === 'mg' ? [
    {
      q: 'Inona avy ireo puce mifanaraka amin\'ny Pocket WiFi?',
      a: 'Débloqué daholo ny Pocket WiFi sy Router amidinay. Afaka ampiasaina tsara amin\'ny puce Telma 4G, Orange 4G, ary Airtel 4G.',
    },
    {
      q: 'Maharitra firy ora ny batterie?',
      a: 'Miankina amin\'ny model izany, eo anelanelan\'ny 7 ora ka hatramin\'ny 24 ora. Ny Huawei E5577 ohatra dia maharitra 10-12 ora fiasana mitohy.',
    },
    {
      q: 'Ahoana ny fomba fandoavam-bola sy ny fanaterana?',
      a: 'Rehefa mandefa commande amin\'ny WhatsApp ianao dia ifanarahana ny fandoavana (MVola, Orange Money, Airtel Money na vola mivantana rehefa mandray ny entana). Manatitra eto Antananarivo sy mandefa amin\'ny taxi-brousse / colis manerana ny faritra izahay.',
    },
    {
      q: 'Misy garantie ve ny fitaovana?',
      a: 'Eny tompoko, misy garantie sy fanandramana avy hatrany miaraka amin\'ny mpanatitra mba hahazoanao antoka fa mandeha tsara ilay fitaovana.',
    },
  ] : [
    {
      q: 'Quelles sont les puces compatibles avec vos Pocket WiFi ?',
      a: 'Tous nos équipements sont entièrement désimlockés et compatibles avec tous les opérateurs à Madagascar : Telma 4G, Orange 4G et Airtel 4G.',
    },
    {
      q: 'Quelle est l\'autonomie réelle de la batterie ?',
      a: 'Selon le modèle choisi, l\'autonomie varie entre 7 et 24 heures. Par exemple, le Huawei E5577 offre 10 à 12 heures d\'utilisation continue.',
    },
    {
      q: 'Quels sont les modes de paiement et de livraison ?',
      a: 'Le paiement s\'effectue facilement par Mobile Money (MVola, Orange Money, Airtel Money) ou en espèces à la livraison. Livraison express à Antananarivo et expédition sécurisée en provinces.',
    },
    {
      q: 'Les équipements bénéficient-ils d\'une garantie ?',
      a: 'Oui, tous nos appareils sont garantis et testés avec vous à la livraison pour assurer un fonctionnement parfait.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
          {t.contactBadge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t.contactTitle}
        </h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto">
          {t.contactSubtitle}
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Card */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-emerald-500/30 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.contactWaTitle}</h3>
            <p className="text-xs text-slate-400">{t.contactWaDesc}</p>
            <p className="text-sm font-extrabold text-emerald-400">
              {settings.whatsappNumber || '261340000000'}
            </p>
          </div>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>{t.contactWaBtn}</span>
            </a>
          )}
        </div>

        {/* Phone Card */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.contactPhoneTitle}</h3>
            <p className="text-xs text-slate-400">{t.contactPhoneDesc}</p>
            <p className="text-sm font-extrabold text-cyan-400">
              {settings.phone || '+261 34 00 000 00'}
            </p>
          </div>
          {settings.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>{t.contactPhoneBtn}</span>
            </a>
          )}
        </div>

        {/* Location & Email */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.contactAddressTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.address || 'Antananarivo, Madagasikara'}
            </p>
            <p className="text-xs font-semibold text-slate-300">
              {settings.email || 'contact@boxwifi.mg'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t.workingHours}</span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{t.faqBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.faqTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <h4 className="font-bold text-white text-sm leading-snug">{faq.q}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
