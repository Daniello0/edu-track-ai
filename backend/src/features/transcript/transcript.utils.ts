import type { FetchedTranscriptSnippet } from '@hallelx/youtube-transcript';

/**
 * Joins transcript snippet texts into a single raw string for AI processing.
 */
export function joinTranscriptSnippets(
  snippets: FetchedTranscriptSnippet[],
): string {
  return snippets.map((snippet) => snippet.text).join(' ');
}

/**
 * Estimates video duration in seconds from transcript snippet timestamps.
 */
export function computeDurationSeconds(
  snippets: FetchedTranscriptSnippet[],
): number {
  if (snippets.length === 0) {
    return 0;
  }

  return Math.max(
    ...snippets.map((snippet) => snippet.start + snippet.duration),
  );
}
