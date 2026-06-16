import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY_NAME } from '../auth.constants';
import { AuthenticatedUser } from '../auth.types';

/**
 * Attempts JWT validation but allows unauthenticated requests to proceed.
 * Used on routes where auth enables optional behaviour (e.g. auto-save).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard(JWT_STRATEGY_NAME) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: TUser | false,
  ): TUser | undefined {
    if (err || !user) {
      return undefined;
    }
    return user;
  }
}
