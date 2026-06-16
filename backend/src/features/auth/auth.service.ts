import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLogoutRequestDto } from '../../common/dto/auth/auth-logout-request.dto';
import { AuthRefreshRequestDto } from '../../common/dto/auth/auth-refresh-request.dto';
import { AuthRefreshResponseDto } from '../../common/dto/auth/auth-refresh-response.dto';
import { AuthSessionRequestDto } from '../../common/dto/auth/auth-session-request.dto';
import { AuthSessionResponseDto } from '../../common/dto/auth/auth-session-response.dto';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { DEFAULT_JWT_REFRESH_TTL, JWT_REFRESH_TTL_ENV } from './auth.constants';
import {
  computeRefreshTokenExpiresAt,
  generateOpaqueRefreshToken,
  hashRefreshToken,
  mapUserToAuthUser,
} from './auth.utils';
import { FirebaseAdminService } from './firebase-admin.service';

/** Handles Firebase session exchange, refresh rotation, and logout. */
@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Exchanges a Firebase ID token for API access and refresh tokens.
   */
  async createSession(
    dto: AuthSessionRequestDto,
  ): Promise<AuthSessionResponseDto> {
    const credentials = await this.verifyFirebaseCredentials(dto.idToken);
    const user = await this.userService.upsertByFirebaseUid(
      credentials.firebaseUid,
      credentials.email,
    );
    const tokenPair = await this.issueTokenPair(user);

    return {
      ...tokenPair,
      user: mapUserToAuthUser(user),
    };
  }

  /**
   * Rotates a refresh token and issues a new access token pair.
   */
  async refreshSession(
    dto: AuthRefreshRequestDto,
  ): Promise<AuthRefreshResponseDto> {
    const storedToken = await this.findStoredRefreshToken(dto.refreshToken);
    this.assertRefreshTokenIsValid(storedToken);

    return this.refreshTokenRepository.manager.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(RefreshToken);
      await tokenRepository.delete({ id: storedToken.id });
      return this.issueTokenPair(storedToken.user, tokenRepository);
    });
  }

  /**
   * Revokes a refresh token by deleting its hash from storage.
   */
  async logout(dto: AuthLogoutRequestDto): Promise<void> {
    const tokenHash = hashRefreshToken(dto.refreshToken);
    await this.refreshTokenRepository.delete({ tokenHash });
  }

  private async verifyFirebaseCredentials(
    idToken: string,
  ): Promise<{ firebaseUid: string; email: string }> {
    try {
      const decoded = await this.firebaseAdminService.verifyIdToken(idToken);
      if (!decoded.email) {
        throw new UnauthorizedException('Firebase token is missing email');
      }
      return { firebaseUid: decoded.uid, email: decoded.email };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }

  private async issueTokenPair(
    user: User,
    repository: Repository<RefreshToken> = this.refreshTokenRepository,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.persistRefreshToken(user.id, repository);
    return {
      accessToken: this.signAccessToken(user),
      refreshToken,
    };
  }

  private signAccessToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  private async persistRefreshToken(
    userId: string,
    repository: Repository<RefreshToken>,
  ): Promise<string> {
    const refreshToken = generateOpaqueRefreshToken();
    const entity = repository.create({
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: this.buildRefreshTokenExpiry(),
    });
    await repository.save(entity);
    return refreshToken;
  }

  private buildRefreshTokenExpiry(): Date {
    const ttl =
      this.configService.get<string>(JWT_REFRESH_TTL_ENV) ??
      DEFAULT_JWT_REFRESH_TTL;
    return computeRefreshTokenExpiresAt(ttl);
  }

  private async findStoredRefreshToken(
    refreshToken: string,
  ): Promise<RefreshToken> {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return storedToken;
  }

  private assertRefreshTokenIsValid(storedToken: RefreshToken): void {
    if (storedToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
