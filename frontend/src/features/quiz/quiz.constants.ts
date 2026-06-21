/** Minimum score (inclusive) to mark a material as mastered after a quiz attempt. */
export const MASTERED_SCORE_THRESHOLD = 80;

/** Minimum score (inclusive) to keep or restore read status after a quiz attempt. */
export const READ_SCORE_THRESHOLD = 50;

/** Quiz API route paths (relative to /api). */
export const QUIZ_API_ROUTES = {
  SUBMIT_ATTEMPT: (materialId: string) =>
    `/library/${materialId}/quiz/attempts`,
} as const;

/** Validation messages for quiz attempt submission. */
export const QUIZ_VALIDATION_MESSAGES = {
  EMPTY_ANSWERS: 'Ответьте хотя бы на один вопрос.',
  INCOMPLETE_ANSWERS: 'Ответьте на все вопросы перед отправкой.',
  INVALID_QUESTION_INDEX: 'Некорректный номер вопроса.',
  INVALID_OPTION_INDEX: 'Некорректный номер варианта ответа.',
} as const;
