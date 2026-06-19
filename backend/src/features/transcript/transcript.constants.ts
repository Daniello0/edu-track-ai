/** API route prefix for transcript dev endpoints. */
export const TRANSCRIPT_API_PREFIX = 'api/transcript';

/** Maximum retry attempts for transient YouTube transcript fetch failures. */
export const TRANSCRIPT_FETCH_RETRIES = 2;

/** Base delay in milliseconds for transcript fetch exponential backoff. */
export const TRANSCRIPT_FETCH_RETRY_DELAY_MS = 1000;

/** youtube-transcript-plus error names mapped to "no subtitles" responses. */
export const TRANSCRIPT_NO_SUBTITLES_ERROR_NAMES = [
  'YoutubeTranscriptNotAvailableError',
  'YoutubeTranscriptNotAvailableLanguageError',
  'YoutubeTranscriptDisabledError',
] as const;

/** youtube-transcript-plus error names mapped to generic fetch failures. */
export const TRANSCRIPT_FETCH_FAILED_ERROR_NAMES = [
  'YoutubeTranscriptVideoUnavailableError',
  'YoutubeTranscriptTooManyRequestError',
] as const;

/** User-facing message when a video has no available subtitles. */
export const TRANSCRIPT_NO_SUBTITLES_MESSAGE =
  'У этого видео нет доступных субтитров. Попробуйте другое видео с включёнными субтитрами.';

/** User-facing message when transcript retrieval fails for other reasons. */
export const TRANSCRIPT_FETCH_FAILED_MESSAGE =
  'Не удалось получить субтитры для этого видео. Попробуйте другое видео.';
