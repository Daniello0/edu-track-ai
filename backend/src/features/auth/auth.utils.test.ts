import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { User } from '../user/user.entity';
import {
  computeRefreshTokenExpiresAt,
  generateOpaqueRefreshToken,
  hashRefreshToken,
  mapUserToAuthUser,
} from './auth.utils';

describe('auth.utils', () => {
  it('hashes refresh tokens with SHA-256 hex', () => {
    const token = 'opaque-refresh-token';
    const expected = createHash('sha256').update(token).digest('hex');

    expect(hashRefreshToken(token)).toBe(expected);
    expect(hashRefreshToken(token)).toHaveLength(64);
  });

  it('generates unique opaque refresh tokens', () => {
    const first = generateOpaqueRefreshToken();
    const second = generateOpaqueRefreshToken();

    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThan(0);
  });

  it('computes refresh token expiry from TTL string', () => {
    const before = Date.now();
    const expiresAt = computeRefreshTokenExpiresAt('7d');
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    expect(expiresAt.getTime()).toBeGreaterThanOrEqual(
      before + sevenDaysMs - 1000,
    );
    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      before + sevenDaysMs + 1000,
    );
  });

  it('throws for invalid refresh token TTL format', () => {
    expect(() => computeRefreshTokenExpiresAt('invalid')).toThrow(
      'Invalid token TTL format',
    );
  });

  it('maps user entity to auth user summary', () => {
    const user: User = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      firebaseUid: 'firebase-uid',
      email: 'user@example.com',
      createdAt: new Date(),
      refreshTokens: [],
      materials: [],
    };

    expect(mapUserToAuthUser(user)).toEqual({
      id: user.id,
      email: user.email,
    });
  });
});
