import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { AbstractMaterialMetadataDto } from '../shared/abstract-material-metadata.dto';

/**
 * Internal base for material identity and metadata fields.
 * Not used directly in controllers — extend for endpoint-specific classes.
 */
export abstract class AbstractMaterialCoreDto extends AbstractMaterialMetadataDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'VIDEO_ID', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  videoId!: string;

  @ApiProperty({ example: 'Introduction to TypeScript', maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;
}
