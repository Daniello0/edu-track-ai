import { ApiProperty } from '@nestjs/swagger';
import { AbstractUserCredentialsDto } from './abstract-user-credentials.dto';

/** User record returned by database read endpoints. */
export class UserResponseDto extends AbstractUserCredentialsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '2026-06-13T10:00:00.000Z' })
  createdAt!: Date;
}
