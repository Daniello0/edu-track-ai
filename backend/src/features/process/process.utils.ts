import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import { ProcessResponseDto } from '../../common/dto/process/process-response.dto';
import { QuizQuestionPublicDto } from '../../common/dto/shared/quiz-question-public.dto';
import { Language } from '../../common/enums/language.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import {
  computeSettingsHash,
  SettingsHashInput,
} from '../../common/utils/settings-hash.utils';
import { CreateMaterialInput } from '../material/material.types';
import { Material } from '../material/material.entity';
import { LlmProcessResult } from '../llm/llm.types';
import { StorePendingMaterialInput } from '../pending/pending.types';
import { QuizQuestion } from '../quiz/quiz.types';

/** Shared LLM output and request metadata for persistence and API mapping. */
export interface ProcessedMaterialContext {
  videoId: string;
  settingsHash: string;
  settings: ProcessSettingsDto;
  llmResult: LlmProcessResult;
}

/**
 * Builds canonical settings-hash input from a video id and request settings.
 */
export function buildSettingsHashInput(
  videoId: string,
  settings: ProcessSettingsDto,
): SettingsHashInput {
  return {
    videoId,
    format: settings.format,
    summaryLength: settings.summaryLength,
    language: settings.language,
    hasQuiz: settings.hasQuiz,
    quizQuestionsCount: settings.hasQuiz ? settings.quizQuestionsCount : 0,
    quizOptionsCount: settings.hasQuiz ? settings.quizOptionsCount : 0,
  };
}

/**
 * Computes the deduplication hash for a video and processing settings.
 */
export function computeProcessSettingsHash(
  videoId: string,
  settings: ProcessSettingsDto,
): string {
  return computeSettingsHash(buildSettingsHashInput(videoId, settings));
}

/**
 * Groups processed LLM output with request metadata for downstream mappers.
 */
export function buildProcessedMaterialContext(
  videoId: string,
  settingsHash: string,
  settings: ProcessSettingsDto,
  llmResult: LlmProcessResult,
): ProcessedMaterialContext {
  return { videoId, settingsHash, settings, llmResult };
}

/**
 * Maps processed output to pending-store input for guest sessions.
 */
export function toPendingStoreInput(
  context: ProcessedMaterialContext,
): StorePendingMaterialInput {
  const { videoId, settingsHash, settings, llmResult } = context;

  return {
    videoId,
    settingsHash,
    title: llmResult.title,
    content: llmResult.content,
    category: llmResult.category,
    format: settings.format,
    summaryLength: settings.summaryLength,
    language: settings.language,
    questions: llmResult.quiz ?? [],
  };
}

/**
 * Maps processed output to material creation input for authenticated users.
 */
export function toCreateMaterialInput(
  userId: string,
  context: ProcessedMaterialContext,
): CreateMaterialInput {
  const {
    videoId,
    settingsHash,
    title,
    content,
    category,
    format,
    summaryLength,
    language,
  } = toPendingStoreInput(context);

  return {
    userId,
    videoId,
    settingsHash,
    title,
    content,
    category,
    format,
    summaryLength,
    language,
    status: MaterialStatus.READ,
  };
}

/**
 * Strips server-only quiz fields before returning questions to clients.
 */
export function toPublicQuizQuestions(
  questions: QuizQuestion[],
): QuizQuestionPublicDto[] {
  return questions.map(({ question, options }) => ({ question, options }));
}

/**
 * Maps an existing persisted material to a process response without AI.
 */
export function mapExistingMaterialToResponse(
  material: Material,
): ProcessResponseDto {
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
    isPersisted: true,
    quiz: material.quiz ? toPublicQuizQuestions(material.quiz.questions) : null,
  };
}

/**
 * Maps a guest processing result with pending-store reference.
 */
export function mapGuestProcessResponse(
  pendingId: string,
  context: ProcessedMaterialContext,
): ProcessResponseDto {
  const { videoId, settings, llmResult } = context;
  const questions = llmResult.quiz ?? [];

  return {
    id: null,
    pendingId,
    videoId,
    title: llmResult.title,
    content: llmResult.content,
    category: llmResult.category,
    format: settings.format,
    summaryLength: settings.summaryLength,
    language: settings.language,
    isPersisted: false,
    quiz: questions.length > 0 ? toPublicQuizQuestions(questions) : null,
  };
}

/**
 * Maps a newly persisted authenticated processing result.
 */
export function mapPersistedProcessResponse(
  materialId: string,
  context: ProcessedMaterialContext,
): ProcessResponseDto {
  const { videoId, settings, llmResult } = context;

  return {
    id: materialId,
    videoId,
    title: llmResult.title,
    content: llmResult.content,
    category: llmResult.category,
    format: settings.format,
    summaryLength: settings.summaryLength,
    language: settings.language,
    status: MaterialStatus.READ,
    isPersisted: true,
    quiz: llmResult.quiz ? toPublicQuizQuestions(llmResult.quiz) : null,
  };
}
