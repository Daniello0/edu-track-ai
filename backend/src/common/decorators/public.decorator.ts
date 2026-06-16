import { SetMetadata } from '@nestjs/common';

/** Metadata key marking a route as publicly accessible (skips JwtAuthGuard). */
export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as public — JwtAuthGuard will not require a JWT. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
