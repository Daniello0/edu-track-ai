import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_API_ROUTES } from './auth.constants';
import {
  MOCK_AUTH_SESSION_RESPONSE,
  MOCK_FIREBASE_ID_TOKEN,
} from './auth.mocks';

const mockPost = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: (...args: unknown[]) => mockPost(...args),
    })),
  },
}));

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates auth session with Firebase ID token', async () => {
    mockPost.mockResolvedValue({ data: MOCK_AUTH_SESSION_RESPONSE });

    const { createAuthSession } = await import('./auth.service');
    const result = await createAuthSession(MOCK_FIREBASE_ID_TOKEN);

    expect(mockPost).toHaveBeenCalledWith(AUTH_API_ROUTES.SESSION, {
      idToken: MOCK_FIREBASE_ID_TOKEN,
    });
    expect(result).toEqual(MOCK_AUTH_SESSION_RESPONSE);
  });

  it('refreshes auth session with refresh token', async () => {
    const refreshResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };
    mockPost.mockResolvedValue({ data: refreshResponse });

    const { refreshAuthSession } = await import('./auth.service');
    const result = await refreshAuthSession('old-refresh-token');

    expect(mockPost).toHaveBeenCalledWith(AUTH_API_ROUTES.REFRESH, {
      refreshToken: 'old-refresh-token',
    });
    expect(result).toEqual(refreshResponse);
  });

  it('logs out by revoking refresh token', async () => {
    mockPost.mockResolvedValue({ data: undefined });

    const { logoutAuthSession } = await import('./auth.service');
    await logoutAuthSession('refresh-token');

    expect(mockPost).toHaveBeenCalledWith(AUTH_API_ROUTES.LOGOUT, {
      refreshToken: 'refresh-token',
    });
  });
});
