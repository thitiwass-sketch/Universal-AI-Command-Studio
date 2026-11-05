import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfigData) : getApp();

export const auth = getAuth(app);
export const db =
  firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
    : getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot per Firebase skill guidelines
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
    return false;
  }
}

// User Profile Service
export interface UserProfileData {
  userId: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  defaultMode?: string;
  language?: 'th' | 'en';
  createdAt?: string;
  updatedAt?: string;
}

export async function syncUserProfile(user: User): Promise<UserProfileData> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const profileData: UserProfileData = {
    userId: user.uid,
    email: user.email || 'anonymous@user',
    displayName: user.displayName || (user.isAnonymous ? 'Guest Scholar' : 'User'),
    photoURL: user.photoURL || null,
    updatedAt: new Date().toISOString()
  };

  if (!snap.exists()) {
    profileData.createdAt = new Date().toISOString();
    profileData.defaultMode = 'AUTO GENERAL';
    profileData.language = 'th';
    await setDoc(userRef, profileData);
  } else {
    await setDoc(userRef, profileData, { merge: true });
  }

  return { ...snap.data(), ...profileData } as UserProfileData;
}

// Execution Records
export interface SavedExecution {
  id?: string;
  userId: string;
  prompt: string;
  command: string;
  autoMode: string;
  output: string;
  qaScore: number;
  qaStatus: string;
  createdAt: string;
}

export async function saveExecutionToFirestore(data: Omit<SavedExecution, 'id'>): Promise<string> {
  const colRef = collection(db, 'users', data.userId, 'executions');
  const docRef = await addDoc(colRef, data);
  return docRef.id;
}

export async function getUserExecutions(userId: string, count: number = 20): Promise<SavedExecution[]> {
  try {
    const colRef = collection(db, 'users', userId, 'executions');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedExecution));
  } catch (err) {
    console.warn('Could not fetch user executions:', err);
    return [];
  }
}

export async function deleteExecutionFromFirestore(userId: string, executionId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'executions', executionId);
  await deleteDoc(docRef);
}

// Favorites Service
export interface FavoriteItem {
  commandId: string;
  userId: string;
  canonical: string;
  title: string;
  category: string;
  createdAt: string;
}

export async function toggleFavoriteInFirestore(userId: string, cmd: { canonical: string; title: string; category: string }): Promise<boolean> {
  const cleanId = cmd.canonical.replace(/[^a-zA-Z0-9_-]/g, '_');
  const docRef = doc(db, 'users', userId, 'favorites', cleanId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    await deleteDoc(docRef);
    return false; // Removed
  } else {
    await setDoc(docRef, {
      commandId: cleanId,
      userId,
      canonical: cmd.canonical,
      title: cmd.title,
      category: cmd.category,
      createdAt: new Date().toISOString()
    });
    return true; // Added
  }
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  try {
    const colRef = collection(db, 'users', userId, 'favorites');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data().canonical as string);
  } catch (err) {
    console.warn('Could not fetch favorites:', err);
    return [];
  }
}

// Authentication Actions
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(result.user);
  return result.user;
}

export async function loginAsGuest(): Promise<User> {
  const result = await signInAnonymously(auth);
  await syncUserProfile(result.user);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
