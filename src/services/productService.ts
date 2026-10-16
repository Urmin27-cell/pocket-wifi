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
import { INITIAL_PRODUCTS } from './seedData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const CACHED_PRODUCTS_KEY = 'boxwifi_cached_products';
const PRODUCTS_SEEDED_KEY = 'boxwifi_products_seeded';

const DEMO_IDS = new Set([
  'prod_huawei_e5577',
  'prod_zte_mf920u',
  'prod_netgear_m1',
  'prod_tplink_m7350',
  'prod_cpe_4g',
  'prod_batterie_3000'
]);

export function getLocalCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(CACHED_PRODUCTS_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return items.filter((p: Product) => !DEMO_IDS.has(p.id));
  } catch {
    return [];
  }
}

export function updateLocalCachedProducts(items: Product[]): void {
  try {
    const cleanItems = items.filter((p) => !DEMO_IDS.has(p.id));
    localStorage.setItem(CACHED_PRODUCTS_KEY, JSON.stringify(cleanItems));
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

    const firestoreItems: Product[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as Product;
      if (!DEMO_IDS.has(d.id)) {
        firestoreItems.push({ ...data, id: d.id });
      }
    });

    const mergedMap = new Map<string, Product>();
    localItems.forEach((p) => {
      if (!DEMO_IDS.has(p.id)) mergedMap.set(p.id, p);
    });
    firestoreItems.forEach((p) => {
      if (DEMO_IDS.has(p.id)) return;
      const existing = mergedMap.get(p.id);
      if (existing) {
        const tLocal = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
        const tRemote = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        if (tLocal > tRemote) {
          mergedMap.set(p.id, existing);
        } else {
          mergedMap.set(p.id, p);
        }
      } else {
        mergedMap.set(p.id, p);
      }
    });

    let items = Array.from(mergedMap.values()).filter((p) => !DEMO_IDS.has(p.id));

    items.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    updateLocalCachedProducts(items);

    return items.filter((p) => includeInactive || p.isActive);
  } catch (error) {
    console.warn('Fampahatsiahivana: Tsy afaka nalaina tao amin\'ny Firestore ny vokatra, mampiasa cache:', error);
    if (localItems.length > 0) {
      return localItems.filter((p) => !DEMO_IDS.has(p.id) && (includeInactive || p.isActive));
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
  const id = existingId || ('prod_' + Date.now());
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
    localStorage.setItem(PRODUCTS_SEEDED_KEY, 'true');
  } catch {
    // Ignore
  }

  // Dispatch event so any open components refresh immediately
  try {
    window.dispatchEvent(new CustomEvent('boxwifi_products_updated', { detail: { action: 'save', product: payload } }));
  } catch {
    // Ignore
  }

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
  if (!id) return;

  // Update local cache
  const local = getLocalCachedProducts().filter((p) => p.id !== id);
  updateLocalCachedProducts(local);
  try {
    localStorage.setItem(PRODUCTS_SEEDED_KEY, 'true');
  } catch {
    // Ignore
  }

  // Dispatch event
  try {
    window.dispatchEvent(new CustomEvent('boxwifi_products_updated', { detail: { action: 'delete', id } }));
  } catch {
    // Ignore
  }

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
