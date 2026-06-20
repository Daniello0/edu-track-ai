import { DEFAULT_API_PORT } from '../constants/app.constants';

/** Firebase Web SDK configuration from Vite env. */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId: string;
}

/**
 * Resolves the backend API base URL for axios and dev proxy configuration.
 */
export function getApiBaseUrl(): string {
  return (
    import.meta.env.VITE_API_BASE_URL ?? `http://localhost:${DEFAULT_API_PORT}`
  );
}

/**
 * Reads Firebase Web SDK config from Vite environment variables.
 */
export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  };
}
