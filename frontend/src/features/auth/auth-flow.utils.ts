import { AuthMode } from '../../common/enums/auth-mode.enum';
import {
  clearPendingMaterial,
  readPendingMaterial,
} from '../../common/utils/pending-material.utils';
import { claimPendingMaterial } from '../library/library.service';
import { createAuthSession, logoutAuthSession } from './auth.service';
import type { AuthFormValues, AuthSessionResponse } from './auth.types';
import {
  signInWithEmail,
  signInWithGoogle,
  signOutFromFirebase,
  signUpWithEmail,
} from './firebase-auth.service';
import { initializeFirebaseApp } from './firebase.init';

/** Store callbacks used during auth orchestration. */
export interface AuthFlowHandlers {
  setAuthSession: (session: AuthSessionResponse) => void;
  clearAuth: () => void;
  markReaderPersisted: (materialId: string) => void;
}

/**
 * Initializes Firebase Web SDK before any client auth operation.
 */
export function ensureFirebaseInitialized(): void {
  initializeFirebaseApp();
}

/**
 * Signs in or registers with email/password and creates an API session.
 */
export async function authenticateWithEmail(
  values: AuthFormValues,
  mode: AuthMode,
  handlers: AuthFlowHandlers,
): Promise<void> {
  ensureFirebaseInitialized();

  const idToken =
    mode === AuthMode.SIGN_UP
      ? await signUpWithEmail(values.email.trim(), values.password)
      : await signInWithEmail(values.email.trim(), values.password);

  await completeSession(idToken, handlers);
}

/**
 * Signs in with Google popup and creates an API session.
 */
export async function authenticateWithGoogle(
  handlers: AuthFlowHandlers,
): Promise<void> {
  ensureFirebaseInitialized();
  const idToken = await signInWithGoogle();
  await completeSession(idToken, handlers);
}

/**
 * Revokes refresh token, clears local session, and signs out from Firebase.
 */
export async function performLogout(
  refreshToken: string | null,
  handlers: Pick<AuthFlowHandlers, 'clearAuth'>,
): Promise<void> {
  if (refreshToken !== null) {
    try {
      await logoutAuthSession(refreshToken);
    } catch {
      // Local session is cleared even when the API call fails.
    }
  }

  handlers.clearAuth();

  try {
    ensureFirebaseInitialized();
    await signOutFromFirebase();
  } catch {
    // Firebase may be unavailable; local logout still succeeded.
  }
}

async function completeSession(
  idToken: string,
  handlers: AuthFlowHandlers,
): Promise<void> {
  const session = await createAuthSession(idToken);
  handlers.setAuthSession(session);
  await tryClaimPendingMaterial(session.accessToken, handlers);
}

async function tryClaimPendingMaterial(
  accessToken: string,
  handlers: AuthFlowHandlers,
): Promise<void> {
  const pendingId = readPendingMaterial()?.pendingId;
  if (pendingId === undefined || pendingId.length === 0) {
    return;
  }

  const summary = await claimPendingMaterial(pendingId, accessToken);
  clearPendingMaterial();
  handlers.markReaderPersisted(summary.id);
}

/**
 * Returns true when both user id and access token are present.
 */
export function isAuthenticated(
  userId: string | null,
  accessToken: string | null,
): boolean {
  return userId !== null && accessToken !== null;
}
