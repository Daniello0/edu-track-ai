import { Module } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './features/database/database.module';
import { HealthModule } from './features/health/health.module';
import { LibraryModule } from './features/library/library.module';
import { ProcessModule } from './features/process/process.module';
import { TranscriptModule } from './features/transcript/transcript.module';

@Module({
  imports: [
    HealthModule,
    DatabaseModule,
    AuthModule,
    LibraryModule,
    ProcessModule,
    TranscriptModule,
  ],
})
export class AppModule {}
