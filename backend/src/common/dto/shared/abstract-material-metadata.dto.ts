import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MaterialCategory } from '../../enums/material-category.enum';
import { MaterialStatus } from '../../enums/material-status.enum';
import { AbstractProcessMetadataDto } from './abstract-process-metadata.dto';

/**
 * Internal base for material metadata fields.
 * Not used directly in controllers — extend for endpoint-specific classes.
 */
export abstract class AbstractMaterialMetadataDto extends AbstractProcessMetadataDto {
  @ApiProperty({
    enum: MaterialCategory,
    example: MaterialCategory.PROGRAMMING,
  })
  @IsEnum(MaterialCategory)
  category!: MaterialCategory;

  @ApiProperty({ enum: MaterialStatus, example: MaterialStatus.READ })
  @IsEnum(MaterialStatus)
  status!: MaterialStatus;
}
