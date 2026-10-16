import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DEFAULT_PIN = '123456789000';
const PIN_DOC_PATH = 'siteSettings/security';
const PIN_SALT = 'BOX_WIFI_MG_2026_SECRET_SALT_';
const SESSION_STORAGE_KEY = 'boxwifi_admin_pin_authenticated';

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 */
export async function hashPin(pin: string): Promise<string> {
  const salted = PIN_SALT + pin;
  const msgUint8 = new TextEncoder().encode(salted);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if entered PIN is correct.
 * Checks Firestore doc `siteSettings/security`, falls back to DEFAULT_PIN `123456789000`.
 */
export async function verifyAdminPin(enteredPin: string): Promise<boolean> {
  if (!enteredPin) return false;

  const enteredHash = await hashPin(enteredPin.trim());

  try {
    const docRef = doc(db, 'siteSettings', 'security');
    const snap = await getDoc(docRef);

    if (snap.exists() && snap.data()?.pinHash) {
      return snap.data().pinHash === enteredHash;
    }

    // Default PIN fallback if not yet initialized in Firestore
    const defaultHash = await hashPin(DEFAULT_PIN);
    if (enteredHash === defaultHash) {
      // Auto-initialize the security doc in background
      try {
        await setDoc(docRef, {
          pinHash: defaultHash,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // Ignore if permission prevented write before admin auth
      }
      return true;
    }

    return false;
  } catch (err) {
    console.warn('Fanamarihana teo am-panamarinana PIN:', err);
    // Offline or initial fallback
    const defaultHash = await hashPin(DEFAULT_PIN);
    return enteredHash === defaultHash;
  }
}

/**
 * Updates the admin secret PIN code.
 */
export async function updateAdminPin(
  currentPin: string,
  newPin: string
): Promise<{ success: boolean; error?: string }> {
  const isCurrentValid = await verifyAdminPin(currentPin);
  if (!isCurrentValid) {
    return {
      success: false,
      error: 'Diso ny Code PIN taloha nampidirinao.',
    };
  }

  if (!newPin || newPin.trim().length < 6) {
    return {
      success: false,
      error: 'Farafahakeliny 6 tarehimarika ny Code PIN vaovao.',
    };
  }

  try {
    const newHash = await hashPin(newPin.trim());
    const docRef = doc(db, 'siteSettings', 'security');
    await setDoc(
      docRef,
      {
        pinHash: newHash,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Tsy nahomby ny fanovana ny Code PIN.',
    };
  }
}

export function isPinSessionValid(): boolean {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPinSessionValid(): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
}

export function clearPinSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
