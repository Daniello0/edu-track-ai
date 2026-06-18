import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MaterialModule } from '../material/material.module';
import { PendingModule } from '../pending/pending.module';
import { QuizAttemptModule } from '../quiz-attempt/quiz-attempt.module';
import { QuizModule } from '../quiz/quiz.module';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  imports: [
    AuthModule,
    MaterialModule,
    QuizModule,
    QuizAttemptModule,
    PendingModule,
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService, PendingModule],
})
export class LibraryModule {}
