import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAttempt } from './quiz-attempt.entity';
import { QuizAnswer } from './quiz-attempt.types';

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectRepository(QuizAttempt)
    private readonly quizAttemptRepository: Repository<QuizAttempt>,
  ) {}

  /**
   * Persists a graded quiz attempt.
   */
  async create(
    quizId: string,
    score: number,
    answers: QuizAnswer[],
  ): Promise<QuizAttempt> {
    const attempt = this.quizAttemptRepository.create({
      quizId,
      score,
      answers,
    });

    return this.quizAttemptRepository.save(attempt);
  }

  /**
   * Returns attempts for a quiz ordered by creation time descending.
   */
  async findByQuizId(quizId: string): Promise<QuizAttempt[]> {
    return this.quizAttemptRepository.find({
      where: { quizId },
      order: { createdAt: 'DESC' },
    });
  }
}
