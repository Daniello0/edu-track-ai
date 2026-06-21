import axios from 'axios';
import { QUIZ_API_ROUTES } from './quiz.constants';
import type {
  SubmitQuizAttemptRequest,
  SubmitQuizAttemptResponse,
} from './quiz.types';

// FIXME: DRY and SRP violation - move axios creation to a separate file.
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

/**
 * Creates an axios client instance for API calls (used in tests).
 */
export function getQuizApiClient(): typeof apiClient {
  return apiClient;
}
