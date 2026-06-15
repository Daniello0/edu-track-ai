import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LibraryItemDto } from './library-item.dto';

/** Response payload for GET /api/library. */
export class LibraryListResponseDto {
  @ApiProperty({ type: [LibraryItemDto] })
  @ValidateNested({ each: true })
  @Type(() => LibraryItemDto)
  items!: LibraryItemDto[];
}
