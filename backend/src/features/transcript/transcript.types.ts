/** Result of fetching and concatenating a YouTube video transcript. */
export interface TranscriptFetchResult {
  videoId: string;
  text: string;
  languageCode: string;
  isGenerated: boolean;
  durationSeconds: number;
}
