import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_API_ROUTES } from '../auth/auth.constants';

const mockRequest = vi.fn();
const mockUse = vi.fn();
const mockRefreshAuthSession = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        response: { use: mockUse },
      },
      request: (...args: unknown[]) => mockRequest(...args),
    })),
  },
}));

vi.mock('../auth/auth.service', () => ({
  refreshAuthSession: (...args: unknown[]) => mockRefreshAuthSession(...args),
}));

describe('axios-auth.interceptor', () => {
  beforeEach(async () => {
    vi.resetModules();
    mockUse.mockClear();
    mockRequest.mockClear();
    mockRefreshAuthSession.mockClear();

    const { resetAxiosAuthInterceptorForTests } =
      await import('./axios-auth.interceptor');
    resetAxiosAuthInterceptorForTests();
  });

  it('registers a response interceptor on the shared client', async () => {
    const { setupAxiosAuthInterceptor } =
      await import('./axios-auth.interceptor');

    setupAxiosAuthInterceptor({
      getRefreshToken: () => 'refresh-token',
      onSessionRefreshed: vi.fn(),
      onSessionExpired: vi.fn(),
    });

    expect(mockUse).toHaveBeenCalledTimes(1);
  });

  it('refreshes tokens and retries the failed request once', async () => {
    const onSessionRefreshed = vi.fn();
    const { setupAxiosAuthInterceptor } =
      await import('./axios-auth.interceptor');

    setupAxiosAuthInterceptor({
      getRefreshToken: () => 'refresh-token',
      onSessionRefreshed,
      onSessionExpired: vi.fn(),
    });

    mockRefreshAuthSession.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    mockRequest.mockResolvedValue({ data: { ok: true } });

    const rejectedHandler = mockUse.mock.calls[0]?.[1] as (
      error: AxiosError,
    ) => Promise<unknown>;
    const config = {
      url: '/library',
      headers: { Authorization: 'Bearer expired-token' },
    } as InternalAxiosRequestConfig;

    const result = await rejectedHandler({
      response: { status: 401 },
      config,
    } as AxiosError);

    expect(mockRefreshAuthSession).toHaveBeenCalledWith('refresh-token');
    expect(onSessionRefreshed).toHaveBeenCalledWith({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/library',
        headers: expect.objectContaining({
          Authorization: 'Bearer new-access-token',
        }),
        _authRetried: true,
      }),
    );
    expect(result).toEqual({ data: { ok: true } });
  });

  it('does not refresh auth endpoints', async () => {
    const onSessionExpired = vi.fn();
    const { setupAxiosAuthInterceptor } =
      await import('./axios-auth.interceptor');

    setupAxiosAuthInterceptor({
      getRefreshToken: () => 'refresh-token',
      onSessionRefreshed: vi.fn(),
      onSessionExpired,
    });

    const rejectedHandler = mockUse.mock.calls[0]?.[1] as (
      error: AxiosError,
    ) => Promise<unknown>;

    await expect(
      rejectedHandler({
        response: { status: 401 },
        config: { url: AUTH_API_ROUTES.REFRESH },
      } as AxiosError),
    ).rejects.toBeDefined();

    expect(mockRefreshAuthSession).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('clears session when refresh token is missing', async () => {
    const onSessionExpired = vi.fn();
    const { setupAxiosAuthInterceptor } =
      await import('./axios-auth.interceptor');

    setupAxiosAuthInterceptor({
      getRefreshToken: () => null,
      onSessionRefreshed: vi.fn(),
      onSessionExpired,
    });

    const rejectedHandler = mockUse.mock.calls[0]?.[1] as (
      error: AxiosError,
    ) => Promise<unknown>;

    await expect(
      rejectedHandler({
        response: { status: 401 },
        config: { url: '/library' },
      } as AxiosError),
    ).rejects.toBeDefined();

    expect(mockRefreshAuthSession).not.toHaveBeenCalled();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });
});
