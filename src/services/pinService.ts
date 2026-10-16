import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DEFAULT_PIN = '123456789000';
const PIN_SALT = 'BOX_WIFI_MG_2026_SECRET_SALT_';
const SESSION_STORAGE_KEY = 'boxwifi_admin_pin_authenticated';
const CACHED_PIN_HASH_KEY = 'boxwifi_cached_pin_hash';

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 */
export async function hashPin(pin: string): Promise<string> {
  const salted = PIN_SALT + pin.trim();
  const msgUint8 = new TextEncoder().encode(salted);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if entered PIN is correct.
 * Checks Firestore doc `siteSettings/security`, local cache, and DEFAULT_PIN fallback.
 */
export async function verifyAdminPin(enteredPin: string): Promise<boolean> {
  if (!enteredPin) return false;

  const enteredHash = await hashPin(enteredPin);
  const defaultHash = await hashPin(DEFAULT_PIN);

  // Check local cache first
  try {
    const cachedHash = localStorage.getItem(CACHED_PIN_HASH_KEY);
    if (cachedHash && enteredHash === cachedHash) {
      return true;
    }
  } catch {
    // Ignore
  }

  try {
    const docRef = doc(db, 'siteSettings', 'security');
    const snap = await getDoc(docRef);

    if (snap.exists() && snap.data()?.pinHash) {
      const dbHash = snap.data().pinHash;
      try {
        localStorage.setItem(CACHED_PIN_HASH_KEY, dbHash);
      } catch {
        // Ignore
      }
      return dbHash === enteredHash;
    }

    // Default PIN fallback if not yet set in Firestore
    if (enteredHash === defaultHash) {
      // Auto-initialize security doc
      try {
        await setDoc(
          docRef,
          {
            pinHash: defaultHash,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch {
        // Ignore
      }
      return true;
    }

    return false;
  } catch (err) {
    console.warn('Fanamarihana teo am-panamarinana PIN avy amin\'ny Firestore:', err);
    // Offline or fallback to local cache or default PIN
    try {
      const cachedHash = localStorage.getItem(CACHED_PIN_HASH_KEY);
      if (cachedHash) {
        return enteredHash === cachedHash;
      }
    } catch {
      // Ignore
    }
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

    // Update local cache immediately
    try {
      localStorage.setItem(CACHED_PIN_HASH_KEY, newHash);
    } catch {
      // Ignore
    }

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
    console.error('Hadisoana teo am-panovana PIN:', err);
    // Even if firestore threw an error, local cache has it
    return {
      success: true,
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
