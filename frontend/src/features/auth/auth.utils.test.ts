import { describe, expect, it, beforeEach } from 'vitest';
import { AuthMode } from '../../common/enums/auth-mode.enum';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import {
  AUTH_MODAL_GUEST_TITLE,
  AUTH_MODAL_LOGIN_TITLE,
  AUTH_MODAL_SIGN_UP_TITLE,
  AUTH_SESSION_STORAGE_KEY,
  GOOGLE_SIGN_IN_LABEL,
  GOOGLE_SIGN_UP_LABEL,
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
} from './auth.constants';
import {
  MOCK_AUTH_SESSION_RESPONSE,
  MOCK_AUTH_STORE_PAYLOAD,
  MOCK_STORED_AUTH_SESSION,
} from './auth.mocks';
import {
  clearPersistedAuthSession,
  getAuthModalTitle,
  getGoogleAuthLabel,
  mapSessionResponseToStorePayload,
  persistAuthSession,
  readPersistedAuthSession,
  validateAuthForm,
} from './auth.utils';

describe('auth.utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('maps session response to store payload', () => {
    expect(
      mapSessionResponseToStorePayload(MOCK_AUTH_SESSION_RESPONSE),
    ).toEqual(MOCK_AUTH_STORE_PAYLOAD);
  });

  it('persists and reads auth session from localStorage', () => {
    persistAuthSession(MOCK_STORED_AUTH_SESSION);

    expect(localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeTruthy();
    expect(readPersistedAuthSession()).toEqual(MOCK_STORED_AUTH_SESSION);
  });

  it('returns null for invalid persisted session JSON', () => {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, '{ invalid json');

    expect(readPersistedAuthSession()).toBeNull();
  });

  it('clears persisted auth session', () => {
    persistAuthSession(MOCK_STORED_AUTH_SESSION);
    clearPersistedAuthSession();

    expect(readPersistedAuthSession()).toBeNull();
  });

  it('returns validation error for invalid email', async () => {
    const error = await validateAuthForm(
      { email: 'not-an-email', password: 'secret123' },
      AuthMode.SIGN_IN,
    );

    expect(error).toBe(INVALID_EMAIL_MESSAGE);
  });

  it('returns validation error for short password', async () => {
    const error = await validateAuthForm(
      {
        email: 'user@example.com',
        password: '123',
      },
      AuthMode.SIGN_UP,
    );

    expect(error).toBe(INVALID_PASSWORD_MESSAGE);
  });

  it('passes validation for valid sign-in credentials', async () => {
    const error = await validateAuthForm(
      {
        email: 'user@example.com',
        password: 'secret123',
      },
      AuthMode.SIGN_IN,
    );

    expect(error).toBeNull();
  });

  it('returns sign-up modal title when mode is SIGN_UP', () => {
    expect(getAuthModalTitle(AuthModalVariant.LOGIN, AuthMode.SIGN_UP)).toBe(
      AUTH_MODAL_SIGN_UP_TITLE,
    );
  });

  it('returns login modal title for header login flow', () => {
    expect(getAuthModalTitle(AuthModalVariant.LOGIN, AuthMode.SIGN_IN)).toBe(
      AUTH_MODAL_LOGIN_TITLE,
    );
  });

  it('returns guest modal title in sign-in mode', () => {
    expect(getAuthModalTitle(AuthModalVariant.GUEST, AuthMode.SIGN_IN)).toBe(
      AUTH_MODAL_GUEST_TITLE,
    );
  });

  it('returns Google labels for sign-in and sign-up modes', () => {
    expect(getGoogleAuthLabel(AuthMode.SIGN_IN)).toBe(GOOGLE_SIGN_IN_LABEL);
    expect(getGoogleAuthLabel(AuthMode.SIGN_UP)).toBe(GOOGLE_SIGN_UP_LABEL);
  });
});
