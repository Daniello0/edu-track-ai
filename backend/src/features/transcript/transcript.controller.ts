import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TranscriptFetchRequestDto } from '../../common/dto/transcript/transcript-fetch-request.dto';
import { TranscriptFetchResponseDto } from '../../common/dto/transcript/transcript-fetch-response.dto';
import { extractVideoId } from '../../common/utils/youtube.utils';
import { TRANSCRIPT_API_PREFIX } from './transcript.constants';
import { TranscriptService } from './transcript.service';

@ApiTags('transcript')
@Controller(TRANSCRIPT_API_PREFIX)
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) {}

  @Post('fetch')
  @ApiOperation({
    summary: '[Dev] Fetch YouTube subtitles for a video',
    description:
      'Test endpoint for verifying subtitle extraction, including auto-generated captions.',
  })
  @ApiOkResponse({
    type: TranscriptFetchResponseDto,
    description: 'Subtitles fetched successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid URL or subtitles unavailable',
  })
  async fetchTranscript(
    @Body() dto: TranscriptFetchRequestDto,
  ): Promise<TranscriptFetchResponseDto> {
    const videoId = this.parseVideoId(dto.videoUrl);
    return this.transcriptService.fetchTranscript(videoId);
  }

  private parseVideoId(videoUrl: string): string {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new BadRequestException('Invalid YouTube video URL');
    }

    return videoId;
  }
}
