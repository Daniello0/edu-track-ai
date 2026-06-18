import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizAttempt } from './quiz-attempt.entity';
import { QuizAttemptService } from './quiz-attempt.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuizAttempt])],
  providers: [QuizAttemptService],
  exports: [QuizAttemptService],
})
export class QuizAttemptModule {}
