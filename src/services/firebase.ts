import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyASutgbBiEaDg0fWRavedr2-MoAAS7IXz0",
  authDomain: "thrift-crew.firebaseapp.com",
  projectId: "thrift-crew",
  storageBucket: "thrift-crew.firebasestorage.app",
  messagingSenderId: "627561319109",
  appId: "1:627561319109:web:10a818cb9db373d7963eac",
  measurementId: "G-W67XX3S453"
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export const isFirebaseConfigured = !!(firebaseConfig && firebaseConfig.apiKey);

let app;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { db, auth };

export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Google Authentication
export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not fully configured yet. Please complete Firebase setup in the AI Studio settings.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// User Sign Out
export async function logoutUser() {
  if (auth) {
    await signOut(auth);
  }
}

// Profile Persistence Helper with Error Handling
export async function saveUserProfile(user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null }) {
  if (!isFirebaseConfigured || !db) return;
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// Profile Retrieval Proxy
export async function getUserProfile(uid: string) {
  if (!isFirebaseConfigured || !db) return null;
  const userPath = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }
}
