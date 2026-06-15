import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

/** Single answer submitted for server-side quiz grading. */
export class SubmitQuizAnswerDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  questionIndex!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  selectedAnswerIndex!: number;
}
