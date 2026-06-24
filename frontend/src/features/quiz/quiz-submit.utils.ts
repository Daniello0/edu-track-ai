import { resolveApiError } from '../../common/utils/api-error.utils';
import { QUIZ_VALIDATION_MESSAGES } from './quiz.constants';
import { submitQuizAttempt } from './quiz.service';
import type {
  QuizAnswerSelections,
  SubmitQuizAttemptResponse,
} from './quiz.types';
import {
  areAllQuestionsAnswered,
  buildSubmitQuizAttemptRequest,
} from './quiz.utils';

/** Callbacks invoked when submitting a persisted quiz attempt. */
export interface SubmitQuizHandlers {
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  onSuccess: (response: SubmitQuizAttemptResponse) => void;
}

/**
 * Submits quiz answers to the server for grading and persistence.
 */
export async function submitPersistedQuizAttempt(
  materialId: string,
  selections: QuizAnswerSelections,
  totalQuestions: number,
  accessToken: string,
  handlers: SubmitQuizHandlers,
): Promise<void> {
  if (!validateAllQuestionsAnswered(handlers, selections, totalQuestions)) {
    return;
  }

  handlers.setIsSubmitting(true);
  handlers.setError(null);

  try {
    const payload = buildSubmitQuizAttemptRequest(selections, totalQuestions);
    const response = await submitQuizAttempt(materialId, payload, accessToken);
    handlers.onSuccess(response);
  } catch (error) {
    handlers.setError(resolveApiError(error));
  } finally {
    handlers.setIsSubmitting(false);
  }
}

/**
 * Returns true when quiz results can be verified on the server.
 */
export function canSubmitQuizToServer(
  isLoggedIn: boolean,
  isPersisted: boolean,
  materialId: string | null,
  accessToken: string | null,
): boolean {
  return (
    isLoggedIn && isPersisted && materialId !== null && accessToken !== null
  );
}

function validateAllQuestionsAnswered(
  handlers: SubmitQuizHandlers,
  selections: QuizAnswerSelections,
  totalQuestions: number,
): boolean {
  if (!areAllQuestionsAnswered(selections, totalQuestions)) {
    handlers.setError(QUIZ_VALIDATION_MESSAGES.INCOMPLETE_ANSWERS);
    return false;
  }
  return true;
}
