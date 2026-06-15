import { AbstractRefreshTokenDto } from './abstract-refresh-token.dto';

/** Payload for revoking a refresh token on logout. */
export class AuthLogoutRequestDto extends AbstractRefreshTokenDto {}
