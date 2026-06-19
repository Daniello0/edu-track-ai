import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TRANSCRIPT_FETCH_FAILED_MESSAGE,
  TRANSCRIPT_NO_SUBTITLES_MESSAGE,
} from './transcript.constants';
import { YoutubeTranscriptClient } from './youtube-transcript.client';
import { TranscriptService } from './transcript.service';

const videoId = 'dQw4w9WgXcQ';

function createYoutubeTranscriptError(name: string): Error {
  const error = new Error(name);
  error.name = name;
  return error;
}

describe('TranscriptService', () => {
  let transcriptService: TranscriptService;

  const youtubeTranscriptClient = {
    fetch: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptService,
        {
          provide: YoutubeTranscriptClient,
          useValue: youtubeTranscriptClient,
        },
      ],
    }).compile();

    transcriptService = module.get<TranscriptService>(TranscriptService);
  });

  it('fetches transcript snippets and returns concatenated text', async () => {
    youtubeTranscriptClient.fetch.mockResolvedValue({
      videoId,
      snippets: [
        { text: 'Never', start: 0, duration: 0.5 },
        { text: 'gonna', start: 0.5, duration: 0.5 },
        { text: 'give you up', start: 1, duration: 1 },
      ],
      languageCode: 'en',
      isGenerated: true,
    });

    const result = await transcriptService.fetchTranscript(videoId);

    expect(youtubeTranscriptClient.fetch).toHaveBeenCalledWith(videoId);
    expect(result).toEqual({
      videoId,
      text: 'Never gonna give you up',
      languageCode: 'en',
      isGenerated: true,
      durationSeconds: 2,
    });
  });

  it('throws BadRequestException when no transcript is found', async () => {
    youtubeTranscriptClient.fetch.mockRejectedValue(
      createYoutubeTranscriptError('YoutubeTranscriptNotAvailableError'),
    );

    await expect(
      transcriptService.fetchTranscript(videoId),
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        message: TRANSCRIPT_NO_SUBTITLES_MESSAGE,
      },
    });
  });

  it('throws BadRequestException when transcripts are disabled', async () => {
    youtubeTranscriptClient.fetch.mockRejectedValue(
      createYoutubeTranscriptError('YoutubeTranscriptDisabledError'),
    );

    await expect(transcriptService.fetchTranscript(videoId)).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      transcriptService.fetchTranscript(videoId),
    ).rejects.toMatchObject({
      response: {
        message: TRANSCRIPT_NO_SUBTITLES_MESSAGE,
      },
    });
  });

  it('throws BadRequestException for other transcript retrieval failures', async () => {
    youtubeTranscriptClient.fetch.mockRejectedValue(
      createYoutubeTranscriptError('YoutubeTranscriptVideoUnavailableError'),
    );

    await expect(
      transcriptService.fetchTranscript(videoId),
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        message: TRANSCRIPT_FETCH_FAILED_MESSAGE,
      },
    });
  });

  it('rethrows unexpected errors', async () => {
    const unexpectedError = new Error('network failure');
    youtubeTranscriptClient.fetch.mockRejectedValue(unexpectedError);

    await expect(transcriptService.fetchTranscript(videoId)).rejects.toThrow(
      'network failure',
    );
  });
});
