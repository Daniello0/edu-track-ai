import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AuthUserDto } from './auth-user.dto';
import { AbstractTokenPairResponseDto } from './abstract-token-pair-response.dto';

/** Response payload for a successful auth session exchange. */
export class AuthSessionResponseDto extends AbstractTokenPairResponseDto {
  @ApiProperty({ type: AuthUserDto })
  @ValidateNested()
  @Type(() => AuthUserDto)
  user!: AuthUserDto;
}
