/** API route prefix for auth endpoints. */
export const AUTH_API_PREFIX = 'api/auth';

/** Passport strategy name for JWT access tokens. */
export const JWT_STRATEGY_NAME = 'jwt';

/** Environment variable keys for JWT access tokens. */
export const JWT_ACCESS_SECRET_ENV = 'JWT_ACCESS_SECRET';
export const JWT_ACCESS_TTL_ENV = 'JWT_ACCESS_TTL';

/** Default access token lifetime when JWT_ACCESS_TTL is unset. */
export const DEFAULT_JWT_ACCESS_TTL = '15m';

/** Environment variable key for Firebase service account credentials file path. */
export const FIREBASE_CREDENTIALS_PATH_ENV = 'FIREBASE_CREDENTIALS_PATH';
