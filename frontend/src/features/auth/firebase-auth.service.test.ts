import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockAuth = { currentUser: null };
const mockGetIdToken = vi.fn(async () => 'firebase-id-token');
const mockSignInWithPopup = vi.fn();
const mockSignInWithEmailAndPassword = vi.fn();
const mockCreateUserWithEmailAndPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGoogleAuthProvider = vi.fn();

vi.mock('./firebase.init', () => ({
  getFirebaseAuthInstance: vi.fn(() => mockAuth),
}));

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {
    constructor() {
      mockGoogleAuthProvider();
    }
  },
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  signInWithEmailAndPassword: (...args: unknown[]) =>
    mockSignInWithEmailAndPassword(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUserWithEmailAndPassword(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

const mockCredential = {
  user: {
    getIdToken: mockGetIdToken,
  },
};

describe('firebase-auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithPopup.mockResolvedValue(mockCredential);
    mockSignInWithEmailAndPassword.mockResolvedValue(mockCredential);
    mockCreateUserWithEmailAndPassword.mockResolvedValue(mockCredential);
    mockSignOut.mockResolvedValue(undefined);
  });

  it('signs in with Google and returns ID token', async () => {
    const { signInWithGoogle } = await import('./firebase-auth.service');
    const idToken = await signInWithGoogle();

    expect(mockSignInWithPopup).toHaveBeenCalledWith(
      mockAuth,
      expect.any(Object),
    );
    expect(idToken).toBe('firebase-id-token');
  });

  it('signs in with email and returns ID token', async () => {
    const { signInWithEmail } = await import('./firebase-auth.service');
    const idToken = await signInWithEmail('user@example.com', 'secret123');

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      'user@example.com',
      'secret123',
    );
    expect(idToken).toBe('firebase-id-token');
  });

  it('signs up with email and returns ID token', async () => {
    const { signUpWithEmail } = await import('./firebase-auth.service');
    const idToken = await signUpWithEmail('user@example.com', 'secret123');

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      'user@example.com',
      'secret123',
    );
    expect(idToken).toBe('firebase-id-token');
  });

  it('signs out from Firebase', async () => {
    const { signOutFromFirebase } = await import('./firebase-auth.service');
    await signOutFromFirebase();

    expect(mockSignOut).toHaveBeenCalledWith(mockAuth);
  });
});
