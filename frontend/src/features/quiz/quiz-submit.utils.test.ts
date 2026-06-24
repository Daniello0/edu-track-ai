import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { QUIZ_VALIDATION_MESSAGES } from './quiz.constants';

const mockSubmitQuizAttempt = vi.fn();

vi.mock('./quiz.service', () => ({
  submitQuizAttempt: (...args: unknown[]) => mockSubmitQuizAttempt(...args),
}));

describe('quiz-submit.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects when quiz can be submitted to the server', async () => {
    const { canSubmitQuizToServer } = await import('./quiz-submit.utils');

    expect(canSubmitQuizToServer(true, true, 'material-1', 'token')).toBe(true);
    expect(canSubmitQuizToServer(true, false, 'material-1', 'token')).toBe(
      false,
    );
  });

  it('submits persisted quiz attempt through the quiz service', async () => {
    const response = {
      attemptId: 'attempt-1',
      score: 100,
      bestScore: 100,
      status: MaterialStatus.MASTERED,
      answers: [],
    };
    mockSubmitQuizAttempt.mockResolvedValue(response);
    const onSuccess = vi.fn();
    const setError = vi.fn();
    const setIsSubmitting = vi.fn();

    const { submitPersistedQuizAttempt } = await import('./quiz-submit.utils');
    await submitPersistedQuizAttempt('material-1', { 0: 1, 1: 0 }, 2, 'token', {
      onSuccess,
      setError,
      setIsSubmitting,
    });

    expect(mockSubmitQuizAttempt).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(response);
  });

  it('returns validation error when answers are incomplete', async () => {
    const onSuccess = vi.fn();
    const setError = vi.fn();
    const setIsSubmitting = vi.fn();

    const { submitPersistedQuizAttempt } = await import('./quiz-submit.utils');
    await submitPersistedQuizAttempt('material-1', { 0: 1 }, 2, 'token', {
      onSuccess,
      setError,
      setIsSubmitting,
    });

    expect(setError).toHaveBeenCalledWith(
      QUIZ_VALIDATION_MESSAGES.INCOMPLETE_ANSWERS,
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
