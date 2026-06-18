import { BadRequestException } from '@nestjs/common';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { QuizAnswer } from '../quiz-attempt/quiz-attempt.types';
import {
  MASTERED_SCORE_THRESHOLD,
  READ_SCORE_THRESHOLD,
} from './quiz.constants';
import { QuizQuestion } from './quiz.types';

/** Client-submitted answer used for server-side quiz grading. */
export interface SubmittedQuizAnswer {
  questionIndex: number;
  selectedAnswerIndex: number;
}

/** Result of grading a quiz attempt on the server. */
export interface GradedQuizAttempt {
  score: number;
  answers: QuizAnswer[];
  status: MaterialStatus;
}

/**
 * Maps a quiz score to the corresponding material mastery status.
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
 * Grades submitted answers against stored quiz questions and computes score.
 */
export function gradeQuizAnswers(
  questions: QuizQuestion[],
  submittedAnswers: SubmittedQuizAnswer[],
): GradedQuizAttempt {
  validateSubmittedAnswers(questions, submittedAnswers);

  const answers: QuizAnswer[] = gradeAnswers(submittedAnswers, questions);
  const correctCount = getCorrectAnswerCount(answers);
  const score = computeScore(correctCount, questions.length);

  return {
    score,
    answers,
    status: resolveMaterialStatusFromScore(score),
  };
}

function validateSubmittedAnswers(
  questions: QuizQuestion[],
  submittedAnswers: SubmittedQuizAnswer[],
): void {
  if (questions.length === 0) {
    throw new BadRequestException('Quiz has no questions');
  }

  if (submittedAnswers.length !== questions.length) {
    throw new BadRequestException(
      'Answer count must match the number of quiz questions',
    );
  }

  const seenIndexes = new Set<number>();

  for (const answer of submittedAnswers) {
    if (answer.questionIndex < 0 || answer.questionIndex >= questions.length) {
      throw new BadRequestException('Invalid question index');
    }

    if (seenIndexes.has(answer.questionIndex)) {
      throw new BadRequestException('Duplicate question index in answers');
    }

    seenIndexes.add(answer.questionIndex);
  }
}

function gradeSingleAnswer(
  questions: QuizQuestion[],
  submittedAnswer: SubmittedQuizAnswer,
): QuizAnswer {
  const question = questions[submittedAnswer.questionIndex];
  const isCorrect =
    submittedAnswer.selectedAnswerIndex === question.correctAnswerIndex;

  return {
    questionIndex: submittedAnswer.questionIndex,
    selectedAnswerIndex: submittedAnswer.selectedAnswerIndex,
    isCorrect,
  };
}

function gradeAnswers(
  answers: SubmittedQuizAnswer[],
  questions: QuizQuestion[],
): QuizAnswer[] {
  return answers.map((answer) => gradeSingleAnswer(questions, answer));
}

function getCorrectAnswerCount(answers: QuizAnswer[]): number {
  return answers.filter((answer) => answer.isCorrect).length;
}

function computeScore(correctCount: number, questionsLength: number): number {
  return Math.round((correctCount / questionsLength) * 100);
}
