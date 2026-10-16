import { Product, SiteSettings } from '../types';
import { saveProduct } from './productService';
import { saveSiteSettings } from './siteSettingsService';

// Generates crisp SVG Data URLs for realistic tech pocket WiFi devices
function generateDeviceSvg(title: string, speed: string, color: string, badge: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)" />
    <!-- Grid lines -->
    <path d="M0 100 H400 M0 200 H400 M0 300 H400 M100 0 V400 M200 0 V400 M300 0 V400" stroke="#334155" stroke-width="1" stroke-opacity="0.2" />
    
    <!-- Pocket WiFi Body -->
    <rect x="90" y="110" width="220" height="150" rx="28" fill="url(#body)" stroke="#475569" stroke-width="3" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))" />
    
    <!-- LCD Screen -->
    <rect x="120" y="135" width="160" height="70" rx="10" fill="#020617" stroke="#0ea5e9" stroke-width="1.5" />
    
    <!-- Signal Bars & Icons -->
    <path d="M135 152 h4 v8 h-4 z M142 148 h4 v12 h-4 z M149 144 h4 v16 h-4 z M156 140 h4 v20 h-4 z" fill="${color}" />
    <!-- Battery Icon -->
    <rect x="250" y="142" width="20" height="10" rx="2" fill="none" stroke="#22c55e" stroke-width="1.5" />
    <rect x="252" y="144" width="14" height="6" fill="#22c55e" />
    <rect x="270" y="145" width="2" height="4" fill="#22c55e" />

    <!-- WiFi Icon -->
    <path d="M190 156 a15 15 0 0 1 20 0 M194 160 a9 9 0 0 1 12 0 M198 164 a3 3 0 0 1 4 0" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" />
    <circle cx="200" cy="168" r="1.5" fill="${color}" />

    <!-- Speed Indicator -->
    <text x="200" y="190" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-weight="bold" font-size="13">${speed}</text>
    
    <!-- Power Button -->
    <circle cx="200" cy="235" r="9" fill="#0f172a" stroke="${color}" stroke-width="2" />
    <line x1="200" y1="230" x2="200" y2="235" stroke="${color}" stroke-width="1.5" stroke-linecap="round" />

    <!-- Brand Badge & Title -->
    <rect x="130" y="280" width="140" height="26" rx="13" fill="url(#accent)" />
    <text x="200" y="297" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="11" letter-spacing="1">${badge}</text>
    
    <text x="200" y="340" text-anchor="middle" fill="#f1f5f9" font-family="system-ui, sans-serif" font-weight="bold" font-size="16">${title}</text>
    <text x="200" y="365" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">BOX WIFI – POCKET WIFI</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Huawei E5577 4G LTE Pocket WiFi',
    slug: 'huawei-e5577-4g-lte',
    shortDescription: 'Pocket WiFi 4G haingana 150 Mbps, batterie 3000mAh maharitra hatramin\'ny 12 ora, manaiky ny pucela rehetra (Telma, Orange, Airtel).',
    description: `Ny Huawei E5577 dia fitaovana Pocket WiFi tena azo antoka sady be mpitady indrindra eto Madagasikara:
- Haingam-pandeha: 4G LTE hatramin'ny 150 Mbps download / 50 Mbps upload.
- Puce mifanaraka aminy: Débloqué ho an'ny tambajotra rehetra (Telma 4G, Orange 4G, Airtel 4G).
- Fitaovana afaka mifandray: Hatramin'ny 16 appareils indray miaraka (Finday, solosaina, tablette, Smart TV).
- Batterie: 3000 mAh Li-ion, maharitra 10 hatramin'ny 12 ora fampiasana mitohy.
- Ecran LCD 1.45" manambara ny signal, batterie, isan'ny connecté ary ny consommation données.
- Fampidirana carte MicroSD hatramin'ny 32 GB.
- Miaraka amin'ny chargeur sy cable USB ao anaty boaty.`,
    price: 185000,
    currency: 'MGA',
    images: [
      {
        dataUrl: generateDeviceSvg('Huawei E5577', '150 Mbps 4G', '#0284c7', 'POPULAR 4G'),
        mimeType: 'image/svg+xml',
        width: 400,
        height: 400,
        sizeBytes: 3200,
      },
    ],
    category: 'Pocket WiFi 4G LTE',
    stockQuantity: 15,
    isActive: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'ZTE MF920U 4G Mobile Hotspot',
    slug: 'zte-mf920u-4g-mobile-hotspot',
    shortDescription: 'Pocket WiFi kely sy mora entina, signal mahery, batterie 2000mAh, fifandraisana ho an\'ny fitaovana 10.',
    description: `Pocket WiFi tena tsara ho an'ny mpianatra sy ny mpivezivezy matetika:
- Haingam-pandeha 4G LTE Cat4 150 Mbps.
- Mifandray amin'ny opérateur rehetra (Telma, Orange, Airtel).
- Batterie 2000mAh maharitra 7 hatramin'ny 8 ora.
- Indicator LED mazava ho an'ny tambajotra, batterie ary SMS.
- Kely sy maivana, tafiditra anaty paosy mora foana.`,
    price: 145000,
    currency: 'MGA',
    images: [
      {
        dataUrl: generateDeviceSvg('ZTE MF920U', '150 Mbps Cat4', '#2563eb', 'BEST VALUE'),
        mimeType: 'image/svg+xml',
        width: 400,
        height: 400,
        sizeBytes: 3100,
      },
    ],
    category: 'Pocket WiFi 4G LTE',
    stockQuantity: 20,
    isActive: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Netgear Nighthawk M1 4G/5G Pro Mobile Router',
    slug: 'netgear-nighthawk-m1-pro',
    shortDescription: 'Router portable faran\'izay mahery, Gigabit LTE hatramin\'ny 1 Gbps, batterie 5040mAh, port Ethernet RJ45.',
    description: `Fitaovana matihanina ho an'ny orinasa, télétravail sy streaming avo lenta:
- Haingam-pandeha hatramin'ny 1 Gbps Gigabit LTE.
- Port Ethernet RJ45 mivantana ho an'ny PC na switch.
- Batterie goavana 5040mAh maharitra 24 ora na azo ampiasaina toy ny power bank.
- Manaiky fitaovana hatramin'ny 20 miaraka amin'ny Dual-Band WiFi 2.4GHz sy 5GHz.
- Ecran couleur LCD 2.4" mora ampiasaina.`,
    price: 490000,
    currency: 'MGA',
    images: [
      {
        dataUrl: generateDeviceSvg('Nighthawk M1', '1 Gbps Ultra', '#f59e0b', 'PRO HIGH-SPEED'),
        mimeType: 'image/svg+xml',
        width: 400,
        height: 400,
        sizeBytes: 3300,
      },
    ],
    category: 'Pocket WiFi 5G Ultra',
    stockQuantity: 6,
    isActive: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'TP-Link M7350 4G LTE Advanced Pocket WiFi',
    slug: 'tp-link-m7350-lte-advanced',
    shortDescription: 'Dual-Band WiFi 2.4/5GHz, ecran affichage feno, batterie 2000mAh, fifandraisana marin-toerana.',
    description: `Marika TP-Link malaza amin'ny kalitao sy ny faharetana:
- Manaiky hatramin'ny 150 Mbps download.
- Dual-band 2.4GHz na 5GHz azo safidiana hisorohana ny encombrement.
- Fampisehoana feno: consommation données, signal 4G, batterie, mpampiasa.
- Fampiharana tpMiFi amin'ny finday ahafahana mitantana ny fitaovana mora foana.`,
    price: 210000,
    currency: 'MGA',
    images: [
      {
        dataUrl: generateDeviceSvg('TP-Link M7350', 'Dual Band 5GHz', '#10b981', 'RELIABLE'),
        mimeType: 'image/svg+xml',
        width: 400,
        height: 400,
        sizeBytes: 3150,
      },
    ],
    category: 'Pocket WiFi 4G LTE',
    stockQuantity: 12,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Router Portable CPE 4G miaraka amin\'ny Antenne ivelany',
    slug: 'router-cpe-4g-antenne-ivelany',
    shortDescription: 'Router 4G ho an\'ny trano na birao, antenne 2 mahery hisarihana ny signal any amin\'ny faritra lavitra.',
    description: `Vahaolana tonga lafatra ho an'ny toerana sarotra signal:
- Antenne 2 avo lenta (High Gain) hisarihana ny tambajotra 4G lavitra indrindra.
- Port LAN 4 sy WiFi manome fandrakofana hatramin'ny 100 metatra.
- Mandeha amin'ny herinaratra 220V na batterie 12V.
- Mahazaka solosaina sy finday hatramin'ny 32 indray miaraka.`,
    price: 260000,
    currency: 'MGA',
    images: [
      {
        dataUrl: generateDeviceSvg('Router CPE 4G', 'High-Gain 4G', '#6366f1', 'LONG RANGE'),
        mimeType: 'image/svg+xml',
        width: 400,
        height: 400,
        sizeBytes: 3250,
      },
    ],
    category: 'Router Portable & CPE',
    stockQuantity: 8,
    isActive: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Batterie Fanampiny 3000mAh ho an\'ny Pocket WiFi',
    slug: 'batterie-fanampiny-3000mah',
    shortDescription: 'Batterie d\'origine mifanaraka amin\'ny Huawei E5577, E5573 sy router maro hafa, faharetana 12 ora.',
    description: `Aza tapaka aterineto rehefa mandeha lavitra:
- Batterie Li-ion 3000mAh 3.8V azo antoka.
- Fiarovana amin'ny hafanana be sy ny surcharge.
- Mifanaraka amin'ny model Pocket WiFi maro.`,
    price: 45000,
    currency: 'MGA',
    images: [
      {
        dataUrl: generateDeviceSvg('Batterie 3000mAh', '3000 mAh Li-ion', '#059669', 'KOJAKOJA'),
        mimeType: 'image/svg+xml',
        width: 400,
        height: 400,
        sizeBytes: 3000,
      },
    ],
    category: 'Batteries & Kojakoja',
    stockQuantity: 30,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 150).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function seedInitialDatabase(): Promise<number> {
  let count = 0;
  for (const item of INITIAL_PRODUCTS) {
    await saveProduct(item);
    count++;
  }
  await saveSiteSettings({
    companyName: 'BOX WIFI – POCKET WIFI',
    whatsappNumber: '261340000000',
    phone: '+261 34 00 000 00',
    email: 'contact@boxwifi.mg',
    address: 'Analakely, Antananarivo 101, Madagasikara',
    heroTitle: 'Aterineto Haingana sy Maharitra na Aiza na Aiza Misy Anao',
    heroSubtitle: 'Vidio eto ny Pocket WiFi 4G/5G mahery vaika, router portable ary kojakoja ilainao miaraka amin\'ny commande mivantana amin\'ny WhatsApp.',
    announcementText: '⚡ Fandefasana haingana eto Antananarivo sy amin\'ny faritra manerana an\'i Madagasikara!',
    announcementActive: true,
  });
  return count;
}
