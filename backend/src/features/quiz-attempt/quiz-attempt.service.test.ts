import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuizAttempt } from './quiz-attempt.entity';
import { QuizAttemptService } from './quiz-attempt.service';

const quizId = '770e8400-e29b-41d4-a716-446655440002';

describe('QuizAttemptService', () => {
  let quizAttemptService: QuizAttemptService;

  const quizAttemptRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    quizAttemptRepository.create.mockImplementation(
      (payload: Partial<QuizAttempt>) => payload,
    );
    quizAttemptRepository.save.mockImplementation(
      (payload: Partial<QuizAttempt>) =>
        Promise.resolve({
          id: '880e8400-e29b-41d4-a716-446655440003',
          createdAt: new Date('2026-06-11T10:00:00.000Z'),
          ...payload,
        }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizAttemptService,
        {
          provide: getRepositoryToken(QuizAttempt),
          useValue: quizAttemptRepository,
        },
      ],
    }).compile();

    quizAttemptService = module.get(QuizAttemptService);
  });

  it('creates a quiz attempt', async () => {
    const answers = [
      {
        questionIndex: 0,
        selectedAnswerIndex: 1,
        isCorrect: true,
      },
    ];

    const result = await quizAttemptService.create(quizId, 100, answers);

    expect(result.quizId).toBe(quizId);
    expect(result.score).toBe(100);
    expect(result.answers).toEqual(answers);
  });
});
