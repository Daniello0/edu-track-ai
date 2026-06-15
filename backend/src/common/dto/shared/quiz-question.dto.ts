import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { QuizQuestionPublicDto } from './quiz-question-public.dto';

/**
 * Full quiz question with the correct answer index.
 * Server-internal only — never expose in API responses or client-bound requests.
 */
export class QuizQuestionDto extends QuizQuestionPublicDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  correctAnswerIndex!: number;
}
