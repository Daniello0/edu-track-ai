import { Module } from '@nestjs/common';
import { DatabaseModule } from './features/database/database.module';
import { HealthModule } from './features/health/health.module';

@Module({
  imports: [HealthModule, DatabaseModule],
})
export class AppModule {}
