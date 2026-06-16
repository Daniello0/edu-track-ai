import { createHash, randomBytes } from 'node:crypto';
import { AuthUserDto } from '../../common/dto/auth/auth-user.dto';
import { User } from '../user/user.entity';
import { OPAQUE_REFRESH_TOKEN_BYTE_LENGTH } from './auth.constants';

const TTL_UNIT_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/**
 * Builds a SHA-256 hex digest of an opaque refresh token.
 */
export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a cryptographically random opaque refresh token.
 */
export function generateOpaqueRefreshToken(): string {
  return randomBytes(OPAQUE_REFRESH_TOKEN_BYTE_LENGTH).toString('base64url');
}

/**
 * Parses a duration string (e.g. `7d`, `15m`) into an absolute expiry date.
 */
export function computeRefreshTokenExpiresAt(ttl: string): Date {
  const match = /^(\d+)([smhd])$/.exec(ttl.trim());
  if (!match) {
    throw new Error(`Invalid token TTL format: ${ttl}`);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const unitMs = TTL_UNIT_MS[unit];
  return new Date(Date.now() + value * unitMs);
}

/**
 * Maps a User entity to the auth session user summary DTO.
 */
export function mapUserToAuthUser(user: User): AuthUserDto {
  return {
    id: user.id,
    email: user.email,
  };
}
