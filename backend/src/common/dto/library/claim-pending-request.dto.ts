import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * Payload for persisting a guest-processed material after authentication.
 * References server-side pending storage — quiz answers are not sent by the client.
 */
export class ClaimPendingRequestDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identifier returned by POST /api/process for guest sessions.',
  })
  @IsString()
  @MinLength(1)
  pendingId!: string;
}
