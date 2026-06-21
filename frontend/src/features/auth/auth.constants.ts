import type { AuthFormValues } from './auth.types';

/** localStorage key for persisted auth session. */
export const AUTH_SESSION_STORAGE_KEY = 'edutrack:authSession';

/** Minimum password length required by Firebase Auth. */
export const MIN_PASSWORD_LENGTH = 6;

/** Auth API route paths (relative to /api). */
export const AUTH_API_ROUTES = {
  SESSION: '/auth/session',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
} as const;

/** Default empty auth form values. */
export const DEFAULT_AUTH_FORM_VALUES: AuthFormValues = {
  email: '',
  password: '',
};

/** Validation message when email is missing or invalid. */
export const INVALID_EMAIL_MESSAGE = 'Введите корректный email';

/** Validation message when password is too short. */
export const INVALID_PASSWORD_MESSAGE = `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`;

/** Generic auth failure message shown in UI. */
export const AUTH_FAILURE_MESSAGE =
  'Не удалось выполнить вход. Проверьте данные и попробуйте снова.';
