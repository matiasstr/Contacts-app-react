import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
} from 'firebase/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function isFirebaseConfigured() {
  return Object.values(firebaseConfig).every(Boolean);
}

export function shouldUseFirebaseAuth() {
  return import.meta.env.VITE_AUTH_MODE !== 'local' && isFirebaseConfigured();
}

async function getFirebaseAuth() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    await setPersistence(auth, inMemoryPersistence);
  }

  return auth!;
}

export async function loginWithFirebase(email: string, password: string) {
  const firebaseAuth = await getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const token = await credential.user.getIdToken();

  return {
    token,
    firebaseUid: credential.user.uid,
    email: credential.user.email || email,
    displayName: credential.user.displayName || undefined,
    photoUrl: credential.user.photoURL || undefined,
  };
}

export async function registerWithFirebase(email: string, password: string, displayName: string) {
  const firebaseAuth = await getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  const token = await credential.user.getIdToken();

  return {
    token,
    firebaseUid: credential.user.uid,
    email: credential.user.email || email,
    displayName,
    photoUrl: credential.user.photoURL || undefined,
  };
}

export async function logoutFirebase() {
  if (auth) {
    await signOut(auth);
  }
}
