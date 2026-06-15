import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Max, Min, ValidateIf } from 'class-validator';
import {
  QUIZ_OPTIONS_MAX,
  QUIZ_OPTIONS_MIN,
  QUIZ_QUESTIONS_MAX,
  QUIZ_QUESTIONS_MIN,
} from '../../constants/process.constants';
import { AbstractProcessMetadataDto } from '../shared/abstract-process-metadata.dto';

/** Processing settings submitted with a video URL. */
export class ProcessSettingsDto extends AbstractProcessMetadataDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  hasQuiz!: boolean;

  @ApiProperty({
    example: 5,
    minimum: QUIZ_QUESTIONS_MIN,
    maximum: QUIZ_QUESTIONS_MAX,
  })
  @ValidateIf((settings: ProcessSettingsDto) => settings.hasQuiz)
  @IsInt()
  @Min(QUIZ_QUESTIONS_MIN)
  @Max(QUIZ_QUESTIONS_MAX)
  quizQuestionsCount!: number;

  @ApiProperty({
    example: 4,
    minimum: QUIZ_OPTIONS_MIN,
    maximum: QUIZ_OPTIONS_MAX,
  })
  @ValidateIf((settings: ProcessSettingsDto) => settings.hasQuiz)
  @IsInt()
  @Min(QUIZ_OPTIONS_MIN)
  @Max(QUIZ_OPTIONS_MAX)
  quizOptionsCount!: number;
}
