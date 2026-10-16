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

export async function getProducts(includeInactive: boolean = false): Promise<Product[]> {
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

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { ...(snap.data() as Product), id: snap.id };
  } catch (error) {
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

  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const list: Category[] = [];
    snapshot.forEach((d) => {
      list.push({ ...(d.data() as Category), id: d.id });
    });
    return list;
  } catch (error) {
    console.warn('Tsy afaka nalaina ny sokajy:', error);
    return [
      { id: 'cat-4g', name: 'Pocket WiFi 4G LTE', slug: 'pocket-wifi-4g' },
      { id: 'cat-5g', name: 'Pocket WiFi 5G Ultra', slug: 'pocket-wifi-5g' },
      { id: 'cat-router', name: 'Router Portable & CPE', slug: 'router-portable' },
      { id: 'cat-acc', name: 'Batteries & Kojakoja', slug: 'kojakoja' },
    ];
  }
}
