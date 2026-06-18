import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProcessRequestDto } from '../../common/dto/process/process-request.dto';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { Language } from '../../common/enums/language.enum';
import { Material } from '../material/material.entity';
import { MaterialService } from '../material/material.service';
import { LlmService } from '../llm/llm.service';
import { PendingService } from '../pending/pending.service';
import { QuizService } from '../quiz/quiz.service';
import { TranscriptService } from '../transcript/transcript.service';
import { ProcessService } from './process.service';

const userId = '550e8400-e29b-41d4-a716-446655440000';
const materialId = '660e8400-e29b-41d4-a716-446655440001';
const videoId = 'dQw4w9WgXcQ';

const request: ProcessRequestDto = {
  videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
  settings: {
    format: MaterialFormat.NARRATIVE,
    summaryLength: null,
    language: Language.RU,
    hasQuiz: true,
    quizQuestionsCount: 5,
    quizOptionsCount: 4,
  },
};

const llmResult = {
  title: 'Processed Title',
  content: '# Processed content',
  category: MaterialCategory.PROGRAMMING,
  quiz: [
    {
      question: 'Q1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswerIndex: 1,
    },
  ],
};

const existingMaterial: Material = {
  id: materialId,
  userId,
  videoId,
  settingsHash: 'existing-hash',
  title: 'Existing Title',
  content: '# Existing content',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.READ,
  createdAt: new Date('2026-06-11T10:00:00.000Z'),
  lastViewedAt: new Date('2026-06-11T12:00:00.000Z'),
  user: {} as Material['user'],
  quiz: {
    id: 'quiz-id',
    materialId,
    questions: llmResult.quiz,
    bestScore: 0,
    material: {} as Material,
    attempts: [],
  },
};

describe('ProcessService', () => {
  let processService: ProcessService;

  const materialService = {
    findByUserAndSettingsHash: vi.fn(),
    create: vi.fn(),
  };

  const transcriptService = {
    fetchTranscript: vi.fn(),
  };

  const llmService = {
    processTranscript: vi.fn(),
  };

  const quizService = {
    createForMaterial: vi.fn(),
  };

  const pendingService = {
    store: vi.fn(),
  };

  const dataSource = {
    transaction: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    dataSource.transaction.mockImplementation(
      async (callback: (manager: unknown) => Promise<Material>) => callback({}),
    );
    materialService.findByUserAndSettingsHash.mockResolvedValue(null);
    materialService.create.mockResolvedValue(existingMaterial);
    transcriptService.fetchTranscript.mockResolvedValue({
      videoId,
      text: 'raw transcript text',
      languageCode: 'en',
      isGenerated: true,
      durationSeconds: 120,
    });
    llmService.processTranscript.mockResolvedValue(llmResult);
    pendingService.store.mockReturnValue('pending-id');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessService,
        { provide: MaterialService, useValue: materialService },
        { provide: TranscriptService, useValue: transcriptService },
        { provide: LlmService, useValue: llmService },
        { provide: QuizService, useValue: quizService },
        { provide: PendingService, useValue: pendingService },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    processService = module.get(ProcessService);
  });

  it('returns existing material for authenticated user without AI pipeline', async () => {
    materialService.findByUserAndSettingsHash.mockResolvedValue(
      existingMaterial,
    );

    const result = await processService.process(request, userId);

    expect(transcriptService.fetchTranscript).not.toHaveBeenCalled();
    expect(llmService.processTranscript).not.toHaveBeenCalled();
    expect(result.isPersisted).toBe(true);
    expect(result.id).toBe(materialId);
    expect(result.title).toBe('Existing Title');
    expect(result.quiz?.[0]?.options).toEqual(['A', 'B', 'C', 'D']);
    expect(result.quiz?.[0]).not.toHaveProperty('correctAnswerIndex');
  });

  it('stores guest result in pending and returns pendingId', async () => {
    const result = await processService.process(request);

    expect(transcriptService.fetchTranscript).toHaveBeenCalledWith(videoId);
    expect(llmService.processTranscript).toHaveBeenCalled();
    expect(pendingService.store).toHaveBeenCalled();
    expect(dataSource.transaction).not.toHaveBeenCalled();
    expect(result.isPersisted).toBe(false);
    expect(result.id).toBeNull();
    expect(result.pendingId).toBe('pending-id');
  });

  it('persists material and quiz for authenticated user', async () => {
    const result = await processService.process(request, userId);

    expect(dataSource.transaction).toHaveBeenCalled();
    expect(materialService.create).toHaveBeenCalled();
    expect(quizService.createForMaterial).toHaveBeenCalled();
    expect(pendingService.store).not.toHaveBeenCalled();
    expect(result.isPersisted).toBe(true);
    expect(result.id).toBe(materialId);
    expect(result.title).toBe('Processed Title');
  });

  it('returns null quiz when processing without quiz', async () => {
    llmService.processTranscript.mockResolvedValue({
      ...llmResult,
      quiz: null,
    });

    const result = await processService.process(
      {
        ...request,
        settings: {
          ...request.settings,
          hasQuiz: false,
        },
      },
      userId,
    );

    expect(quizService.createForMaterial).not.toHaveBeenCalled();
    expect(result.quiz).toBeNull();
  });
});
