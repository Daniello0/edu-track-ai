import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/** Payload for creating a new user record. */
export class CreateUserDto {
  @ApiProperty({ example: 'firebase-uid-abc123', maxLength: 128 })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  firebaseUid!: string;

  @ApiProperty({ example: 'user@example.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email!: string;
}
