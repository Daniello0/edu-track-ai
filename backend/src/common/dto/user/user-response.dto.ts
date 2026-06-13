import { ApiProperty } from '@nestjs/swagger';

/** User record returned by database read endpoints. */
export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'firebase-uid-abc123' })
  firebaseUid!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: '2026-06-13T10:00:00.000Z' })
  createdAt!: Date;
}
