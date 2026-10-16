import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import { Order, OrderStatus } from '../types';

const ORDERS_COLLECTION = 'orders';
const CACHED_ORDERS_KEY = 'boxwifi_cached_orders';

function getLocalCachedOrders(): Order[] {
  try {
    const raw = localStorage.getItem(CACHED_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function updateLocalCachedOrders(items: Order[]): void {
  try {
    localStorage.setItem(CACHED_ORDERS_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const id = 'cmd_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  const payload: Order = {
    ...orderData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const local = getLocalCachedOrders();
  local.unshift(payload);
  updateLocalCachedOrders(local);

  try {
    await setDoc(doc(db, ORDERS_COLLECTION, id), payload);
    return id;
  } catch (error) {
    console.warn('Fampahatsiahivana Firestore order write:', error);
    return id;
  }
}

export async function getOrders(): Promise<Order[]> {
  const local = getLocalCachedOrders();
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => {
      list.push({ ...(d.data() as Order), id: d.id });
    });
    if (list.length > 0) {
      updateLocalCachedOrders(list);
      return list;
    }
    return local;
  } catch (error) {
    console.warn('Fampahatsiahivana: Tsy afaka nalaina tao amin\'ny Firestore ny commande, mampiasa cache:', error);
    return local;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const local = getLocalCachedOrders();
  const found = local.find((o) => o.id === orderId);
  if (found) {
    found.status = status;
    found.updatedAt = new Date().toISOString();
    updateLocalCachedOrders(local);
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Fampahatsiahivana Firestore update order status:', error);
  }
}
