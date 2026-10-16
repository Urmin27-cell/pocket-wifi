import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
import { AdminUser } from '../types';

const BOOTSTRAPPED_ADMIN_EMAIL = 'boutiquemevasoa@gmail.com';

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists() && adminDoc.data()?.role === 'admin';
  } catch (err) {
    console.warn('Fanamarihana admin:', err);
    return false;
  }
}

export async function registerAdminDoc(user: User): Promise<void> {
  try {
    await setDoc(doc(db, 'admins', user.uid), {
      email: user.email,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Tsy afaka nosoratana ny admin doc:', err);
  }
}

export async function loginWithGoogle(): Promise<AdminUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const isAdmin = await checkIsAdmin(result.user);
  if (isAdmin) {
    await registerAdminDoc(result.user);
  }
  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    isAdmin,
  };
}

export async function loginWithEmail(email: string, pass: string): Promise<AdminUser> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const isAdmin = await checkIsAdmin(result.user);
  if (isAdmin) {
    await registerAdminDoc(result.user);
  }
  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    isAdmin,
  };
}

export async function createAdminAccount(email: string, pass: string): Promise<AdminUser> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await registerAdminDoc(result.user);
  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    isAdmin: true,
  };
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null, isAdmin: boolean) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isAdmin = await checkIsAdmin(user);
      callback(user, isAdmin);
    } else {
      callback(null, false);
    }
  });
}
