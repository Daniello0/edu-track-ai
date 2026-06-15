import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { SubmitQuizAnswerDto } from './submit-quiz-answer.dto';

/** Payload for submitting quiz attempt answers. */
export class SubmitQuizAttemptRequestDto {
  @ApiProperty({ type: [SubmitQuizAnswerDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitQuizAnswerDto)
  answers!: SubmitQuizAnswerDto[];
}
