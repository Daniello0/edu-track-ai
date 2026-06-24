import type { QuizQuestionPublic } from '../../common/types/app.types';
import { MaterialStatus } from '../../common/enums/material-status.enum';

/** Single answer submitted for server-side quiz grading. */
export interface SubmitQuizAnswer {
  questionIndex: number;
  selectedAnswerIndex: number;
}

/** Graded answer returned after quiz attempt submission. */
export interface GradedQuizAnswer extends SubmitQuizAnswer {
  isCorrect: boolean;
}

/** Payload for POST /api/library/:id/quiz/attempts. */
export interface SubmitQuizAttemptRequest {
  answers: SubmitQuizAnswer[];
}

/** Response from POST /api/library/:id/quiz/attempts. */
export interface SubmitQuizAttemptResponse {
  attemptId: string;
  score: number;
  bestScore: number;
  status: MaterialStatus;
  answers: GradedQuizAnswer[];
}

/** In-progress quiz selections keyed by question index. */
export type QuizAnswerSelections = Record<number, number>;

/** Quiz session progress derived from selections and navigation state. */
export interface QuizProgress {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  isComplete: boolean;
}

/** Minimal quiz payload required to start an interactive session. */
export interface QuizSessionPayload {
  questions: QuizQuestionPublic[];
}
