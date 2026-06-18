import { describe, expect, it } from 'vitest';
import {
  computeDurationSeconds,
  joinTranscriptSnippets,
} from './transcript.utils';

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

describe('computeDurationSeconds', () => {
  it('returns the end time of the latest snippet', () => {
    const duration = computeDurationSeconds([
      { text: 'Hello', start: 0, duration: 1 },
      { text: 'world', start: 1, duration: 2.5 },
    ]);

    expect(duration).toBe(3.5);
  });

  it('returns zero for empty snippets', () => {
    expect(computeDurationSeconds([])).toBe(0);
  });
});
