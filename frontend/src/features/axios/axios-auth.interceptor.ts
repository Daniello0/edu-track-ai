import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AUTH_API_ROUTES } from '../auth/auth.constants';
import { refreshAuthSession } from '../auth/auth.service';
import type { AuthRefreshResponse } from '../auth/auth.types';
import { HTTP_STATUS_UNAUTHORIZED } from './axios.constants';
import { getApiClient } from './axios.client';

/** Callbacks used to read and update auth state during token refresh. */
export interface AxiosAuthHandlers {
  getRefreshToken: () => string | null;
  onSessionRefreshed: (session: AuthRefreshResponse) => void;
  onSessionExpired: () => void;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _authRetried?: boolean;
}

// WARNING! Global let-values – very bad practice.
// FIXME: Maybe make a class/object.
let handlers: AxiosAuthHandlers | null = null;
let refreshPromise: Promise<AuthRefreshResponse | null> | null = null;
let isInterceptorRegistered = false;

/**
 * Registers a response interceptor that refreshes JWT on 401 and retries once.
 */
export function setupAxiosAuthInterceptor(
  authHandlers: AxiosAuthHandlers,
): void {
  handlers = authHandlers;

  if (isInterceptorRegistered) {
    return;
  }

  isInterceptorRegistered = true;
  getApiClient().interceptors.response.use(
    (response) => response,
    (error: AxiosError) => handleUnauthorized(error),
  );
}

/**
 * Clears interceptor state (used in unit tests).
 */
export function resetAxiosAuthInterceptorForTests(): void {
  handlers = null;
  refreshPromise = null;
  isInterceptorRegistered = false;
}

async function handleUnauthorized(error: AxiosError): Promise<unknown> {
  const config = error.config as RetriableRequestConfig | undefined;

  if (!shouldRetryUnauthorized(error, config)) {
    return Promise.reject(error);
  }

  const accessToken = await resolveRefreshedAccessToken();
  if (accessToken === null) {
    return Promise.reject(error);
  }

  config!._authRetried = true;
  config!.headers.Authorization = `Bearer ${accessToken}`;
  return getApiClient().request(config!);
}

function shouldRetryUnauthorized(
  error: AxiosError,
  config: RetriableRequestConfig | undefined,
): config is RetriableRequestConfig {
  return (
    error.response?.status === HTTP_STATUS_UNAUTHORIZED &&
    config !== undefined &&
    config._authRetried !== true &&
    !isAuthEndpoint(config.url) &&
    handlers !== null
  );
}

function isAuthEndpoint(url?: string): boolean {
  if (url === undefined) {
    return false;
  }

  return (
    url.includes(AUTH_API_ROUTES.SESSION) ||
    url.includes(AUTH_API_ROUTES.REFRESH) ||
    url.includes(AUTH_API_ROUTES.LOGOUT)
  );
}

async function resolveRefreshedAccessToken(): Promise<string | null> {
  if (handlers === null) {
    return null;
  }

  const refreshToken = handlers.getRefreshToken();
  if (refreshToken === null) {
    handlers.onSessionExpired();
    return null;
  }

  const session = await getOrCreateRefreshPromise(refreshToken);
  if (session === null) {
    handlers.onSessionExpired();
    return null;
  }

  return session.accessToken;
}

async function getOrCreateRefreshPromise(
  refreshToken: string,
): Promise<AuthRefreshResponse | null> {
  if (refreshPromise !== null) {
    return refreshPromise;
  }

  refreshPromise = refreshAuthSession(refreshToken)
    .then((session) => {
      handlers?.onSessionRefreshed(session);
      return session;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
