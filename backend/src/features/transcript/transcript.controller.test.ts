import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TranscriptFetchRequestDto } from '../../common/dto/transcript/transcript-fetch-request.dto';
import { TranscriptController } from './transcript.controller';
import { TranscriptService } from './transcript.service';

const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const videoId = 'dQw4w9WgXcQ';

describe('TranscriptController', () => {
  let transcriptController: TranscriptController;

  const transcriptService = {
    fetchTranscript: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscriptController],
      providers: [
        {
          provide: TranscriptService,
          useValue: transcriptService,
        },
      ],
    }).compile();

    transcriptController =
      module.get<TranscriptController>(TranscriptController);
  });

  it('fetches subtitles for a valid YouTube URL', async () => {
    const dto: TranscriptFetchRequestDto = { videoUrl };
    transcriptService.fetchTranscript.mockResolvedValue({
      videoId,
      text: 'Never gonna give you up',
      languageCode: 'en',
      isGenerated: true,
      durationSeconds: 212,
    });

    const result = await transcriptController.fetchTranscript(dto);

    expect(transcriptService.fetchTranscript).toHaveBeenCalledWith(videoId);
    expect(result).toEqual({
      videoId,
      text: 'Never gonna give you up',
      languageCode: 'en',
      isGenerated: true,
      durationSeconds: 212,
    });
  });

  it('throws BadRequestException for an invalid YouTube URL', async () => {
    const dto: TranscriptFetchRequestDto = {
      videoUrl: 'https://example.com/not-youtube',
    };

    await expect(
      transcriptController.fetchTranscript(dto),
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        message: 'Invalid YouTube video URL',
      },
    });
    expect(transcriptService.fetchTranscript).not.toHaveBeenCalled();
  });
});
