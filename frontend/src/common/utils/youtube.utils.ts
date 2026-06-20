import { YOUTUBE_VIDEO_ID_LENGTH } from '../constants/process.constants';

const YOUTUBE_VIDEO_ID_PATTERN = `[\\w-]{${YOUTUBE_VIDEO_ID_LENGTH}}`;

const YOUTUBE_URL_PATTERNS = [
  new RegExp(
    `^https?:\\/\\/(?:www\\.|m\\.)?youtube\\.com\\/watch\\?.*v=(${YOUTUBE_VIDEO_ID_PATTERN})`,
  ),
  new RegExp(`^https?:\\/\\/youtu\\.be\\/(${YOUTUBE_VIDEO_ID_PATTERN})`),
  new RegExp(
    `^https?:\\/\\/(?:www\\.)?youtube\\.com\\/embed\\/(${YOUTUBE_VIDEO_ID_PATTERN})`,
  ),
  new RegExp(
    `^https?:\\/\\/(?:www\\.)?youtube\\.com\\/v\\/(${YOUTUBE_VIDEO_ID_PATTERN})`,
  ),
];

/**
 * Checks whether the given string is a supported YouTube video URL.
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Extracts the 11-character YouTube video ID from a supported URL format.
 */
export function extractVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}
