import { describe, expect, it } from 'vitest';
import { isPlaceholderFirebaseConfig } from './firebase-config.utils';

describe('firebase-config.utils', () => {
  it('detects placeholder Firebase config from .env.example', () => {
    expect(
      isPlaceholderFirebaseConfig({
        apiKey: 'your-firebase-api-key',
        authDomain: 'your-project.firebaseapp.com',
        projectId: 'your-project-id',
        appId: 'your-firebase-app-id',
        messagingSenderId: 'your-messaging-sender-id',
      }),
    ).toBe(true);
  });

  it('accepts real-looking Firebase config values', () => {
    expect(
      isPlaceholderFirebaseConfig({
        apiKey: 'AIzaSyExampleKey',
        authDomain: 'edu-track-ai.firebaseapp.com',
        projectId: 'edu-track-ai',
        appId: '1:123456789:web:abc123',
        messagingSenderId: '123456789',
      }),
    ).toBe(false);
  });
});
