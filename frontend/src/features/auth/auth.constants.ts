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

/** Auth modal title for header login flow. */
export const AUTH_MODAL_LOGIN_TITLE = 'Вход';

/** Auth modal title for sign-up flow. */
export const AUTH_MODAL_SIGN_UP_TITLE = 'Регистрация';

/** Auth modal title when guest saves material (sign-in mode). */
export const AUTH_MODAL_GUEST_TITLE = 'Сохранить материал';

/** Guest callout message above auth form. */
export const GUEST_CALLOUT_MESSAGE =
  'Чтобы не потерять конспект, создайте аккаунт';

/** Google sign-in button label. */
export const GOOGLE_SIGN_IN_LABEL = 'Войти через Google';

/** Google sign-up button label. */
export const GOOGLE_SIGN_UP_LABEL = 'Зарегистрироваться через Google';

/** Email sign-in submit label. */
export const SIGN_IN_SUBMIT_LABEL = 'Войти';

/** Email sign-up submit label. */
export const SIGN_UP_SUBMIT_LABEL = 'Зарегистрироваться';

/** Toggle link to switch to sign-up mode. */
export const SWITCH_TO_SIGN_UP_LABEL = 'Нет аккаунта? Зарегистрироваться';

/** Toggle link to switch to sign-in mode. */
export const SWITCH_TO_SIGN_IN_LABEL = 'Уже есть аккаунт? Войти';

/** Email field placeholder. */
export const AUTH_EMAIL_PLACEHOLDER = 'Email';

/** Password field placeholder. */
export const AUTH_PASSWORD_PLACEHOLDER = 'Пароль';

/** Error when Firebase `.env` still has example placeholders. */
export const FIREBASE_PLACEHOLDER_CONFIG_MESSAGE =
  'Firebase не настроен: замените значения VITE_FIREBASE_* в frontend/.env на данные из Firebase Console (Project settings → Your apps) и перезапустите dev-сервер.';

/** Error when Firebase Auth is missing or config does not match the project. */
export const FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE =
  'Firebase Authentication не найден: включите Email/Password и Google в Firebase Console → Authentication → Sign-in method, проверьте VITE_FIREBASE_* в frontend/.env и перезапустите dev-сервер.';
