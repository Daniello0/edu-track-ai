import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * Internal base for DTOs with a validated opaque refresh token.
 * Not used directly in controllers — extend for endpoint-specific classes.
 */
export abstract class AbstractRefreshTokenDto {
  @ApiProperty({ example: 'opaque-refresh-token' })
  @IsString()
  @MinLength(1)
  refreshToken!: string;
}
