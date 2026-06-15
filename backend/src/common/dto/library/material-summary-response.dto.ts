import { ApiProperty } from '@nestjs/swagger';
import { AbstractMaterialCoreDto } from './abstract-material-core.dto';

/** Compact material summary returned by claim-pending and status update endpoints. */
export class MaterialSummaryResponseDto extends AbstractMaterialCoreDto {
  @ApiProperty({ example: true })
  isPersisted!: boolean;
}
