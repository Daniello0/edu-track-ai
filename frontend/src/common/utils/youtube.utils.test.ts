import { describe, expect, it } from 'vitest';
import { extractVideoId, isValidYouTubeUrl } from './youtube.utils';

describe('youtube.utils', () => {
  it('validates supported YouTube watch URLs', () => {
    expect(
      isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).toBe(true);
  });

  it('extracts video id from youtu.be links', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractVideoId('https://example.com')).toBeNull();
  });
});
