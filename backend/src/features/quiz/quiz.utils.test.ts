import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { QuizQuestion } from './quiz.types';
import { gradeQuizAnswers, resolveMaterialStatusFromScore } from './quiz.utils';

const questions: QuizQuestion[] = [
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
  {
    question: 'Q3',
    options: ['A', 'B', 'C', 'D', 'E'],
    correctAnswerIndex: 4,
  },
  {
    question: 'Q4',
    options: ['A', 'B'],
    correctAnswerIndex: 1,
  },
  {
    question: 'Q5',
    options: ['A', 'B', 'C'],
    correctAnswerIndex: 2,
  },
];

describe('resolveMaterialStatusFromScore', () => {
  it('returns mastered for scores at or above 80', () => {
    expect(resolveMaterialStatusFromScore(80)).toBe(MaterialStatus.MASTERED);
    expect(resolveMaterialStatusFromScore(100)).toBe(MaterialStatus.MASTERED);
  });

  it('returns read for scores from 50 to 79', () => {
    expect(resolveMaterialStatusFromScore(50)).toBe(MaterialStatus.READ);
    expect(resolveMaterialStatusFromScore(79)).toBe(MaterialStatus.READ);
  });

  it('returns retake for scores below 50', () => {
    expect(resolveMaterialStatusFromScore(49)).toBe(MaterialStatus.RETAKE);
    expect(resolveMaterialStatusFromScore(0)).toBe(MaterialStatus.RETAKE);
  });
});

describe('gradeQuizAnswers', () => {
  it('grades answers and computes score percentage', () => {
    const result = gradeQuizAnswers(questions, [
      { questionIndex: 0, selectedAnswerIndex: 1 },
      { questionIndex: 1, selectedAnswerIndex: 0 },
      { questionIndex: 2, selectedAnswerIndex: 4 },
      { questionIndex: 3, selectedAnswerIndex: 0 },
      { questionIndex: 4, selectedAnswerIndex: 2 },
    ]);

    expect(result.score).toBe(80);
    expect(result.status).toBe(MaterialStatus.MASTERED);
    expect(result.answers).toEqual([
      {
        questionIndex: 0,
        selectedAnswerIndex: 1,
        isCorrect: true,
      },
      {
        questionIndex: 1,
        selectedAnswerIndex: 0,
        isCorrect: true,
      },
      {
        questionIndex: 2,
        selectedAnswerIndex: 4,
        isCorrect: true,
      },
      {
        questionIndex: 3,
        selectedAnswerIndex: 0,
        isCorrect: false,
      },
      {
        questionIndex: 4,
        selectedAnswerIndex: 2,
        isCorrect: true,
      },
    ]);
  });

  it('throws when answer count does not match question count', () => {
    expect(() =>
      gradeQuizAnswers(questions, [
        { questionIndex: 0, selectedAnswerIndex: 1 },
      ]),
    ).toThrow(BadRequestException);
  });

  it('throws when question indexes are duplicated', () => {
    expect(() =>
      gradeQuizAnswers(questions, [
        { questionIndex: 0, selectedAnswerIndex: 1 },
        { questionIndex: 0, selectedAnswerIndex: 1 },
        { questionIndex: 2, selectedAnswerIndex: 4 },
        { questionIndex: 3, selectedAnswerIndex: 1 },
        { questionIndex: 4, selectedAnswerIndex: 2 },
      ]),
    ).toThrow(BadRequestException);
  });
});
