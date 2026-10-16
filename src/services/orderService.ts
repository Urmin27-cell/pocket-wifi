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

export async function createOrder(
  orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const id = 'cmd_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  const path = `${ORDERS_COLLECTION}/${id}`;

  const payload: Order = {
    ...orderData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, ORDERS_COLLECTION, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => {
      list.push({ ...(d.data() as Order), id: d.id });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
