import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'mg' | 'fr';

export interface Translations {
  // Navigation
  navHome: string;
  navProducts: string;
  navAbout: string;
  navContact: string;
  navWhatsApp: string;
  navTagline: string;

  // Hero
  heroBadge: string;
  heroDefaultTitle: string;
  heroDefaultSubtitle: string;
  heroCtaExplore: string;
  heroCtaContact: string;
  spec4g5g: string;
  spec4g5gDesc: string;
  specBattery: string;
  specBatteryDesc: string;
  specConnected: string;
  specConnectedDesc: string;
  specUnlocked: string;
  specUnlockedDesc: string;

  // Benefits
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefitsDesc: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  benefit4Title: string;
  benefit4Desc: string;

  // Catalog & Product Card
  featuredBadge: string;
  inStock: string;
  outOfStock: string;
  priceLabel: string;
  viewDetails: string;
  buyWhatsApp: string;
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;
  sortBy: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortName: string;
  productsFound: string;
  resetFilters: string;
  noProductsFound: string;
  noProductsHint: string;
  viewAllProducts: string;
  catAll: string;
  cat4g: string;
  cat5g: string;
  catRouter: string;
  catAccessories: string;

  // Product Modal
  perUnit: string;
  quantityLabel: string;
  estimatedTotal: string;
  sendOrderBtn: string;
  techDetails: string;
  qualityGuarantee: string;
  fastDelivery: string;

  // Order Form Modal
  orderModalTitle: string;
  orderModalSubtitle: string;
  selectedProduct: string;
  fieldName: string;
  fieldNamePlaceholder: string;
  fieldQuantity: string;
  fieldLocation: string;
  fieldLocationPlaceholder: string;
  fieldPhone: string;
  fieldPhonePlaceholder: string;
  fieldNotes: string;
  fieldNotesPlaceholder: string;
  optionalLabel: string;
  orderNotice: string;
  orderSubmitBtn: string;
  orderSubmitting: string;
  whatsappMissing: string;

  // WhatsApp Message template labels
  waOrderTitle: string;
  waProduct: string;
  waUnitPrice: string;
  waQuantity: string;
  waName: string;
  waLocation: string;
  waPhone: string;
  waNotes: string;
  waNone: string;
  waTotal: string;

  // About Page
  aboutBadge: string;
  aboutTitle: string;
  aboutMissionTitle: string;
  aboutMissionDesc: string;
  aboutQualityTitle: string;
  aboutQualityDesc: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Contact & FAQ
  contactBadge: string;
  contactTitle: string;
  contactSubtitle: string;
  contactWaTitle: string;
  contactWaDesc: string;
  contactWaBtn: string;
  contactPhoneTitle: string;
  contactPhoneDesc: string;
  contactPhoneBtn: string;
  contactAddressTitle: string;
  workingHours: string;
  faqBadge: string;
  faqTitle: string;

  // Footer
  footerGuarantee: string;
  footerQuickLinks: string;
  footerCategories: string;
  footerContact: string;
  footerTagline: string;

  // Admin PIN Protection
  pinTitle: string;
  pinSubtitle: string;
  pinPlaceholder: string;
  pinSubmit: string;
  pinError: string;
  pinHint: string;
  changePinTitle: string;
  changePinDesc: string;
  currentPinLabel: string;
  newPinLabel: string;
  confirmPinLabel: string;
  changePinSubmit: string;
  pinChangeSuccess: string;
  pinMismatch: string;
  pinTooShort: string;
}

export const translations: Record<Language, Translations> = {
  mg: {
    navHome: 'Fandraisana',
    navProducts: 'Vokatra rehetra',
    navAbout: 'Momba anay',
    navContact: 'Fifandraisana',
    navWhatsApp: 'WhatsApp',
    navTagline: 'POCKET WIFI & ROUTERS',

    heroBadge: 'BOX WIFI – POCKET WIFI OFISIALY',
    heroDefaultTitle: 'Aterineto Haingana sy Maharitra na Aiza na Aiza',
    heroDefaultSubtitle: 'Vidio eto ny Pocket WiFi 4G/5G mahery vaika, router portable ary kojakoja ilainao miaraka amin\'ny commande mivantana amin\'ny WhatsApp.',
    heroCtaExplore: 'Hijery ny Vokatra',
    heroCtaContact: 'Hifandray aminay',
    spec4g5g: '4G LTE & 5G',
    spec4g5gDesc: 'Haingam-pandeha',
    specBattery: '10-12 Ora',
    specBatteryDesc: 'Batterie maharitra',
    specConnected: '16 Connectés',
    specConnectedDesc: 'Indray miaraka',
    specUnlocked: 'Puce Rehetra',
    specUnlockedDesc: 'Telma, Orange, Airtel',

    benefitsTitle: 'Nahoana no misafidy Pocket WiFi ao amin\'ny BOX WIFI?',
    benefitsSubtitle: 'TOMBONTSOA LEHIBE',
    benefitsDesc: 'Mora entina anaty paosy, tsy mila mampiasa connection amin\'ny finday mandany batterie, ary afaka zaraina amin\'ny solosaina sy fitaovana maro indray miaraka amin\'ny hafainganam-pandeha ambony indrindra.',
    benefit1Title: 'Batterie Maharitra',
    benefit1Desc: '10 hatramin\'ny 12 ora fiasana mitohy tsy mila chargeur.',
    benefit2Title: 'Puce Rehetra Débloqué',
    benefit2Desc: 'Telma, Orange, Airtel tsy misy fanakanana.',
    benefit3Title: 'Haingam-pandeha 4G/5G',
    benefit3Desc: 'Ho an\'ny télétravail, fivoriana Zoom ary streaming.',
    benefit4Title: 'Fandefasana Manerana ny Nosy',
    benefit4Desc: 'Eto Antananarivo sy any amin\'ny faritra manerana an\'i Madagasikara.',

    featuredBadge: 'Malaza',
    inStock: 'Misy tahiry',
    outOfStock: 'Lany tahiry',
    priceLabel: 'Vidiny',
    viewDetails: 'Antsipiriany',
    buyWhatsApp: 'WhatsApp',
    catalogTitle: 'Katalaogin\'ny Vokatra Rehetra',
    catalogSubtitle: 'Fidio ny Pocket WiFi na Router mifanaraka indrindra amin\'ny zavatra ilainao. Vokatra efa voasedra sy azo ampiasaina avy hatrany.',
    searchPlaceholder: 'Mitady vokatra (ohatra: Huawei, 5G, ZTE, Batterie)...',
    sortBy: 'Fanasokajiana',
    sortNewest: 'Vao nampidirina voalohany',
    sortPriceAsc: 'Vidiny mora indrindra',
    sortPriceDesc: 'Vidiny lafo indrindra',
    sortName: 'Araka ny anarana (A-Z)',
    productsFound: 'Vokatra hita:',
    resetFilters: 'Avereno amin\'ny voalohany',
    noProductsFound: 'Tsy misy vokatra mifanaraka amin\'ny sivana',
    noProductsHint: 'Andramo ovaina ny teny nokarohina na fidio ny sokajy "Rehetra".',
    viewAllProducts: 'Hijery ny vokatra rehetra',
    catAll: 'Rehetra',
    cat4g: 'Pocket WiFi 4G LTE',
    cat5g: 'Pocket WiFi 5G Ultra',
    catRouter: 'Router Portable & CPE',
    catAccessories: 'Batteries & Kojakoja',

    perUnit: '/ fitaovana',
    quantityLabel: 'Isany hovidiana:',
    estimatedTotal: 'Totalin\'ny tombana:',
    sendOrderBtn: 'Handefa Commande amin\'ny WhatsApp',
    techDetails: 'Famaritana feno sy antsipiriany ara-teknika',
    qualityGuarantee: 'Fitaovana tsara kalitao',
    fastDelivery: 'Fandefasana haingana',

    orderModalTitle: 'Handefa Commande amin\'ny WhatsApp',
    orderModalSubtitle: 'Fenoy ireto fampahafantarana ireto',
    selectedProduct: 'Vokatra voafidy',
    fieldName: '1. Anarana',
    fieldNamePlaceholder: 'Ohatra: Rakoto Jean',
    fieldQuantity: '2. Isan\'ny produit',
    fieldLocation: '3. Toerana andefasana azy',
    fieldLocationPlaceholder: 'Tanàna, fokontany, adiresy na toerana mora ahitana anao...',
    fieldPhone: '4. Laharana afaka iantsoana',
    fieldPhonePlaceholder: 'Ohatra: 034 12 345 67',
    fieldNotes: '5. Notes',
    fieldNotesPlaceholder: 'Fanamarihana fanampiny (loko tiana, ora handraisana azy, sns.)...',
    optionalLabel: '(Tsy voatery fenoina)',
    orderNotice: '* Fanamarihana: Rehefa tsindriana ny bokotra eto ambany dia hisokatra ny WhatsApp ahafahanao mandefa ny hafatra. Ny orinasa no hanamarina ny commande sy handamina ny fanaterana miaraka aminao.',
    orderSubmitBtn: 'Handefa amin\'ny WhatsApp izao',
    orderSubmitting: 'Eo am-panomanana...',
    whatsappMissing: 'Mbola tsy voapetraka ao amin\'ny tranonkala ny laharana WhatsApp an\'ny orinasa.',

    waOrderTitle: 'BOX WIFI – POCKET WIFI\n\nCOMMANDE VAOVAO',
    waProduct: 'Produit',
    waUnitPrice: 'Vidiny isaky ny iray',
    waQuantity: 'Isan\'ny produit',
    waName: 'Anarana',
    waLocation: 'Toerana andefasana azy',
    waPhone: 'Laharana afaka iantsoana',
    waNotes: 'Notes',
    waNone: 'Tsy misy',
    waTotal: 'TOTALIN\'NY TOMBANA',

    aboutBadge: 'MOMBA NY ORINASA',
    aboutTitle: 'BOX WIFI – POCKET WIFI',
    aboutMissionTitle: 'Ny Iraka Ampanaovina Anay',
    aboutMissionDesc: 'Ny tanjonay dia ny hanamora ny fahazoana aterineto manara-penitra ho an\'ny tokantrano, mpianatra, matihanina miasa an-trano (télétravail) ary orinasa kely sy salantsalany eto Madagasikara amin\'ny vidiny mirary indrindra.',
    aboutQualityTitle: 'Kalitao sy Fiarovana',
    aboutQualityDesc: 'Ireo fitaovana rehetra amidinay dia efa nandalo fanandramana teknika mba hiantohana fa mandeha amin\'ny tambajotra rehetra (Telma, Orange, Airtel) tsy misy olana.',
    howItWorksTitle: 'Fomba Fividianana Tsotra',
    howItWorksSubtitle: 'Dingana 4 monja dia tonga any aminao ny fitaovana',
    step1Title: 'Safidio ny vokatra',
    step1Desc: 'Jereo ny katalaogy ary fidio ny Pocket WiFi mifanaraka aminao.',
    step2Title: 'Alefaso amin\'ny WhatsApp',
    step2Desc: 'Tsindrio ny bokotra WhatsApp, fenoy ny adiresinao dia alefaso.',
    step3Title: 'Fanamafisana & Fanaterana',
    step3Desc: 'Mifandray aminao ny ekipanay ary manatitra ny entana eo noho eo.',
    step4Title: 'Ampidiro ny puce dia mandeha',
    step4Desc: 'Ampidiro ny puce 4G/5G tianao dia mankafy fifandraisana haingana.',

    contactBadge: 'FIFANDRAISANA',
    contactTitle: 'Hifandray Aminay',
    contactSubtitle: 'Vonona hanampy sy hamaly ny fanontanianao ny ekipan\'ny BOX WIFI.',
    contactWaTitle: 'WhatsApp Direct',
    contactWaDesc: 'Valiny haingana indrindra ho an\'ny commande sy fanontaniana.',
    contactWaBtn: 'Handefa hafatra WhatsApp',
    contactPhoneTitle: 'Antso An-tariby',
    contactPhoneDesc: 'Afaka miantso anay mivantana amin\'ny ora fiasana.',
    contactPhoneBtn: 'Hiantso izao',
    contactAddressTitle: 'Adiresy & Mailaka',
    workingHours: 'Alatsinainy - Sabotsy: 08:00 - 18:00',
    faqBadge: 'FANONTANIANA FAMETRAKY NY OLONA',
    faqTitle: 'Fanazavana Fanampiny (FAQ)',

    footerGuarantee: 'Garantie sy fanampiana ara-teknika',
    footerQuickLinks: 'Rohy haingana',
    footerCategories: 'Sokajin-javatra',
    footerContact: 'Fifandraisana',
    footerTagline: 'Aterineto Haingana ho an\'ny Rehetra',

    pinTitle: 'Fidirana Voaaro (Code PIN Secret)',
    pinSubtitle: 'Ampidiro ny Code PIN Administrateur ahafahana miditra amin\'ny Dashboard',
    pinPlaceholder: 'Ampidiro ny Code PIN...',
    pinSubmit: 'Hiditra ao amin\'ny Admin',
    pinError: 'Diso ny Code PIN nampidirinao. Andramo indray.',
    pinHint: 'Code PIN secret voatokana ho an\'ny tompon\'ny tranonkala ihany.',
    changePinTitle: 'Fanovana ny Code PIN Secret',
    changePinDesc: 'Afaka manova ny Code PIN fidirana amin\'ny Espace Admin ianao eto.',
    currentPinLabel: 'Code PIN amin\'izao fotoana izao',
    newPinLabel: 'Code PIN vaovao (farafahakeliny 6 tarehimarika)',
    confirmPinLabel: 'Hamafiso ny Code PIN vaovao',
    changePinSubmit: 'Hanova ny Code PIN',
    pinChangeSuccess: 'Voaova soa aman-tsara ny Code PIN fidirana!',
    pinMismatch: 'Tsy mitovy ny Code PIN vaovao sy ny fanamafisana azy.',
    pinTooShort: 'Farafahakeliny 6 tarehimarika ny Code PIN.',
  },
  fr: {
    navHome: 'Accueil',
    navProducts: 'Nos Produits',
    navAbout: 'À propos',
    navContact: 'Contact',
    navWhatsApp: 'WhatsApp',
    navTagline: 'POCKET WIFI & ROUTEURS',

    heroBadge: 'BOX WIFI – POCKET WIFI OFFICIEL',
    heroDefaultTitle: 'Internet Rapide et Fiable Partout Où Vous Êtes',
    heroDefaultSubtitle: 'Achetez vos Pocket WiFi 4G/5G haute vitesse, routeurs portables et accessoires avec commande directe sur WhatsApp.',
    heroCtaExplore: 'Voir les Produits',
    heroCtaContact: 'Nous Contacter',
    spec4g5g: '4G LTE & 5G',
    spec4g5gDesc: 'Très haut débit',
    specBattery: '10-12 Heures',
    specBatteryDesc: 'Batterie longue durée',
    specConnected: '16 Connectés',
    specConnectedDesc: 'En simultané',
    specUnlocked: 'Désimlocké Tout Opérateur',
    specUnlockedDesc: 'Telma, Orange, Airtel',

    benefitsTitle: 'Pourquoi choisir un Pocket WiFi chez BOX WIFI ?',
    benefitsSubtitle: 'AVANTAGES CLÉS',
    benefitsDesc: 'Ultra compact dans votre poche, ne décharge pas la batterie de votre smartphone, et partage une connexion haut débit avec vos PC et plusieurs appareils simultanément.',
    benefit1Title: 'Batterie Longue Durée',
    benefit1Desc: '10 à 12 heures d\'autonomie continue sans chargeur.',
    benefit2Title: 'Compatible Toutes Puces',
    benefit2Desc: 'Fonctionne avec Telma, Orange et Airtel sans restriction.',
    benefit3Title: 'Haut Débit 4G/5G',
    benefit3Desc: 'Parfait pour le télétravail, réunions Zoom et streaming HD.',
    benefit4Title: 'Livraison Partout à Madagascar',
    benefit4Desc: 'À Antananarivo et expédition rapide en provinces.',

    featuredBadge: 'Populaire',
    inStock: 'En stock',
    outOfStock: 'Rupture de stock',
    priceLabel: 'Prix',
    viewDetails: 'Détails',
    buyWhatsApp: 'WhatsApp',
    catalogTitle: 'Catalogue de Tous les Produits',
    catalogSubtitle: 'Choisissez le Pocket WiFi ou routeur qui correspond parfaitement à vos besoins. Matériel testé et prêt à l\'emploi.',
    searchPlaceholder: 'Rechercher un produit (ex: Huawei, 5G, ZTE, Batterie)...',
    sortBy: 'Trier par',
    sortNewest: 'Nouveautés d\'abord',
    sortPriceAsc: 'Prix le plus bas',
    sortPriceDesc: 'Prix le plus haut',
    sortName: 'Nom (A-Z)',
    productsFound: 'Produits trouvés :',
    resetFilters: 'Réinitialiser les filtres',
    noProductsFound: 'Aucun produit ne correspond à vos critères',
    noProductsHint: 'Essayez de modifier votre recherche ou sélectionnez la catégorie "Tous".',
    viewAllProducts: 'Voir tous les produits',
    catAll: 'Tous',
    cat4g: 'Pocket WiFi 4G LTE',
    cat5g: 'Pocket WiFi 5G Ultra',
    catRouter: 'Routeur Portable & CPE',
    catAccessories: 'Batteries & Accessoires',

    perUnit: '/ pièce',
    quantityLabel: 'Quantité à commander :',
    estimatedTotal: 'Total estimé :',
    sendOrderBtn: 'Commander via WhatsApp',
    techDetails: 'Caractéristiques et fiche technique',
    qualityGuarantee: 'Matériel certifié de qualité',
    fastDelivery: 'Livraison express',

    orderModalTitle: 'Commander sur WhatsApp',
    orderModalSubtitle: 'Veuillez remplir ces informations',
    selectedProduct: 'Produit sélectionné',
    fieldName: '1. Nom & Prénom',
    fieldNamePlaceholder: 'Ex: Rakoto Jean',
    fieldQuantity: '2. Quantité',
    fieldLocation: '3. Adresse ou lieu de livraison',
    fieldLocationPlaceholder: 'Ville, quartier, adresse ou repère facile...',
    fieldPhone: '4. Numéro de téléphone pour vous joindre',
    fieldPhonePlaceholder: 'Ex: 034 12 345 67',
    fieldNotes: '5. Remarques (Optionnel)',
    fieldNotesPlaceholder: 'Précisions supplémentaires (couleur, heure de livraison, etc.)...',
    optionalLabel: '(Optionnel)',
    orderNotice: '* Remarque : En cliquant sur le bouton ci-dessous, WhatsApp s\'ouvrira avec votre message pré-rempli. L\'équipe commerciale confirmera la commande et la livraison directement avec vous.',
    orderSubmitBtn: 'Envoyer sur WhatsApp maintenant',
    orderSubmitting: 'Préparation en cours...',
    whatsappMissing: 'Le numéro WhatsApp de l\'entreprise n\'est pas encore configuré.',

    waOrderTitle: 'BOX WIFI – POCKET WIFI\n\nNOUVELLE COMMANDE',
    waProduct: 'Produit',
    waUnitPrice: 'Prix unitaire',
    waQuantity: 'Quantité',
    waName: 'Nom du client',
    waLocation: 'Lieu de livraison',
    waPhone: 'Numéro de contact',
    waNotes: 'Notes',
    waNone: 'Aucune',
    waTotal: 'TOTAL ESTIMÉ',

    aboutBadge: 'À PROPOS DE L\'ENTREPRISE',
    aboutTitle: 'BOX WIFI – POCKET WIFI',
    aboutMissionTitle: 'Notre Mission',
    aboutMissionDesc: 'Notre objectif est de rendre l\'internet haut débit accessible à tous les foyers, étudiants, télétravailleurs et entreprises à Madagascar aux prix les plus compétitifs.',
    aboutQualityTitle: 'Qualité et Sécurité',
    aboutQualityDesc: 'Tous nos équipements sont rigoureusement testés techniquement (désimlockage, autonomie batterie, puissance signal) afin d\'assurer une compatibilité totale avec tous les opérateurs (Telma, Orange, Airtel).',
    howItWorksTitle: 'Comment Commander en 4 Étapes Simples',
    howItWorksSubtitle: 'Votre équipement livré rapidement chez vous',
    step1Title: 'Choisissez votre produit',
    step1Desc: 'Parcourez le catalogue et trouvez le Pocket WiFi adapté à vos besoins.',
    step2Title: 'Envoyez sur WhatsApp',
    step2Desc: 'Cliquez sur le bouton WhatsApp, indiquez votre adresse et envoyez.',
    step3Title: 'Confirmation & Livraison',
    step3Desc: 'Notre équipe vous répond immédiatement et organise la livraison.',
    step4Title: 'Insérez la puce et profitez',
    step4Desc: 'Insérez votre puce 4G/5G et surfez à grande vitesse sans tracas.',

    contactBadge: 'CONTACTEZ-NOUS',
    contactTitle: 'Prenez Contact Avec Nous',
    contactSubtitle: 'L\'équipe BOX WIFI est à votre disposition pour toute question ou commande.',
    contactWaTitle: 'WhatsApp Direct',
    contactWaDesc: 'La réponse la plus rapide pour vos commandes et renseignements.',
    contactWaBtn: 'Envoyer un message WhatsApp',
    contactPhoneTitle: 'Appel Téléphonique',
    contactPhoneDesc: 'Joignable directement pendant les heures d\'ouverture.',
    contactPhoneBtn: 'Appeler maintenant',
    contactAddressTitle: 'Adresse & Email',
    workingHours: 'Lundi - Samedi : 08h00 - 18h00',
    faqBadge: 'FOIRE AUX QUESTIONS',
    faqTitle: 'Questions Fréquentes (FAQ)',

    footerGuarantee: 'Garantie et assistance technique',
    footerQuickLinks: 'Liens rapides',
    footerCategories: 'Catégories',
    footerContact: 'Contact',
    footerTagline: 'L\'Internet Haut Débit pour Tous',

    pinTitle: 'Accès Sécurisé (Code PIN Secret)',
    pinSubtitle: 'Entrez le code PIN administrateur pour accéder au tableau de bord',
    pinPlaceholder: 'Entrez le code PIN...',
    pinSubmit: 'Accéder à l\'administration',
    pinError: 'Code PIN incorrect. Veuillez réessayer.',
    pinHint: 'Code PIN secret strictement réservé au propriétaire du site.',
    changePinTitle: 'Changer le Code PIN Secret',
    changePinDesc: 'Vous pouvez modifier ici le code PIN secret donnant accès à l\'espace administrateur.',
    currentPinLabel: 'Code PIN actuel',
    newPinLabel: 'Nouveau code PIN (minimum 6 chiffres)',
    confirmPinLabel: 'Confirmer le nouveau code PIN',
    changePinSubmit: 'Enregistrer le nouveau PIN',
    pinChangeSuccess: 'Code PIN modifié avec succès !',
    pinMismatch: 'Le nouveau code PIN et sa confirmation ne correspondent pas.',
    pinTooShort: 'Le code PIN doit comporter au moins 6 chiffres.',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('boxwifi_language');
    return saved === 'fr' || saved === 'mg' ? saved : 'mg';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('boxwifi_language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
