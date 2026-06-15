import { ApiProperty } from '@nestjs/swagger';

/** Quiz attempt summary included in library detail responses. */
export class LibraryQuizAttemptSummaryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 60 })
  score!: number;

  @ApiProperty({ example: '2026-06-11T10:00:00.000Z' })
  createdAt!: Date;
}
