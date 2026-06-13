/** Single answer entry stored in quiz_attempts.answers JSONB. */
export interface QuizAnswer {
  questionIndex: number;
  selectedAnswerIndex: number;
  isCorrect: boolean;
}
