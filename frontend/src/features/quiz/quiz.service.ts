import { getApiClient } from '../axios/axios.client';
import { QUIZ_API_ROUTES } from './quiz.constants';
import type {
  SubmitQuizAttemptRequest,
  SubmitQuizAttemptResponse,
} from './quiz.types';

const apiClient = getApiClient();

/**
 * Submits quiz answers for server-side grading and persistence.
 */
export async function submitQuizAttempt(
  materialId: string,
  payload: SubmitQuizAttemptRequest,
  accessToken: string,
): Promise<SubmitQuizAttemptResponse> {
  const response = await apiClient.post<SubmitQuizAttemptResponse>(
    QUIZ_API_ROUTES.SUBMIT_ATTEMPT(materialId),
    payload,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
}
