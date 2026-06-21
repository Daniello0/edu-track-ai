import type { FirebaseConfig } from './env.utils';

/** Substrings that indicate placeholder values copied from `.env.example`. */
export const FIREBASE_ENV_PLACEHOLDER_MARKERS = [
  'your-firebase-api-key',
  'your-project',
  'your-firebase-app-id',
  'your-messaging-sender-id',
] as const;

/**
 * Returns true when Firebase config still contains `.env.example` placeholders.
 */
export function isPlaceholderFirebaseConfig(config: FirebaseConfig): boolean {
  const serialized = JSON.stringify(config).toLowerCase();

  return FIREBASE_ENV_PLACEHOLDER_MARKERS.some((marker) =>
    serialized.includes(marker),
  );
}
