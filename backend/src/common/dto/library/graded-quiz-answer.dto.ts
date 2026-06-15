import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { SubmitQuizAnswerDto } from './submit-quiz-answer.dto';

/** Graded answer returned after quiz attempt submission. */
export class GradedQuizAnswerDto extends SubmitQuizAnswerDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect!: boolean;
}
