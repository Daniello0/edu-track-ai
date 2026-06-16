import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_SECRET_ENV, JWT_STRATEGY_NAME } from '../auth.constants';
import { AuthenticatedUser, JwtAccessPayload } from '../auth.types';

/** Passport strategy validating JWT access tokens from the Authorization header. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>(JWT_ACCESS_SECRET_ENV);
    if (!secret) {
      throw new Error(`Missing required env var: ${JWT_ACCESS_SECRET_ENV}`);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /** Maps the verified JWT payload to the request user object. */
  validate(payload: JwtAccessPayload): AuthenticatedUser {
    return { userId: payload.sub };
  }
}
