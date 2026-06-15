import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { QuizQuestionPublicDto } from '../shared/quiz-question-public.dto';
import { LibraryQuizAttemptSummaryDto } from './library-quiz-attempt-summary.dto';

/** Quiz details included in library material detail responses. */
export class LibraryQuizDetailDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ type: [QuizQuestionPublicDto] })
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionPublicDto)
  questions!: QuizQuestionPublicDto[];

  @ApiProperty({ example: 0 })
  bestScore!: number;

  @ApiProperty({ type: [LibraryQuizAttemptSummaryDto] })
  @ValidateNested({ each: true })
  @Type(() => LibraryQuizAttemptSummaryDto)
  attempts!: LibraryQuizAttemptSummaryDto[];
}
