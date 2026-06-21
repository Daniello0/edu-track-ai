import type {
  AuthSessionResponse,
  AuthStorePayload,
  StoredAuthSession,
} from './auth.types';

/** Sample auth session response for unit tests. */
export const MOCK_AUTH_SESSION_RESPONSE: AuthSessionResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
  },
};

/** Sample persisted auth session for unit tests. */
export const MOCK_STORED_AUTH_SESSION: StoredAuthSession = {
  accessToken: MOCK_AUTH_SESSION_RESPONSE.accessToken,
  refreshToken: MOCK_AUTH_SESSION_RESPONSE.refreshToken,
  user: MOCK_AUTH_SESSION_RESPONSE.user,
};

/** Expected store payload mapped from {@link MOCK_AUTH_SESSION_RESPONSE}. */
export const MOCK_AUTH_STORE_PAYLOAD: AuthStorePayload = {
  user: {
    id: MOCK_AUTH_SESSION_RESPONSE.user.id,
    email: MOCK_AUTH_SESSION_RESPONSE.user.email,
  },
  auth: {
    accessToken: MOCK_AUTH_SESSION_RESPONSE.accessToken,
    refreshToken: MOCK_AUTH_SESSION_RESPONSE.refreshToken,
  },
};

/** Sample Firebase ID token for unit tests. */
export const MOCK_FIREBASE_ID_TOKEN = 'mock-firebase-id-token';
