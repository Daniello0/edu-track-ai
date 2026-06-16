import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthLogoutRequestDto } from '../../common/dto/auth/auth-logout-request.dto';
import { AuthRefreshRequestDto } from '../../common/dto/auth/auth-refresh-request.dto';
import { AuthRefreshResponseDto } from '../../common/dto/auth/auth-refresh-response.dto';
import { AuthSessionRequestDto } from '../../common/dto/auth/auth-session-request.dto';
import { AuthSessionResponseDto } from '../../common/dto/auth/auth-session-response.dto';
import { AUTH_API_PREFIX } from './auth.constants';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Public()
@Controller(AUTH_API_PREFIX)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('session')
  @ApiOperation({
    summary: 'Exchange Firebase ID token for API session tokens',
  })
  @ApiOkResponse({
    type: AuthSessionResponseDto,
    description: 'Session tokens issued',
  })
  createSession(
    @Body() dto: AuthSessionRequestDto,
  ): Promise<AuthSessionResponseDto> {
    return this.authService.createSession(dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Rotate refresh token and issue a new access token',
  })
  @ApiOkResponse({
    type: AuthRefreshResponseDto,
    description: 'Tokens refreshed',
  })
  refreshSession(
    @Body() dto: AuthRefreshRequestDto,
  ): Promise<AuthRefreshResponseDto> {
    return this.authService.refreshSession(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke refresh token on logout' })
  @ApiNoContentResponse({ description: 'Refresh token revoked' })
  logout(@Body() dto: AuthLogoutRequestDto): Promise<void> {
    return this.authService.logout(dto);
  }
}
