export interface CompressedImage {
  dataUrl: string; // Base64 Data URL
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  originalSizeBytes?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: 'MGA';
  images: CompressedImage[];
  category: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline?: string;
  whatsappNumber: string; // e.g. "261340000000" (no +, no spaces)
  phone?: string;
  email?: string;
  address?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string; // Base64 dataUrl
  announcementText?: string;
  announcementActive?: boolean;
  facebookUrl?: string;
  footerText?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | 'Tsy mbola nalefa'
  | 'Nomanina halefa amin\'ny WhatsApp'
  | 'Voamarina avy amin\'ny orinasa'
  | 'Efa vita'
  | 'Nofoanana';

export interface Order {
  id: string;
  productName: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  customerName: string;
  deliveryLocation: string;
  contactPhone: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}
