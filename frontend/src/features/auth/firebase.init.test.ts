import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockInitializeApp, mockGetApps, mockGetAuth } = vi.hoisted(() => ({
  mockInitializeApp: vi.fn((config: unknown) => {
    void config;
    return { name: '[DEFAULT]' };
  }),
  mockGetApps: vi.fn(() => [] as Array<{ name: string }>),
  mockGetAuth: vi.fn((app: unknown) => {
    void app;
    return { kind: 'auth' };
  }),
}));

vi.mock('firebase/app', () => ({
  initializeApp: (config: unknown) => mockInitializeApp(config),
  getApps: () => mockGetApps(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: (app: unknown) => mockGetAuth(app),
}));

const validConfig = {
  apiKey: 'api-key',
  authDomain: 'project.firebaseapp.com',
  projectId: 'project-id',
  appId: 'app-id',
  messagingSenderId: 'sender-id',
};

const placeholderConfig = {
  apiKey: 'your-firebase-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  appId: 'your-firebase-app-id',
  messagingSenderId: 'your-messaging-sender-id',
};

describe('firebase.init', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockGetApps.mockReturnValue([]);

    const { resetFirebaseInitForTests } = await import('./firebase.init');
    resetFirebaseInitForTests();
  });

  it('throws when Firebase config is incomplete', async () => {
    const { assertFirebaseConfig } = await import('./firebase.init');

    expect(() => assertFirebaseConfig({ ...validConfig, apiKey: '' })).toThrow(
      /Missing Firebase config values/,
    );
  });

  it('throws when Firebase config contains .env.example placeholders', async () => {
    const { assertFirebaseConfig } = await import('./firebase.init');

    expect(() => assertFirebaseConfig(placeholderConfig)).toThrow(
      /Firebase не настроен/,
    );
  });

  it('initializes Firebase app with provided config', async () => {
    const { initializeFirebaseApp } = await import('./firebase.init');

    const app = initializeFirebaseApp(validConfig);

    expect(mockInitializeApp).toHaveBeenCalledWith(validConfig);
    expect(app).toEqual({ name: '[DEFAULT]' });
  });

  it('reuses existing Firebase app on subsequent calls', async () => {
    const existingApp = { name: 'existing' };
    mockGetApps.mockReturnValue([existingApp]);

    const { initializeFirebaseApp } = await import('./firebase.init');

    const first = initializeFirebaseApp(validConfig);
    const second = initializeFirebaseApp(validConfig);

    expect(mockInitializeApp).not.toHaveBeenCalled();
    expect(first).toBe(existingApp);
    expect(second).toBe(existingApp);
  });

  it('returns Firebase Auth instance', async () => {
    const { getFirebaseAuthInstance } = await import('./firebase.init');

    const auth = getFirebaseAuthInstance(validConfig);

    expect(mockGetAuth).toHaveBeenCalled();
    expect(auth).toEqual({ kind: 'auth' });
  });
});
