import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

/** Quiz question exposed to clients before attempt submission. */
export class QuizQuestionPublicDto {
  @ApiProperty({ example: 'What is a closure?' })
  @IsString()
  question!: string;

  @ApiProperty({ example: ['Option A', 'Option B', 'Option C'] })
  @IsArray()
  @IsString({ each: true })
  options!: string[];
}
