import { Injectable } from '@nestjs/common';
import {
  FetchOptions,
  FetchedTranscript,
  YouTubeTranscriptApi,
} from '@hallelx/youtube-transcript';

/** Thin wrapper around `@hallelx/youtube-transcript` for testability. */
@Injectable()
export class YoutubeTranscriptClient {
  private readonly api = new YouTubeTranscriptApi();

  /**
   * Fetches transcript snippets for a YouTube video.
   */
  fetch(videoId: string, options?: FetchOptions): Promise<FetchedTranscript> {
    return this.api.fetch(videoId, options);
  }
}
