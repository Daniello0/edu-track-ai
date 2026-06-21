import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { QUIZ_API_ROUTES } from './quiz.constants';
import type { SubmitQuizAttemptResponse } from './quiz.types';

const mockPost = vi.fn();
const materialId = '00000000-0000-4000-8000-000000000001';
const accessToken = 'test-access-token';

const submitResponse: SubmitQuizAttemptResponse = {
  attemptId: '00000000-0000-4000-8000-000000000002',
  score: 80,
  bestScore: 80,
  status: MaterialStatus.MASTERED,
  answers: [
    {
      questionIndex: 0,
      selectedAnswerIndex: 1,
      isCorrect: true,
    },
  ],
};

vi.mock('../axios/axios.client', () => ({
  getApiClient: () => ({
    post: (...args: unknown[]) => mockPost(...args),
  }),
}));

describe('quiz.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits quiz attempt with auth header', async () => {
    mockPost.mockResolvedValue({ data: submitResponse });
    const payload = {
      answers: [{ questionIndex: 0, selectedAnswerIndex: 1 }],
    };

    const { submitQuizAttempt } = await import('./quiz.service');
    const result = await submitQuizAttempt(materialId, payload, accessToken);

    expect(mockPost).toHaveBeenCalledWith(
      QUIZ_API_ROUTES.SUBMIT_ATTEMPT(materialId),
      payload,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    expect(result).toEqual(submitResponse);
  });
});
