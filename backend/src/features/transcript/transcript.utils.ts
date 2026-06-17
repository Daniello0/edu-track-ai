import type { FetchedTranscriptSnippet } from '@hallelx/youtube-transcript';

/**
 * Joins transcript snippet texts into a single raw string for AI processing.
 */
export function joinTranscriptSnippets(
  snippets: FetchedTranscriptSnippet[],
): string {
  return snippets.map((snippet) => snippet.text).join(' ');
}
