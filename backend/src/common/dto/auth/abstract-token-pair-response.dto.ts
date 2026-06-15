import { ApiProperty } from '@nestjs/swagger';
import { AbstractRefreshTokenDto } from './abstract-refresh-token.dto';

/**
 * Internal base for response DTOs with JWT access and refresh tokens.
 * Not used directly in controllers — extend for endpoint-specific classes.
 */
export abstract class AbstractTokenPairResponseDto extends AbstractRefreshTokenDto {
  @ApiProperty({ example: 'jwt-string' })
  accessToken!: string;
}
