import { getApiClient } from '../axios/axios.client';
import { AUTH_API_ROUTES } from './auth.constants';
import type {
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthSessionRequest,
  AuthSessionResponse,
} from './auth.types';

const apiClient = getApiClient();

/**
 * Exchanges a Firebase ID token for API access and refresh tokens.
 */
export async function createAuthSession(
  idToken: string,
): Promise<AuthSessionResponse> {
  const payload: AuthSessionRequest = { idToken };
  const response = await apiClient.post<AuthSessionResponse>(
    AUTH_API_ROUTES.SESSION,
    payload,
  );

  return response.data;
}

/**
 * Rotates refresh token and returns a new token pair.
 */
export async function refreshAuthSession(
  refreshToken: string,
): Promise<AuthRefreshResponse> {
  const payload: AuthRefreshRequest = { refreshToken };
  const response = await apiClient.post<AuthRefreshResponse>(
    AUTH_API_ROUTES.REFRESH,
    payload,
  );

  return response.data;
}

/**
 * Revokes refresh token on the backend (logout).
 */
export async function logoutAuthSession(refreshToken: string): Promise<void> {
  const payload: AuthLogoutRequest = { refreshToken };
  await apiClient.post<void>(AUTH_API_ROUTES.LOGOUT, payload);
}
