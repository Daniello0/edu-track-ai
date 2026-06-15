import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MaterialStatus } from '../../enums/material-status.enum';
import { AbstractMaterialPayloadDto } from '../shared/abstract-material-payload.dto';
import { QuizQuestionPublicDto } from '../shared/quiz-question-public.dto';

/** Response payload for a successful video processing request. */
export class ProcessResponseDto extends AbstractMaterialPayloadDto {
  @ApiProperty({
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Server-side reference for guest materials awaiting claim after authentication.',
  })
  pendingId?: string | null;

  @ApiPropertyOptional({ enum: MaterialStatus, example: MaterialStatus.READ })
  @IsOptional()
  @IsEnum(MaterialStatus)
  status?: MaterialStatus;

  @ApiProperty({ example: true })
  isPersisted!: boolean;

  @ApiProperty({ type: [QuizQuestionPublicDto], nullable: true })
  quiz!: QuizQuestionPublicDto[] | null;
}
