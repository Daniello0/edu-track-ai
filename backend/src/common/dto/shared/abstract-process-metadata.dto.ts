import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateIf, Equals } from 'class-validator';
import { Language } from '../../enums/language.enum';
import { MaterialFormat } from '../../enums/material-format.enum';
import { SummaryLength } from '../../enums/summary-length.enum';

/**
 * Internal base for processing metadata fields.
 * Not used directly in controllers — extend for endpoint-specific classes.
 */
export abstract class AbstractProcessMetadataDto {
  @ApiProperty({ enum: MaterialFormat, example: MaterialFormat.NARRATIVE })
  @IsEnum(MaterialFormat)
  format!: MaterialFormat;

  @ApiProperty({
    enum: SummaryLength,
    nullable: true,
    example: null,
  })
  @ValidateIf(
    (dto: AbstractProcessMetadataDto) => dto.format === MaterialFormat.SUMMARY,
  )
  @IsEnum(SummaryLength)
  @ValidateIf(
    (dto: AbstractProcessMetadataDto) => dto.format !== MaterialFormat.SUMMARY,
  )
  @Equals(null)
  summaryLength!: SummaryLength | null;

  @ApiProperty({ enum: Language, example: Language.RU })
  @IsEnum(Language)
  language!: Language;
}
