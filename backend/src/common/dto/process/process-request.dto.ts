import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { IsYouTubeUrl } from '../../utils/validators.utils';
import { ProcessSettingsDto } from './process-settings.dto';

/** Payload for processing a YouTube video into learning material. */
export class ProcessRequestDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=VIDEO_ID',
  })
  @IsString()
  @IsYouTubeUrl()
  videoUrl!: string;

  @ApiProperty({ type: ProcessSettingsDto })
  @ValidateNested()
  @Type(() => ProcessSettingsDto)
  settings!: ProcessSettingsDto;
}
