import { describe, expect, it } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { Language } from '../../common/enums/language.enum';
import { Material } from '../material/material.entity';
import { QuizAttempt } from '../quiz-attempt/quiz-attempt.entity';
import { Quiz } from '../quiz/quiz.entity';
import {
  mapMaterialToDetail,
  mapMaterialToLibraryItem,
  mapMaterialToSummary,
} from './library.utils';

const quiz: Quiz = {
  id: '770e8400-e29b-41d4-a716-446655440002',
  materialId: '660e8400-e29b-41d4-a716-446655440001',
  questions: [
    {
      question: 'Q1',
      options: ['A', 'B'],
      correctAnswerIndex: 0,
    },
  ],
  bestScore: 80,
  material: {} as Quiz['material'],
  attempts: [],
};

const material: Material = {
  id: '660e8400-e29b-41d4-a716-446655440001',
  userId: '550e8400-e29b-41d4-a716-446655440000',
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
  quiz,
};

describe('library.utils', () => {
  it('maps material to library item with best score', () => {
    const result = mapMaterialToLibraryItem(material);

    expect(result.bestScore).toBe(80);
    expect(result.title).toBe(material.title);
  });

  it('maps material to summary with isPersisted true', () => {
    const result = mapMaterialToSummary(material);

    expect(result.isPersisted).toBe(true);
    expect(result.status).toBe(MaterialStatus.READ);
  });

  it('strips correctAnswerIndex from quiz questions in detail mapping', () => {
    const attempts: QuizAttempt[] = [
      {
        id: '880e8400-e29b-41d4-a716-446655440003',
        quizId: quiz.id,
        score: 80,
        answers: [],
        createdAt: new Date('2026-06-11T10:00:00.000Z'),
        quiz: {} as QuizAttempt['quiz'],
      },
    ];

    const result = mapMaterialToDetail({
      ...material,
      quiz: { ...quiz, attempts },
    });

    expect(result.quiz.questions).toEqual([
      { question: 'Q1', options: ['A', 'B'] },
    ]);
    expect(result.quiz.attempts[0]?.score).toBe(80);
  });
});
