import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { Language } from '../../common/enums/language.enum';
import { Material } from '../material/material.entity';
import { MaterialService } from '../material/material.service';
import { PendingService } from '../pending/pending.service';
import { QuizAttemptService } from '../quiz-attempt/quiz-attempt.service';
import { Quiz } from '../quiz/quiz.entity';
import { QuizService } from '../quiz/quiz.service';
import { LibraryService } from './library.service';

const userId = '550e8400-e29b-41d4-a716-446655440000';
const materialId = '660e8400-e29b-41d4-a716-446655440001';
const quizId = '770e8400-e29b-41d4-a716-446655440002';

const mockQuiz: Quiz = {
  id: quizId,
  materialId,
  questions: [
    {
      question: 'Q1',
      options: ['A', 'B', 'C'],
      correctAnswerIndex: 1,
    },
    {
      question: 'Q2',
      options: ['A', 'B'],
      correctAnswerIndex: 0,
    },
  ],
  bestScore: 0,
  material: {} as Quiz['material'],
  attempts: [],
};

const mockMaterial: Material = {
  id: materialId,
  userId,
  videoId: 'VIDEO_ID',
  settingsHash: 'hash-123',
  title: 'TypeScript Basics',
  content: '# Content',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.READ,
  createdAt: new Date('2026-06-11T10:00:00.000Z'),
  lastViewedAt: new Date('2026-06-11T12:00:00.000Z'),
  user: {} as Material['user'],
  quiz: mockQuiz,
};

describe('LibraryService', () => {
  let libraryService: LibraryService;

  const materialService = {
    findAllByUserId: vi.fn(),
    findByIdForUser: vi.fn(),
    findByUserAndSettingsHash: vi.fn(),
    updateStatus: vi.fn(),
    touchLastViewedAt: vi.fn(),
    deleteForUser: vi.fn(),
    create: vi.fn(),
  };

  const quizService = {
    createForMaterial: vi.fn(),
    updateBestScoreIfHigher: vi.fn(),
  };

  const quizAttemptService = {
    create: vi.fn(),
  };

  const pendingService = {
    consume: vi.fn(),
  };

  const dataSource = {
    transaction: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    dataSource.transaction.mockImplementation(
      async (callback: (manager: unknown) => Promise<Material>) => callback({}),
    );
    materialService.create.mockResolvedValue(mockMaterial);
    materialService.findByUserAndSettingsHash.mockResolvedValue(null);
    materialService.findByIdForUser.mockResolvedValue({ ...mockMaterial });
    materialService.touchLastViewedAt.mockResolvedValue({
      ...mockMaterial,
      lastViewedAt: new Date('2026-06-11T13:00:00.000Z'),
    });
    materialService.updateStatus.mockResolvedValue({
      ...mockMaterial,
      status: MaterialStatus.MASTERED,
    });
    quizService.updateBestScoreIfHigher.mockResolvedValue(100);
    quizAttemptService.create.mockResolvedValue({
      id: '880e8400-e29b-41d4-a716-446655440003',
      quizId,
      score: 100,
      answers: [],
      createdAt: new Date('2026-06-11T10:00:00.000Z'),
    });
    pendingService.consume.mockReturnValue({
      id: 'pending-id',
      videoId: 'VIDEO_ID',
      settingsHash: 'hash-123',
      title: 'TypeScript Basics',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      questions: mockQuiz.questions,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        { provide: MaterialService, useValue: materialService },
        { provide: QuizService, useValue: quizService },
        { provide: QuizAttemptService, useValue: quizAttemptService },
        { provide: PendingService, useValue: pendingService },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    libraryService = module.get(LibraryService);
  });

  it('returns library items with best score', async () => {
    materialService.findAllByUserId.mockResolvedValue([
      { ...mockMaterial, quiz: { ...mockQuiz, bestScore: 80 } },
    ]);

    const result = await libraryService.getLibrary(userId);

    expect(result.items[0]?.bestScore).toBe(80);
  });

  it('returns existing material on claim dedup', async () => {
    materialService.findByUserAndSettingsHash.mockResolvedValue(mockMaterial);

    const result = await libraryService.claimPending(userId, 'pending-id');

    expect(result.created).toBe(false);
    expect(result.summary.id).toBe(materialId);
    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('creates material and quiz when claim has no dedup match', async () => {
    const result = await libraryService.claimPending(userId, 'pending-id');

    expect(result.created).toBe(true);
    expect(dataSource.transaction).toHaveBeenCalled();
    expect(materialService.create).toHaveBeenCalled();
    expect(quizService.createForMaterial).toHaveBeenCalled();
  });

  it('grades quiz attempt and updates status', async () => {
    const result = await libraryService.submitQuizAttempt(userId, materialId, {
      answers: [
        { questionIndex: 0, selectedAnswerIndex: 1 },
        { questionIndex: 1, selectedAnswerIndex: 0 },
      ],
    });

    expect(result.score).toBe(100);
    expect(result.status).toBe(MaterialStatus.MASTERED);
    expect(quizAttemptService.create).toHaveBeenCalled();
  });

  it('throws when submitting attempt for material without quiz', async () => {
    materialService.findByIdForUser.mockResolvedValue({
      ...mockMaterial,
      quiz: undefined,
    });

    await expect(
      libraryService.submitQuizAttempt(userId, materialId, {
        answers: [{ questionIndex: 0, selectedAnswerIndex: 0 }],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
