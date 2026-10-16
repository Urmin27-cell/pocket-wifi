import { formatAriary } from '../utils/formatters';

export interface OrderFormData {
  productName: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  customerName: string;
  deliveryLocation: string;
  contactPhone: string;
  notes?: string;
  lang?: 'mg' | 'fr';
}

/**
 * Normalizes phone number into international digits only (e.g. "261340000000").
 * Strips '+', spaces, dashes, dots.
 * Converts local Malagasy format 034XXXXXXX to 26134XXXXXXX if starts with 0.
 */
export function normalizeWhatsAppNumber(rawNumber: string): string {
  if (!rawNumber) return '';
  let digits = rawNumber.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '261' + digits.substring(1);
  }
  return digits;
}

/**
 * Validates customer contact phone number.
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Generates the standardized WhatsApp order message in Malagasy or French.
 */
export function generateWhatsAppMessage(order: OrderFormData): string {
  const totalPrice = order.unitPrice * order.quantity;
  const isFr = order.lang === 'fr';
  const notesLine =
    order.notes && order.notes.trim() ? order.notes.trim() : isFr ? 'Aucune' : 'Tsy misy';

  if (isFr) {
    return `BOX WIFI – POCKET WIFI

NOUVELLE COMMANDE

Produit: ${order.productName}
Prix unitaire: ${formatAriary(order.unitPrice)}
Quantité: ${order.quantity}
Nom du client: ${order.customerName.trim()}
Lieu de livraison: ${order.deliveryLocation.trim()}
Numéro de contact: ${order.contactPhone.trim()}
Notes: ${notesLine}

TOTAL ESTIMÉ: ${formatAriary(totalPrice)}`;
  }

  return `BOX WIFI – POCKET WIFI

COMMANDE VAOVAO

Produit: ${order.productName}
Vidiny isaky ny iray: ${formatAriary(order.unitPrice)}
Isan'ny produit: ${order.quantity}
Anarana: ${order.customerName.trim()}
Toerana andefasana azy: ${order.deliveryLocation.trim()}
Laharana afaka iantsoana: ${order.contactPhone.trim()}
Notes: ${notesLine}

TOTALIN'NY TOMBANA: ${formatAriary(totalPrice)}`;
}

/**
 * Builds the direct WhatsApp click-to-chat URL (https://wa.me/NUMBER?text=...).
 */
export function buildWhatsAppOrderUrl(whatsappNumber: string, order: OrderFormData): {
  url: string | null;
  error?: string;
} {
  const cleanedNumber = normalizeWhatsAppNumber(whatsappNumber);
  if (!cleanedNumber || cleanedNumber.length < 8) {
    return {
      url: null,
      error:
        order.lang === 'fr'
          ? 'Le numéro WhatsApp de l\'entreprise n\'est pas encore configuré.'
          : 'Mbola tsy voapetraka na tsy mety ny laharana WhatsApp an\'ny orinasa.',
    };
  }

  const message = generateWhatsAppMessage(order);
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanedNumber}?text=${encodedText}`;

  return { url };
}
