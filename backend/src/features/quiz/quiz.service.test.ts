import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Quiz } from './quiz.entity';
import { QuizService } from './quiz.service';

const quizId = '770e8400-e29b-41d4-a716-446655440002';
const materialId = '660e8400-e29b-41d4-a716-446655440001';

const mockQuiz: Quiz = {
  id: quizId,
  materialId,
  questions: [
    {
      question: 'Q1',
      options: ['A', 'B'],
      correctAnswerIndex: 0,
    },
  ],
  bestScore: 60,
  material: {} as Quiz['material'],
  attempts: [],
};

describe('QuizService', () => {
  let quizService: QuizService;

  const quizRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    quizRepository.create.mockImplementation(
      (payload: Partial<Quiz>) => payload,
    );
    quizRepository.save.mockImplementation((payload: Partial<Quiz>) =>
      Promise.resolve({ ...mockQuiz, ...payload }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: getRepositoryToken(Quiz),
          useValue: quizRepository,
        },
      ],
    }).compile();

    quizService = module.get(QuizService);
  });

  it('creates a quiz for a material', async () => {
    const result = await quizService.createForMaterial(
      materialId,
      mockQuiz.questions,
    );

    expect(result.materialId).toBe(materialId);
    expect(quizRepository.save).toHaveBeenCalled();
  });

  it('updates best score only when the new score is higher', async () => {
    quizRepository.findOne.mockResolvedValue({ ...mockQuiz, bestScore: 60 });

    const result = await quizService.updateBestScoreIfHigher(quizId, 80);

    expect(result).toBe(80);
  });

  it('keeps existing best score when the new score is lower', async () => {
    quizRepository.findOne.mockResolvedValue({ ...mockQuiz, bestScore: 80 });

    const result = await quizService.updateBestScoreIfHigher(quizId, 60);

    expect(result).toBe(80);
    expect(quizRepository.save).not.toHaveBeenCalled();
  });
});
