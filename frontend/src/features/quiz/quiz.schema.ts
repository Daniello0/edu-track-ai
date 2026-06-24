import * as yup from 'yup';
import { QUIZ_VALIDATION_MESSAGES } from './quiz.constants';
import type { SubmitQuizAnswer, SubmitQuizAttemptRequest } from './quiz.types';

const submitQuizAnswerSchema = yup
  .object({
    questionIndex: yup
      .number()
      .integer()
      .min(0, QUIZ_VALIDATION_MESSAGES.INVALID_QUESTION_INDEX)
      .required(),
    selectedAnswerIndex: yup
      .number()
      .integer()
      .min(0, QUIZ_VALIDATION_MESSAGES.INVALID_OPTION_INDEX)
      .required(),
  })
  .required() satisfies yup.ObjectSchema<SubmitQuizAnswer>;

/**
 * Yup schema for POST /api/library/:id/quiz/attempts request body.
 */
export const submitQuizAttemptSchema = yup
  .object({
    answers: yup
      .array()
      .of(submitQuizAnswerSchema)
      .min(1, QUIZ_VALIDATION_MESSAGES.EMPTY_ANSWERS)
      .required(),
  })
  .required() satisfies yup.ObjectSchema<SubmitQuizAttemptRequest>;
