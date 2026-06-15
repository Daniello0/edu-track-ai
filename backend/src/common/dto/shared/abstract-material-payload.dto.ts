import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { MaterialCategory } from '../../enums/material-category.enum';
import { AbstractProcessMetadataDto } from './abstract-process-metadata.dto';

/**
 * Internal base for process/claim payloads with material content fields.
 * Not used directly in controllers — extend for endpoint-specific classes.
 */
export abstract class AbstractMaterialPayloadDto extends AbstractProcessMetadataDto {
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

  @ApiProperty({ example: '# Processed content in markdown' })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiProperty({
    enum: MaterialCategory,
    example: MaterialCategory.PROGRAMMING,
  })
  @IsEnum(MaterialCategory)
  category!: MaterialCategory;
}
