import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const sessionResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
  },
};

describe('AuthController', () => {
  let authController: AuthController;

  const authService = {
    createSession: vi.fn(),
    refreshSession: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('delegates session creation to AuthService', async () => {
    const dto = { idToken: 'firebase-id-token' };
    authService.createSession.mockResolvedValue(sessionResponse);

    const result = await authController.createSession(dto);

    expect(result).toEqual(sessionResponse);
    expect(authService.createSession).toHaveBeenCalledWith(dto);
  });

  it('delegates refresh to AuthService', async () => {
    const dto = { refreshToken: 'refresh-token' };
    const refreshResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };
    authService.refreshSession.mockResolvedValue(refreshResponse);

    const result = await authController.refreshSession(dto);

    expect(result).toEqual(refreshResponse);
    expect(authService.refreshSession).toHaveBeenCalledWith(dto);
  });

  it('delegates logout to AuthService', async () => {
    const dto = { refreshToken: 'refresh-token' };
    authService.logout.mockResolvedValue(undefined);

    await authController.logout(dto);

    expect(authService.logout).toHaveBeenCalledWith(dto);
  });
});
