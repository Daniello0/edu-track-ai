import {
  TRANSCRIPT_FETCH_FAILED_ERROR_NAMES,
  TRANSCRIPT_NO_SUBTITLES_ERROR_NAMES,
} from './transcript.constants';

const noSubtitlesErrorNames = new Set<string>(
  TRANSCRIPT_NO_SUBTITLES_ERROR_NAMES,
);
const fetchFailedErrorNames = new Set<string>(
  TRANSCRIPT_FETCH_FAILED_ERROR_NAMES,
);

/**
 * Returns true when the error indicates missing or disabled subtitles.
 */
export function isNoSubtitlesTranscriptError(error: Error): boolean {
  return noSubtitlesErrorNames.has(error.name);
}

/**
 * Returns true when transcript retrieval failed for transient or availability reasons.
 */
export function isTranscriptFetchFailedError(error: Error): boolean {
  return fetchFailedErrorNames.has(error.name);
}
