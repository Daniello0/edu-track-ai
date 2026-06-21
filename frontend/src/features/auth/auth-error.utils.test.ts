import { describe, expect, it } from 'vitest';
import { FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE } from './auth.constants';
import { resolveAuthError } from './auth-error.utils';

describe('auth-error.utils', () => {
  it('maps CONFIGURATION_NOT_FOUND API errors to setup guidance', () => {
    const message = resolveAuthError({
      code: 400,
      message: 'CONFIGURATION_NOT_FOUND',
    });

    expect(message).toBe(FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE);
  });

  it('maps auth/configuration-not-found Firebase code', () => {
    const message = resolveAuthError({
      code: 'auth/configuration-not-found',
      message: 'Firebase: Error (auth/configuration-not-found).',
    });

    expect(message).toBe(FIREBASE_CONFIGURATION_NOT_FOUND_MESSAGE);
  });
});
