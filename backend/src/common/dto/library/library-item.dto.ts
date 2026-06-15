import { ApiProperty } from '@nestjs/swagger';
import { AbstractMaterialCoreDto } from './abstract-material-core.dto';

/** Single item in the library list response. */
export class LibraryItemDto extends AbstractMaterialCoreDto {
  @ApiProperty({ example: 80 })
  bestScore!: number;

  @ApiProperty({ example: '2026-06-11T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-11T12:00:00.000Z' })
  lastViewedAt!: Date;
}
