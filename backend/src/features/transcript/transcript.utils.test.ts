import { describe, expect, it } from 'vitest';
import { joinTranscriptSnippets } from './transcript.utils';

describe('joinTranscriptSnippets', () => {
  it('joins snippet texts with spaces', () => {
    const result = joinTranscriptSnippets([
      { text: 'Hello', start: 0, duration: 1 },
      { text: 'world', start: 1, duration: 1 },
    ]);

    expect(result).toBe('Hello world');
  });

  it('returns an empty string for empty snippets', () => {
    expect(joinTranscriptSnippets([])).toBe('');
  });
});
