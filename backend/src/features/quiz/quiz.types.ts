/** Single quiz question stored in quizzes.questions JSONB. */
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}
