import * as yup from 'yup';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import {
  MASTERED_SCORE_THRESHOLD,
  READ_SCORE_THRESHOLD,
} from './quiz.constants';
import { submitQuizAttemptSchema } from './quiz.schema';
import type {
  QuizAnswerSelections,
  QuizProgress,
  SubmitQuizAnswer,
  SubmitQuizAttemptRequest,
} from './quiz.types';

/**
 * Maps a quiz score to the corresponding material mastery status.
 * Mirrors server-side grading rules from schemas-design.md.
 */
export function resolveMaterialStatusFromScore(score: number): MaterialStatus {
  if (score >= MASTERED_SCORE_THRESHOLD) {
    return MaterialStatus.MASTERED;
  }

  if (score >= READ_SCORE_THRESHOLD) {
    return MaterialStatus.READ;
  }

  return MaterialStatus.RETAKE;
}

/**
 * Builds the API payload for quiz attempt submission from in-progress selections.
 */
export function buildSubmitQuizAttemptRequest(
  selections: QuizAnswerSelections,
  totalQuestions: number,
): SubmitQuizAttemptRequest {
  const answers: SubmitQuizAnswer[] = Array.from(
    { length: totalQuestions },
    (_, questionIndex) => ({
      questionIndex,
      selectedAnswerIndex: selections[questionIndex],
    }),
  );

  return { answers };
}

/**
 * Returns true when every question has a selected answer.
 */
export function areAllQuestionsAnswered(
  selections: QuizAnswerSelections,
  totalQuestions: number,
): boolean {
  if (totalQuestions <= 0) {
    return false;
  }

  for (let index = 0; index < totalQuestions; index += 1) {
    if (selections[index] === undefined) {
      return false;
    }
  }

  return true;
}

/**
 * Derives quiz progress metrics from navigation and selection state.
 */
export function getQuizProgress(
  currentIndex: number,
  totalQuestions: number,
  selections: QuizAnswerSelections,
): QuizProgress {
  const answeredCount = Object.keys(selections).length;

  return {
    currentIndex,
    totalQuestions,
    answeredCount,
    isComplete: areAllQuestionsAnswered(selections, totalQuestions),
  };
}

/**
 * Validates quiz attempt payload and returns the first error message, if any.
 */
export async function validateSubmitQuizAttempt(
  payload: SubmitQuizAttemptRequest,
): Promise<string | null> {
  try {
    await submitQuizAttemptSchema.validate(payload, { abortEarly: true });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }

    throw error;
  }
}
