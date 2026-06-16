import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  DEFAULT_JWT_ACCESS_TTL,
  JWT_ACCESS_SECRET_ENV,
  JWT_ACCESS_TTL_ENV,
} from './auth.constants';
import { AuthController } from './auth.controller';
import { FirebaseAdminService } from './firebase-admin.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>(JWT_ACCESS_SECRET_ENV);
        if (!secret) {
          throw new Error(`Missing required env var: ${JWT_ACCESS_SECRET_ENV}`);
        }

        const expiresIn = (configService.get<string>(JWT_ACCESS_TTL_ENV) ??
          DEFAULT_JWT_ACCESS_TTL) as JwtSignOptions['expiresIn'];

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    FirebaseAdminService,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [
    FirebaseAdminService,
    JwtModule,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
})
export class AuthModule {}
