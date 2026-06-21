import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { getFirebaseAuthInstance } from './firebase.init';

/**
 * Signs in with Google popup and returns a Firebase ID token.
 */
export async function signInWithGoogle(): Promise<string> {
  const auth = getFirebaseAuthInstance();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);

  return getIdTokenFromCredential(credential);
}

/**
 * Signs in with email and password and returns a Firebase ID token.
 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<string> {
  const auth = getFirebaseAuthInstance();
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return getIdTokenFromCredential(credential);
}

/**
 * Registers a user with email and password and returns a Firebase ID token.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<string> {
  const auth = getFirebaseAuthInstance();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return getIdTokenFromCredential(credential);
}

/**
 * Signs out from Firebase Auth (client-side).
 */
export async function signOutFromFirebase(): Promise<void> {
  const auth = getFirebaseAuthInstance();
  await signOut(auth);
}

async function getIdTokenFromCredential(
  credential: UserCredential,
): Promise<string> {
  const idToken = await credential.user.getIdToken();
  if (idToken.length === 0) {
    throw new Error('Firebase ID token is empty');
  }

  return idToken;
}
