import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Payload for updating an existing user record. */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'firebase-uid-abc123', maxLength: 128 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  firebaseUid?: string;

  @ApiPropertyOptional({ example: 'user@example.com', maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}
