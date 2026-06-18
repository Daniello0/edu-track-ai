import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './features/database/database.module';
import { HealthModule } from './features/health/health.module';
import { LibraryModule } from './features/library/library.module';

@Module({
  imports: [HealthModule, DatabaseModule, AuthModule, LibraryModule],
})
export class AppModule {}
