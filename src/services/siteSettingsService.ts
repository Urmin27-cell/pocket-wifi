import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import { SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'BOX WIFI – POCKET WIFI',
  tagline: 'Fitaovana Pocket WiFi, Router portable sy kojakoja manerana an\'i Madagasikara',
  whatsappNumber: '261340000000',
  phone: '+261 34 00 000 00',
  email: 'contact@boxwifi.mg',
  address: 'Analakely, Antananarivo 101, Madagasikara',
  heroTitle: 'Aterineto Haingana sy Maharitra na Aiza na Aiza Misy Anao',
  heroSubtitle: 'Vidio eto ny Pocket WiFi 4G/5G mahery vaika, router portable ary kojakoja ilainao miaraka amin\'ny commande mivantana amin\'ny WhatsApp.',
  heroImage: '',
  announcementText: '⚡ Fandefasana haingana eto Antananarivo sy amin\'ny faritra manerana an\'i Madagasikara!',
  announcementActive: true,
  facebookUrl: 'https://facebook.com',
  footerText: 'BOX WIFI – POCKET WIFI © 2026. Mpaninjara ofisialy ny fitaovana Pocket WiFi sy Router Portable eto Madagasikara.',
};

const SETTINGS_DOC_PATH = 'siteSettings/general';
const CACHE_KEY = 'boxwifi_cached_settings';

export async function getSiteSettings(): Promise<SiteSettings> {
  // Check local cache first as instantaneous fallback
  let cached: Partial<SiteSettings> | null = null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) cached = JSON.parse(raw);
  } catch {
    // Ignore storage issues
  }

  try {
    const docRef = doc(db, 'siteSettings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const merged: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...(cached || {}),
        ...(snap.data() as Partial<SiteSettings>),
      };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore quota
      }
      return merged;
    }

    if (cached) {
      return { ...DEFAULT_SITE_SETTINGS, ...cached };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn('Tsy afaka nalaina ny settings avy amin\'ny Firestore, mampiasa cache:', error);
    if (cached) {
      return { ...DEFAULT_SITE_SETTINGS, ...cached };
    }
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const updated: Partial<SiteSettings> = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // Always persist to local cache immediately so changes are never lost
  try {
    const existingRaw = localStorage.getItem(CACHE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : DEFAULT_SITE_SETTINGS;
    const combined = { ...existing, ...updated };
    localStorage.setItem(CACHE_KEY, JSON.stringify(combined));
  } catch (e) {
    console.warn('Local cache error:', e);
  }

  try {
    const docRef = doc(db, 'siteSettings', 'general');
    await setDoc(docRef, updated, { merge: true });
  } catch (error) {
    console.error('Hadisoana teo am-pitahirizana settings tao amin\'ny Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, SETTINGS_DOC_PATH);
  }
}
