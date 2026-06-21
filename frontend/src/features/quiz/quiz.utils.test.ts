import { describe, expect, it } from 'vitest';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import {
  MASTERED_SCORE_THRESHOLD,
  READ_SCORE_THRESHOLD,
} from './quiz.constants';
import {
  areAllQuestionsAnswered,
  buildSubmitQuizAttemptRequest,
  getQuizProgress,
  resolveMaterialStatusFromScore,
  validateSubmitQuizAttempt,
} from './quiz.utils';

describe('quiz.utils', () => {
  it('maps score to material status using server thresholds', () => {
    expect(resolveMaterialStatusFromScore(MASTERED_SCORE_THRESHOLD)).toBe(
      MaterialStatus.MASTERED,
    );
    expect(resolveMaterialStatusFromScore(READ_SCORE_THRESHOLD)).toBe(
      MaterialStatus.READ,
    );
    expect(resolveMaterialStatusFromScore(READ_SCORE_THRESHOLD - 1)).toBe(
      MaterialStatus.RETAKE,
    );
  });

  it('builds submit payload from in-progress selections', () => {
    const payload = buildSubmitQuizAttemptRequest({ 0: 2, 1: 0 }, 2);

    expect(payload.answers).toEqual([
      { questionIndex: 0, selectedAnswerIndex: 2 },
      { questionIndex: 1, selectedAnswerIndex: 0 },
    ]);
  });

  it('checks whether all questions are answered', () => {
    expect(areAllQuestionsAnswered({ 0: 1 }, 2)).toBe(false);
    expect(areAllQuestionsAnswered({ 0: 1, 1: 0 }, 2)).toBe(true);
  });

  it('derives quiz progress metrics', () => {
    const progress = getQuizProgress(1, 3, { 0: 2, 1: 1 });

    expect(progress).toEqual({
      currentIndex: 1,
      totalQuestions: 3,
      answeredCount: 2,
      isComplete: false,
    });
  });

  it('validates submit attempt payload', async () => {
    expect(
      await validateSubmitQuizAttempt({
        answers: [{ questionIndex: 0, selectedAnswerIndex: 1 }],
      }),
    ).toBeNull();

    expect(await validateSubmitQuizAttempt({ answers: [] })).toBeTruthy();
  });
});
