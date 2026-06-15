import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/** Payload for exchanging a Firebase ID token for API session tokens. */
export class AuthSessionRequestDto {
  @ApiProperty({ example: 'firebase-id-token-string' })
  @IsString()
  @MinLength(1)
  idToken!: string;
}
