import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsYouTubeUrl } from '../../utils/validators.utils';

/** Payload for fetching YouTube subtitles in the transcript dev endpoint. */
export class TranscriptFetchRequestDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Supported YouTube video URL',
  })
  @IsString()
  @IsYouTubeUrl()
  videoUrl!: string;
}
