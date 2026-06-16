import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './features/database/database.module';
import { HealthModule } from './features/health/health.module';

@Module({
  imports: [HealthModule, DatabaseModule, AuthModule],
})
export class AppModule {}
