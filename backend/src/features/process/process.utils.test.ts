import { describe, expect, it } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import { Material } from '../material/material.entity';
import { LlmProcessResult } from '../llm/llm.types';
import { QuizQuestion } from '../quiz/quiz.types';
import {
  buildProcessedMaterialContext,
  buildSettingsHashInput,
  mapExistingMaterialToResponse,
  mapGuestProcessResponse,
  mapPersistedProcessResponse,
  toCreateMaterialInput,
  toPendingStoreInput,
  toPublicQuizQuestions,
} from './process.utils';

const settings: ProcessSettingsDto = {
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  hasQuiz: true,
  quizQuestionsCount: 5,
  quizOptionsCount: 4,
};

const questions: QuizQuestion[] = [
  {
    question: 'What is TypeScript?',
    options: ['A language', 'A database'],
    correctAnswerIndex: 0,
  },
];

const llmResult: LlmProcessResult = {
  title: 'Title',
  content: '# Content',
  category: MaterialCategory.PROGRAMMING,
  quiz: questions,
};

const context = buildProcessedMaterialContext(
  'VIDEO_ID',
  'settings-hash',
  settings,
  llmResult,
);

describe('process.utils', () => {
  it('builds settings hash input from video id and settings', () => {
    expect(buildSettingsHashInput('VIDEO_ID', settings)).toEqual({
      videoId: 'VIDEO_ID',
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      hasQuiz: true,
      quizQuestionsCount: 5,
      quizOptionsCount: 4,
    });
  });

  it('uses zero quiz counts when quiz is disabled', () => {
    expect(
      buildSettingsHashInput('VIDEO_ID', {
        ...settings,
        hasQuiz: false,
      }),
    ).toEqual({
      videoId: 'VIDEO_ID',
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      hasQuiz: false,
      quizQuestionsCount: 0,
      quizOptionsCount: 0,
    });
  });

  it('maps processed output to pending store input', () => {
    expect(toPendingStoreInput(context)).toEqual({
      videoId: 'VIDEO_ID',
      settingsHash: 'settings-hash',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      questions,
    });
  });

  it('maps processed output to create material input', () => {
    expect(toCreateMaterialInput('user-id', context)).toEqual({
      userId: 'user-id',
      videoId: 'VIDEO_ID',
      settingsHash: 'settings-hash',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      status: MaterialStatus.READ,
    });
  });

  it('strips correctAnswerIndex from quiz questions', () => {
    expect(toPublicQuizQuestions(questions)).toEqual([
      {
        question: 'What is TypeScript?',
        options: ['A language', 'A database'],
      },
    ]);
  });

  it('maps existing material to persisted process response', () => {
    const material = {
      id: 'material-id',
      videoId: 'VIDEO_ID',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      status: MaterialStatus.READ,
      quiz: { questions },
    } as Material;

    expect(mapExistingMaterialToResponse(material)).toEqual({
      id: 'material-id',
      videoId: 'VIDEO_ID',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      status: MaterialStatus.READ,
      isPersisted: true,
      quiz: toPublicQuizQuestions(questions),
    });
  });

  it('maps guest response with pending id', () => {
    expect(mapGuestProcessResponse('pending-id', context)).toEqual({
      id: null,
      pendingId: 'pending-id',
      videoId: 'VIDEO_ID',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      isPersisted: false,
      quiz: toPublicQuizQuestions(questions),
    });
  });

  it('maps persisted response for authenticated users', () => {
    expect(mapPersistedProcessResponse('material-id', context)).toEqual({
      id: 'material-id',
      videoId: 'VIDEO_ID',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      status: MaterialStatus.READ,
      isPersisted: true,
      quiz: toPublicQuizQuestions(questions),
    });
  });
});
