import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LlmModule } from '../llm/llm.module';
import { MaterialModule } from '../material/material.module';
import { PendingModule } from '../pending/pending.module';
import { QuizModule } from '../quiz/quiz.module';
import { TranscriptModule } from '../transcript/transcript.module';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';

@Module({
  imports: [
    AuthModule,
    TranscriptModule,
    LlmModule,
    MaterialModule,
    QuizModule,
    PendingModule,
  ],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}
