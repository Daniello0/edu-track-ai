import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthMode } from '../../common/enums/auth-mode.enum';
import { PENDING_MATERIAL_STORAGE_KEY } from '../../common/constants/app.constants';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { MOCK_AUTH_SESSION_RESPONSE } from './auth.mocks';

const mockCreateAuthSession = vi.fn();
const mockLogoutAuthSession = vi.fn();
const mockSignInWithEmail = vi.fn();
const mockSignUpWithEmail = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockSignOutFromFirebase = vi.fn();
const mockInitializeFirebaseApp = vi.fn();
const mockClaimPendingMaterial = vi.fn();

vi.mock('./auth.service', () => ({
  createAuthSession: (...args: unknown[]) => mockCreateAuthSession(...args),
  logoutAuthSession: (...args: unknown[]) => mockLogoutAuthSession(...args),
}));

vi.mock('./firebase-auth.service', () => ({
  signInWithEmail: (...args: unknown[]) => mockSignInWithEmail(...args),
  signUpWithEmail: (...args: unknown[]) => mockSignUpWithEmail(...args),
  signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args),
  signOutFromFirebase: (...args: unknown[]) => mockSignOutFromFirebase(...args),
}));

vi.mock('./firebase.init', () => ({
  initializeFirebaseApp: (...args: unknown[]) =>
    mockInitializeFirebaseApp(...args),
}));

vi.mock('../library/library.service', () => ({
  claimPendingMaterial: (...args: unknown[]) =>
    mockClaimPendingMaterial(...args),
}));

describe('auth-flow.utils', () => {
  const handlers = {
    setAuthSession: vi.fn(),
    clearAuth: vi.fn(),
    markReaderPersisted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mockCreateAuthSession.mockResolvedValue(MOCK_AUTH_SESSION_RESPONSE);
    mockSignInWithEmail.mockResolvedValue('firebase-token');
    mockSignUpWithEmail.mockResolvedValue('firebase-token');
    mockSignInWithGoogle.mockResolvedValue('firebase-token');
    mockClaimPendingMaterial.mockResolvedValue({
      id: 'material-1',
      videoId: 'video-1',
      title: 'Sample',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      status: MaterialStatus.READ,
      isPersisted: true,
    });
  });

  it('authenticates with email and creates API session', async () => {
    const { authenticateWithEmail } = await import('./auth-flow.utils');

    await authenticateWithEmail(
      { email: 'user@example.com', password: 'secret123' },
      AuthMode.SIGN_IN,
      handlers,
    );

    expect(mockSignInWithEmail).toHaveBeenCalledWith(
      'user@example.com',
      'secret123',
    );
    expect(mockCreateAuthSession).toHaveBeenCalledWith('firebase-token');
    expect(handlers.setAuthSession).toHaveBeenCalledWith(
      MOCK_AUTH_SESSION_RESPONSE,
    );
  });

  it('claims pending material after successful session', async () => {
    sessionStorage.setItem(
      PENDING_MATERIAL_STORAGE_KEY,
      JSON.stringify({
        pendingId: 'pending-1',
        videoId: 'video-1',
        title: 'Sample',
        content: 'Content',
        category: MaterialCategory.PROGRAMMING,
        format: MaterialFormat.NARRATIVE,
        summaryLength: null,
        language: Language.RU,
        quiz: null,
      }),
    );

    const { authenticateWithGoogle } = await import('./auth-flow.utils');
    await authenticateWithGoogle(handlers);

    expect(mockClaimPendingMaterial).toHaveBeenCalledWith(
      'pending-1',
      MOCK_AUTH_SESSION_RESPONSE.accessToken,
    );
    expect(handlers.markReaderPersisted).toHaveBeenCalledWith('material-1');
    expect(sessionStorage.getItem(PENDING_MATERIAL_STORAGE_KEY)).toBeNull();
  });

  it('logs out via API and clears local auth state', async () => {
    mockLogoutAuthSession.mockResolvedValue(undefined);
    mockSignOutFromFirebase.mockResolvedValue(undefined);

    const { performLogout } = await import('./auth-flow.utils');
    await performLogout('refresh-token', handlers);

    expect(mockLogoutAuthSession).toHaveBeenCalledWith('refresh-token');
    expect(handlers.clearAuth).toHaveBeenCalled();
    expect(mockSignOutFromFirebase).toHaveBeenCalled();
  });

  it('detects authenticated user state', async () => {
    const { isAuthenticated } = await import('./auth-flow.utils');

    expect(isAuthenticated('user-id', 'access-token')).toBe(true);
    expect(isAuthenticated(null, 'access-token')).toBe(false);
  });
});
