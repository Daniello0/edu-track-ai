import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  getFirebaseConfig,
  type FirebaseConfig,
} from '../../common/utils/env.utils';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

/**
 * Validates that all required Firebase Web SDK config fields are present.
 */
export function assertFirebaseConfig(config: FirebaseConfig): void {
  const missingKeys = (
    Object.entries(config) as Array<[keyof FirebaseConfig, string]>
  )
    .filter(([, value]) => value.trim().length === 0)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase config values: ${missingKeys.join(', ')}`,
    );
  }
}

/**
 * Initializes the Firebase app singleton (idempotent).
 */
export function initializeFirebaseApp(
  config: FirebaseConfig = getFirebaseConfig(),
): FirebaseApp {
  assertFirebaseConfig(config);

  if (firebaseApp !== null) {
    return firebaseApp;
  }

  const existingApps = getApps();
  firebaseApp =
    existingApps.length > 0 ? existingApps[0]! : initializeApp(config);

  return firebaseApp;
}

/**
 * Returns the Firebase Auth instance, initializing the app if needed.
 */
export function getFirebaseAuthInstance(
  config: FirebaseConfig = getFirebaseConfig(),
): Auth {
  if (firebaseAuth !== null) {
    return firebaseAuth;
  }

  const app = initializeFirebaseApp(config);
  firebaseAuth = getAuth(app);

  return firebaseAuth;
}

/** Resets module-level singletons (for tests only). */
export function resetFirebaseInitForTests(): void {
  firebaseApp = null;
  firebaseAuth = null;
}
