import { describe, expect, it } from 'vitest';
import { extractVideoId, isValidYouTubeUrl } from './youtube.utils';

describe('isValidYouTubeUrl', () => {
  it('accepts standard watch URLs', () => {
    expect(
      isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).toBe(true);
  });

  it('accepts short youtu.be URLs', () => {
    expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
  });

  it('accepts embed URLs', () => {
    expect(isValidYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
      true,
    );
  });

  it('rejects non-YouTube URLs', () => {
    expect(isValidYouTubeUrl('https://example.com/watch?v=dQw4w9WgXcQ')).toBe(
      false,
    );
  });

  it('rejects malformed URLs', () => {
    expect(isValidYouTubeUrl('not-a-url')).toBe(false);
  });
});

describe('extractVideoId', () => {
  it('extracts ID from watch URL', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('extracts ID from watch URL with extra query params', () => {
    expect(
      extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtu.be URL', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from embed URL', () => {
    expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('returns null for invalid URLs', () => {
    expect(
      extractVideoId('https://example.com/watch?v=dQw4w9WgXcQ'),
    ).toBeNull();
  });
});
