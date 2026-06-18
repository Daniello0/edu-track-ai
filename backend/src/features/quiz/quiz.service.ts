import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { QuizQuestion } from './quiz.types';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  /**
   * Creates a quiz linked to the given material.
   */
  async createForMaterial(
    materialId: string,
    questions: QuizQuestion[],
    manager?: EntityManager,
  ): Promise<Quiz> {
    const repository = this.getRepository(manager);
    const quiz = repository.create({ materialId, questions });
    return repository.save(quiz);
  }

  /**
   * Returns the quiz attached to a material, if any.
   */
  async findByMaterialId(materialId: string): Promise<Quiz | null> {
    return this.quizRepository.findOne({ where: { materialId } });
  }

  /**
   * Updates best_score when the new score is higher.
   */
  async updateBestScoreIfHigher(
    quizId: string,
    score: number,
  ): Promise<number> {
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });

    if (!quiz) {
      return score;
    }

    if (score <= quiz.bestScore) {
      return quiz.bestScore;
    }

    quiz.bestScore = score;
    const saved = await this.quizRepository.save(quiz);
    return saved.bestScore;
  }

  private getRepository(manager?: EntityManager): Repository<Quiz> {
    return manager?.getRepository(Quiz) ?? this.quizRepository;
  }
}
