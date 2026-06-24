/** Relative API base path (proxied to backend in dev). */
export const API_BASE_PATH = '/api';

/** Default JSON content type for API requests. */
export const API_JSON_CONTENT_TYPE = 'application/json';

/** Default headers for the shared axios API client. */
export const API_CLIENT_DEFAULT_HEADERS = {
  'Content-Type': API_JSON_CONTENT_TYPE,
} as const;

/** HTTP 401 Unauthorized — triggers token refresh when applicable. */
export const HTTP_STATUS_UNAUTHORIZED = 401;
