import axios from 'axios';
import {
  AUTH_FAILURE_MESSAGE,
  FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE,
} from './auth.constants';

const FIREBASE_AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/configuration-not-found': FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE,
  'auth/email-already-in-use': 'Этот email уже зарегистрирован',
  'auth/invalid-credential': 'Неверный email или пароль',
  'auth/invalid-email': 'Введите корректный email',
  'auth/user-not-found': 'Неверный email или пароль',
  'auth/wrong-password': 'Неверный email или пароль',
  'auth/weak-password': 'Пароль слишком слабый',
  'auth/popup-closed-by-user': 'Вход через Google отменён',
};

/**
 * Maps Firebase, API, and unknown errors to a user-facing auth message.
 */
export function resolveAuthError(error: unknown): string {
  const configurationMessage = getConfigurationNotFoundMessage(error);
  if (configurationMessage !== null) {
    return configurationMessage;
  }

  const firebaseCode = getFirebaseErrorCode(error);
  if (firebaseCode !== null) {
    return FIREBASE_AUTH_ERROR_MESSAGES[firebaseCode] ?? AUTH_FAILURE_MESSAGE;
  }

  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return AUTH_FAILURE_MESSAGE;
}

function getFirebaseErrorCode(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }

  return null;
}

function getConfigurationNotFoundMessage(error: unknown): string | null {
  const message = collectErrorMessages(error).join(' ');
  if (message.includes('CONFIGURATION_NOT_FOUND')) {
    return FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE;
  }

  return null;
}

function collectErrorMessages(error: unknown): string[] {
  if (error instanceof Error) {
    return [error.message];
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error as { message?: unknown };
    return typeof message === 'string' ? [message] : [];
  }

  return [];
}
