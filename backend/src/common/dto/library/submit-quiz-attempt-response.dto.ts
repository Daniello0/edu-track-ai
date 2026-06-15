import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { MaterialStatus } from '../../enums/material-status.enum';
import { GradedQuizAnswerDto } from './graded-quiz-answer.dto';

/** Response payload for a submitted quiz attempt. */
export class SubmitQuizAttemptResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  attemptId!: string;

  @ApiProperty({ example: 80 })
  score!: number;

  @ApiProperty({ example: 80 })
  bestScore!: number;

  @ApiProperty({ enum: MaterialStatus, example: MaterialStatus.MASTERED })
  status!: MaterialStatus;

  @ApiProperty({ type: [GradedQuizAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradedQuizAnswerDto)
  answers!: GradedQuizAnswerDto[];
}
