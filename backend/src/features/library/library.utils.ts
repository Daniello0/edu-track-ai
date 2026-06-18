import { LibraryDetailResponseDto } from '../../common/dto/library/library-detail-response.dto';
import { LibraryItemDto } from '../../common/dto/library/library-item.dto';
import { MaterialSummaryResponseDto } from '../../common/dto/library/material-summary-response.dto';
import { QuizQuestionPublicDto } from '../../common/dto/shared/quiz-question-public.dto';
import { Language } from '../../common/enums/language.enum';
import { Material } from '../material/material.entity';
import { QuizAttempt } from '../quiz-attempt/quiz-attempt.entity';
import { QuizQuestion } from '../quiz/quiz.types';

/**
 * Maps a material entity to a library list item DTO.
 */
export function mapMaterialToLibraryItem(material: Material): LibraryItemDto {
  return {
    id: material.id,
    videoId: material.videoId,
    title: material.title,
    category: material.category,
    format: material.format,
    summaryLength: material.summaryLength,
    language: material.language as Language,
    status: material.status,
    bestScore: material.quiz?.bestScore ?? 0,
    createdAt: material.createdAt,
    lastViewedAt: material.lastViewedAt,
  };
}

/**
 * Maps a material entity to a compact summary DTO.
 */
export function mapMaterialToSummary(
  material: Material,
): MaterialSummaryResponseDto {
  return {
    id: material.id,
    videoId: material.videoId,
    title: material.title,
    category: material.category,
    format: material.format,
    summaryLength: material.summaryLength,
    language: material.language as Language,
    status: material.status,
    isPersisted: true,
  };
}

/**
 * Maps a material entity with quiz relations to a library detail DTO.
 */
export function mapMaterialToDetail(
  material: Material,
): LibraryDetailResponseDto {
  if (!material.quiz) {
    throw new Error(`Material "${material.id}" is missing an attached quiz`);
  }

  return {
    id: material.id,
    videoId: material.videoId,
    title: material.title,
    content: material.content,
    category: material.category,
    format: material.format,
    summaryLength: material.summaryLength,
    language: material.language as Language,
    status: material.status,
    quiz: {
      id: material.quiz.id,
      questions: toPublicQuestions(material.quiz.questions),
      bestScore: material.quiz.bestScore,
      attempts: mapAttempts(material.quiz.attempts ?? []),
    },
    createdAt: material.createdAt,
    lastViewedAt: material.lastViewedAt,
  };
}

function toPublicQuestions(questions: QuizQuestion[]): QuizQuestionPublicDto[] {
  return questions.map(({ question, options }) => ({ question, options }));
}

function mapAttempts(attempts: QuizAttempt[]) {
  return [...attempts]
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      createdAt: attempt.createdAt,
    }));
}
