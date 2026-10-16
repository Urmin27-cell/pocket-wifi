import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: Passing firestoreDatabaseId is mandatory for AI Studio Firestore */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'siteSettings', 'general'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Fanamarihana: Mbola offline ny Firebase connection.");
    }
    return false;
  }
}
