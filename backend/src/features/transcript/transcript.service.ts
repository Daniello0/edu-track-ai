import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CouldNotRetrieveTranscript,
  NoTranscriptFound,
  TranscriptsDisabled,
} from '@hallelx/youtube-transcript';
import {
  TRANSCRIPT_FETCH_FAILED_MESSAGE,
  TRANSCRIPT_NO_SUBTITLES_MESSAGE,
} from './transcript.constants';
import { TranscriptFetchResult } from './transcript.types';
import {
  computeDurationSeconds,
  joinTranscriptSnippets,
} from './transcript.utils';
import { YoutubeTranscriptClient } from './youtube-transcript.client';

/** Fetches and normalizes YouTube video transcripts for downstream AI processing. */
@Injectable()
export class TranscriptService {
  constructor(
    private readonly youtubeTranscriptClient: YoutubeTranscriptClient,
  ) {}

  /**
   * Fetches subtitles for a YouTube video and returns concatenated raw text.
   */
  async fetchTranscript(videoId: string): Promise<TranscriptFetchResult> {
    try {
      const fetched = await this.youtubeTranscriptClient.fetch(videoId);

      const snippets = [...fetched.snippets];

      return {
        videoId: fetched.videoId,
        text: joinTranscriptSnippets(snippets),
        languageCode: fetched.languageCode,
        isGenerated: fetched.isGenerated,
        durationSeconds: computeDurationSeconds(snippets),
      };
    } catch (error) {
      throw this.mapTranscriptError(error);
    }
  }

  private mapTranscriptError(error: unknown): BadRequestException | never {
    if (error instanceof NoTranscriptFound) {
      return new BadRequestException(TRANSCRIPT_NO_SUBTITLES_MESSAGE);
    }

    if (error instanceof TranscriptsDisabled) {
      return new BadRequestException(TRANSCRIPT_NO_SUBTITLES_MESSAGE);
    }

    if (error instanceof CouldNotRetrieveTranscript) {
      return new BadRequestException(TRANSCRIPT_FETCH_FAILED_MESSAGE);
    }

    throw error;
  }
}
