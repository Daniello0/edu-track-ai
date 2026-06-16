/** JWT access token payload shape signed by the auth module. */
export interface JwtAccessPayload {
  sub: string;
  email: string;
}

/** Authenticated user attached to the request by JwtStrategy. */
export interface AuthenticatedUser {
  userId: string;
}
