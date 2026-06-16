import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { AuthService } from './auth.service';
import { hashRefreshToken } from './auth.utils';

const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  firebaseUid: 'firebase-uid-abc123',
  email: 'user@example.com',
  createdAt: new Date('2026-06-13T10:00:00.000Z'),
  refreshTokens: [],
  materials: [],
};

const opaqueRefreshToken = 'opaque-refresh-token-value';
const refreshTokenHash = hashRefreshToken(opaqueRefreshToken);

const mockStoredRefreshToken: RefreshToken = {
  id: '660e8400-e29b-41d4-a716-446655440001',
  userId: mockUser.id,
  user: mockUser,
  tokenHash: refreshTokenHash,
  expiresAt: new Date(Date.now() + 86_400_000),
  createdAt: new Date('2026-06-13T10:00:00.000Z'),
};

describe('AuthService', () => {
  let authService: AuthService;

  const firebaseAdminService = {
    verifyIdToken: vi.fn(),
  };

  const userService = {
    upsertByFirebaseUid: vi.fn(),
  };

  const jwtService = {
    sign: vi.fn(),
  };

  const configService = {
    get: vi.fn(),
  };

  const refreshTokenRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    delete: vi.fn(),
    manager: {
      transaction: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    configService.get.mockReturnValue('7d');
    jwtService.sign.mockReturnValue('signed-access-token');
    refreshTokenRepository.create.mockImplementation(
      (payload: Partial<RefreshToken>) => payload,
    );
    refreshTokenRepository.save.mockImplementation(
      (payload: Partial<RefreshToken>) =>
        Promise.resolve({
          id: 'new-refresh-id',
          createdAt: new Date(),
          ...payload,
        }),
    );
    refreshTokenRepository.manager.transaction.mockImplementation(
      async (
        callback: (manager: {
          getRepository: () => typeof refreshTokenRepository;
        }) => Promise<unknown>,
      ) =>
        callback({
          getRepository: () => refreshTokenRepository,
        }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: FirebaseAdminService, useValue: firebaseAdminService },
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: refreshTokenRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('createSession', () => {
    it('verifies Firebase token, upserts user, and returns token pair', async () => {
      firebaseAdminService.verifyIdToken.mockResolvedValue({
        uid: mockUser.firebaseUid,
        email: mockUser.email,
      });
      userService.upsertByFirebaseUid.mockResolvedValue(mockUser);

      const result = await authService.createSession({
        idToken: 'firebase-id-token',
      });

      expect(firebaseAdminService.verifyIdToken).toHaveBeenCalledWith(
        'firebase-id-token',
      );
      expect(userService.upsertByFirebaseUid).toHaveBeenCalledWith(
        mockUser.firebaseUid,
        mockUser.email,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(refreshTokenRepository.save).toHaveBeenCalled();
      const savedToken = refreshTokenRepository.save.mock
        .calls[0]?.[0] as Partial<RefreshToken>;
      expect(savedToken.userId).toBe(mockUser.id);
      expect(typeof savedToken.tokenHash).toBe('string');
      expect(savedToken.expiresAt).toBeInstanceOf(Date);
      expect(result.accessToken).toBe('signed-access-token');
      expect(typeof result.refreshToken).toBe('string');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('throws UnauthorizedException for invalid Firebase token', async () => {
      firebaseAdminService.verifyIdToken.mockRejectedValue(
        new Error('invalid'),
      );

      await expect(
        authService.createSession({ idToken: 'bad-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when Firebase token has no email', async () => {
      firebaseAdminService.verifyIdToken.mockResolvedValue({
        uid: mockUser.firebaseUid,
      });

      await expect(
        authService.createSession({ idToken: 'firebase-id-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshSession', () => {
    it('rotates refresh token and returns a new token pair', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(mockStoredRefreshToken);

      const result = await authService.refreshSession({
        refreshToken: opaqueRefreshToken,
      });

      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { tokenHash: refreshTokenHash },
        relations: { user: true },
      });
      expect(refreshTokenRepository.delete).toHaveBeenCalledWith({
        id: mockStoredRefreshToken.id,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result.accessToken).toBe('signed-access-token');
      expect(typeof result.refreshToken).toBe('string');
      expect(result.refreshToken).not.toBe(opaqueRefreshToken);
    });

    it('throws UnauthorizedException for unknown refresh token', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(null);

      await expect(
        authService.refreshSession({ refreshToken: 'unknown-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for expired refresh token', async () => {
      refreshTokenRepository.findOne.mockResolvedValue({
        ...mockStoredRefreshToken,
        expiresAt: new Date(Date.now() - 1_000),
      });

      await expect(
        authService.refreshSession({ refreshToken: opaqueRefreshToken }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('deletes refresh token by hash', async () => {
      await authService.logout({ refreshToken: opaqueRefreshToken });

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith({
        tokenHash: refreshTokenHash,
      });
    });

    it('completes silently when refresh token is unknown', async () => {
      refreshTokenRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(
        authService.logout({ refreshToken: 'unknown-token' }),
      ).resolves.toBeUndefined();
    });
  });
});
