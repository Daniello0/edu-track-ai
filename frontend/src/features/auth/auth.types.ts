/** Authenticated user summary from POST /api/auth/session. */
export interface AuthUser {
  id: string;
  email: string;
}

/** Payload for POST /api/auth/session. */
export interface AuthSessionRequest {
  idToken: string;
}

/** Response from POST /api/auth/session. */
export interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** Payload for POST /api/auth/refresh. */
export interface AuthRefreshRequest {
  refreshToken: string;
}

/** Response from POST /api/auth/refresh. */
export interface AuthRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/** Payload for POST /api/auth/logout. */
export interface AuthLogoutRequest {
  refreshToken: string;
}

/** JWT token pair stored in Zustand. */
export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

/** User slice stored in Zustand. */
export interface AuthUserState {
  id: string | null;
  email: string | null;
}

/** Auth form field values (email/password). */
export interface AuthFormValues {
  email: string;
  password: string;
}

/** Persisted auth session in localStorage. */
export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** Mapped store payload after a successful session exchange. */
export interface AuthStorePayload {
  user: AuthUserState;
  auth: AuthTokens;
}
