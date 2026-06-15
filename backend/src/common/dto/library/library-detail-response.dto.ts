import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AbstractMaterialCoreDto } from './abstract-material-core.dto';
import { LibraryQuizDetailDto } from './library-quiz-detail.dto';

/** Response payload for GET /api/library/:id. */
export class LibraryDetailResponseDto extends AbstractMaterialCoreDto {
  @ApiProperty({ example: '# Processed content in markdown' })
  content!: string;

  @ApiProperty({ type: LibraryQuizDetailDto })
  @ValidateNested()
  @Type(() => LibraryQuizDetailDto)
  quiz!: LibraryQuizDetailDto;

  @ApiProperty({ example: '2026-06-11T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-11T12:00:00.000Z' })
  lastViewedAt!: Date;
}
