import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  KeyRound,
  Lock,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { saveSiteSettings } from '../services/siteSettingsService';
import { normalizeWhatsAppNumber } from '../services/whatsappService';
import { compressImageFile, formatBytes } from '../services/imageCompressionService';
import { updateAdminPin } from '../services/pinService';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefreshData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefreshData }) => {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState(settings.companyName || 'BOX WIFI – POCKET WIFI');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address || '');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [heroImage, setHeroImage] = useState(settings.heroImage || '');
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive ?? true);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [footerText, setFooterText] = useState(settings.footerText || '');

  const [isSaving, setIsSaving] = useState(false);
  const [isCompressingHero, setIsCompressingHero] = useState(false);

  // PIN change state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Clean WhatsApp number
  const cleanedWhatsApp = normalizeWhatsAppNumber(whatsappNumber);
  const testWhatsAppUrl = cleanedWhatsApp
    ? `https://wa.me/${cleanedWhatsApp}?text=${encodeURIComponent(
        'Fitsapana ny rohy WhatsApp avy amin\'ny Espace Admin BOX WIFI.'
      )}`
    : null;

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingHero(true);
    const result = await compressImageFile(file);
    setIsCompressingHero(false);

    if (result.success && result.image) {
      setHeroImage(result.image.dataUrl);
      showToast(
        `Sary lehibe voatsindry: ${formatBytes(result.originalSizeBytes)} ➔ ${formatBytes(
          result.compressedSizeBytes
        )} (-${result.savedPercentage}%)`,
        'success'
      );
    } else {
      showToast(result.error || 'Tsy nahomby ny compression.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cleanedWhatsApp || cleanedWhatsApp.length < 8) {
      showToast('Ampidiro azafady ny laharana WhatsApp manan-kery (ohatra: 261340000000).', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveSiteSettings({
        companyName: companyName.trim(),
        tagline: tagline.trim(),
        whatsappNumber: cleanedWhatsApp,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroImage,
        announcementText: announcementText.trim(),
        announcementActive,
        facebookUrl: facebookUrl.trim(),
        footerText: footerText.trim(),
      });

      showToast(lang === 'mg' ? 'Voatahiry soa aman-tsara tao amin\'ny Firestore ny fandrindrana!' : 'Paramètres enregistrés avec succès dans Firestore !', 'success');
      onRefreshData();
    } catch (err: any) {
      showToast('Nisy olana: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePinUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (!currentPin) {
      setPinError(lang === 'mg' ? 'Ampidiro ny Code PIN taloha.' : 'Veuillez saisir le code PIN actuel.');
      return;
    }

    if (newPin.length < 6) {
      setPinError(t.pinTooShort);
      return;
    }

    if (newPin !== confirmPin) {
      setPinError(t.pinMismatch);
      return;
    }

    setIsUpdatingPin(true);
    const result = await updateAdminPin(currentPin, newPin);
    setIsUpdatingPin(false);

    if (result.success) {
      showToast(t.pinChangeSuccess, 'success');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinError(result.error || t.pinError);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {lang === 'mg' ? 'Fikirakirana & Fiarovana' : 'Paramètres & Sécurité'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {lang === 'mg'
            ? 'Fanovana ny laharana WhatsApp, Code PIN secret, ny votoatin\'ny pejy fandraisana ary ny mombamomba ny orinasa.'
            : 'Gestion du numéro WhatsApp, du code PIN secret, du contenu de la page d\'accueil et des coordonnées.'}
        </p>
      </div>

      {/* Secret PIN Code Security Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{t.changePinTitle}</h2>
            <p className="text-xs text-slate-400">{t.changePinDesc}</p>
          </div>
        </div>

        {pinError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handlePinUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.currentPinLabel}
            </label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.newPinLabel}
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {t.confirmPinLabel}
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div className="sm:col-span-3 pt-1">
            <button
              type="submit"
              disabled={isUpdatingPin}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingPin ? '...' : t.changePinSubmit}
            </button>
          </div>
        </form>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* WhatsApp Management Section */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'mg' ? 'Fitantanana ny Laharana WhatsApp' : 'Gestion du Numéro WhatsApp'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'mg'
                  ? 'Laharana ofisialy handraisana ireo commande avy amin\'ny bokotra "Hividy amin\'ny WhatsApp"'
                  : 'Numéro officiel recevant les commandes générées depuis le site'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              {lang === 'mg'
                ? 'Laharana WhatsApp (endrika iraisam-pirenena tsy misy "+" na habaka)'
                : 'Numéro WhatsApp (format international sans "+" ni espaces)'}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="261340000000 na 0340000000"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              {testWhatsAppUrl && (
                <a
                  href={testWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'mg' ? 'Hitsapa ny rohy wa.me' : 'Tester le lien WhatsApp'}</span>
                </a>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              * {lang === 'mg'
                ? 'Ohatra: Raha 034 12 345 67 ny findainao dia avadika ho 261341234567.'
                : 'Exemple : Si votre numéro est 034 12 345 67, entrez 261341234567.'}
            </p>
          </div>
        </div>

        {/* Company Identity */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">
            {lang === 'mg' ? 'Mombamomba ny Orinasa' : 'Coordonnées de l\'Entreprise'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Anaran\'ny Orinasa' : 'Nom de l\'Entreprise'}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Tenin-tsikera fohy (Tagline)' : 'Slogan court (Tagline)'}
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Laharana finday hafa (Appel)' : 'Téléphone d\'appel'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+261 34 00 000 00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Adiresy Mailaka (Email)' : 'Adresse Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@boxwifi.mg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Toerana / Adiresy (Boutique)' : 'Adresse physique / Boutique'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Analakely, Antananarivo 101, Madagasikara"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Content */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">
            {lang === 'mg' ? 'Votoatin\'ny Pejy Fandraisana (Hero)' : 'Contenu de la Page d\'Accueil (Hero)'}
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Lohatenin\'ny Pejy Fandraisana' : 'Grand Titre Principal'}
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Famaritana fohy ao amin\'ny Pejy Fandraisana' : 'Description d\'introduction'}
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Hero Image upload with compression */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Sary lehibe (Hero Banner - Base64)' : 'Bannière d\'illustration (Base64)'}
              </label>
              <div className="flex items-center gap-4">
                {heroImage && (
                  <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={heroImage} alt="Hero" className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>{isCompressingHero ? '...' : (lang === 'mg' ? 'Mampiditra Sary Vaovao' : 'Téléverser une image')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      disabled={isCompressingHero}
                      className="hidden"
                    />
                  </label>
                  {heroImage && (
                    <button
                      type="button"
                      onClick={() => setHeroImage('')}
                      className="ml-2 text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      {lang === 'mg' ? 'Esory ny sary' : 'Supprimer'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'mg' ? 'Bannière Fanambarana' : 'Bandeau d\'Annonce (Haut de page)'}</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Aseho' : 'Actif'}
              </span>
            </label>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Fandefasana haingana manerana an'i Madagasikara!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        {/* Footer & Socials */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">
            {lang === 'mg' ? 'Footer & Rohy Tambajotra' : 'Pied de page & Réseaux Sociaux'}
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Lahatsoratra Footer (Copyright)' : 'Texte Copyright'}
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {lang === 'mg' ? 'Rohy Pejy Facebook' : 'Lien Facebook'}
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/boxwifimadagascar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>
              {isSaving
                ? '...'
                : (lang === 'mg' ? 'Mitahiry ny Fandrindrana Rehetra' : 'Enregistrer tous les paramètres')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
