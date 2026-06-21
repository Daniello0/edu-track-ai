import * as yup from 'yup';
import { AuthMode } from '../../common/enums/auth-mode.enum';
import { AUTH_SESSION_STORAGE_KEY } from './auth.constants';
import { authFormSchema } from './auth.schema';
import type {
  AuthFormValues,
  AuthSessionResponse,
  AuthStorePayload,
  StoredAuthSession,
} from './auth.types';

/**
 * Maps a successful session API response to Zustand user/auth slices.
 */
export function mapSessionResponseToStorePayload(
  response: AuthSessionResponse,
): AuthStorePayload {
  return {
    user: {
      id: response.user.id,
      email: response.user.email,
    },
    auth: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  };
}

/**
 * Persists auth session to localStorage for page reload recovery.
 */
export function persistAuthSession(session: StoredAuthSession): void {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Reads persisted auth session from localStorage, or null if absent/invalid.
 */
export function readPersistedAuthSession(): StoredAuthSession | null {
  const validated: string | null = getStorageKeyOrThrow(
    AUTH_SESSION_STORAGE_KEY,
  );
  if (validated === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(validated) as StoredAuthSession;
    if (!isValidStoredAuthSession(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Removes persisted auth session from localStorage.
 */
export function clearPersistedAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

/**
 * Validates auth form values and returns the first error message, if any.
 */
export async function validateAuthForm(
  values: AuthFormValues,
  _mode: AuthMode = AuthMode.SIGN_IN,
): Promise<string | null> {
  void _mode;

  try {
    await authFormSchema.validate(values, { abortEarly: true });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }

    throw error;
  }
}

function isValidStoredAuthSession(value: StoredAuthSession): boolean {
  return (
    typeof value.accessToken === 'string' &&
    typeof value.refreshToken === 'string' &&
    typeof value.user?.id === 'string' &&
    typeof value.user?.email === 'string'
  );
}

function getStorageKeyOrThrow(key: string): string | null {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  return raw;
}
