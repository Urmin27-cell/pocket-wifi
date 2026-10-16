import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import { Product, Category } from '../types';
import { isDocumentWithinSafeLimit, formatBytes } from './imageCompressionService';
import { createSlug } from '../utils/formatters';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const CACHED_PRODUCTS_KEY = 'boxwifi_cached_products';

function getLocalCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(CACHED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function updateLocalCachedProducts(items: Product[]): void {
  try {
    localStorage.setItem(CACHED_PRODUCTS_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage limit
  }
}

export async function getProducts(includeInactive: boolean = false): Promise<Product[]> {
  const localItems = getLocalCachedProducts();

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    let snapshot;
    try {
      const q = query(colRef, orderBy('createdAt', 'desc'));
      snapshot = await getDocs(q);
    } catch {
      snapshot = await getDocs(colRef);
    }

    const items: Product[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as Product;
      if (includeInactive || data.isActive) {
        items.push({ ...data, id: d.id });
      }
    });

    items.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    if (items.length > 0) {
      updateLocalCachedProducts(items);
      return items;
    }

    // If Firestore has no items yet, fallback to local cached if available
    if (localItems.length > 0) {
      return localItems.filter((p) => includeInactive || p.isActive);
    }

    return [];
  } catch (error) {
    console.warn('Fampahatsiahivana: Tsy afaka nalaina tao amin\'ny Firestore ny vokatra, mampiasa cache:', error);
    if (localItems.length > 0) {
      return localItems.filter((p) => includeInactive || p.isActive);
    }
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const local = getLocalCachedProducts().find((p) => p.id === id);
      return local || null;
    }
    return { ...(snap.data() as Product), id: snap.id };
  } catch (error) {
    const local = getLocalCachedProducts().find((p) => p.id === id);
    if (local) return local;
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveProduct(product: Omit<Product, 'id'>, existingId?: string): Promise<string> {
  const id = existingId || 'prod_' + Date.now();
  const path = `${PRODUCTS_COLLECTION}/${id}`;

  const payload: Product = {
    ...product,
    id,
    slug: product.slug || createSlug(product.name),
    createdAt: (product as any).createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Strict Firestore Document Size Check (Must be under 700 KiB)
  const sizeCheck = isDocumentWithinSafeLimit(payload as unknown as Record<string, unknown>);
  if (!sizeCheck.safe) {
    throw new Error(
      `Lehibe loatra ny angon'ny vokatra (${sizeCheck.formattedSize}). Ny fetra azo antoka ho an'ny Firestore dia ${formatBytes(
        sizeCheck.limitBytes
      )}. Mba ahenao ny isan'ny sary na ampiasao sary kely kokoa azafady.`
    );
  }

  // Update local cache immediately
  const local = getLocalCachedProducts();
  const existingIdx = local.findIndex((p) => p.id === id);
  if (existingIdx >= 0) {
    local[existingIdx] = payload;
  } else {
    local.unshift(payload);
  }
  updateLocalCachedProducts(local);

  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, id), payload);
    return id;
  } catch (error) {
    console.error('Hadisoana teo am-pitahirizana vokatra ao amin\'ny Firestore:', error);
    // Still succeeded in local storage
    return id;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  // Update local cache
  const local = getLocalCachedProducts().filter((p) => p.id !== id);
  updateLocalCachedProducts(local);

  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Hadisoana teo am-pamafana vokatra ao amin\'ny Firestore:', error);
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const list: Category[] = [];
    snapshot.forEach((d) => {
      list.push({ ...(d.data() as Category), id: d.id });
    });
    if (list.length > 0) return list;
  } catch (error) {
    console.warn('Tsy afaka nalaina ny sokajy avy amin\'ny Firestore:', error);
  }

  return [
    { id: 'cat-4g', name: 'Pocket WiFi 4G LTE', slug: 'pocket-wifi-4g' },
    { id: 'cat-5g', name: 'Pocket WiFi 5G Ultra', slug: 'pocket-wifi-5g' },
    { id: 'cat-router', name: 'Router Portable & CPE', slug: 'router-portable' },
    { id: 'cat-acc', name: 'Batteries & Kojakoja', slug: 'kojakoja' },
  ];
}
