import { MaterialCategory } from '../../common/enums/material-category.enum';
import { Language } from '../../common/enums/language.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import { TRANSCRIPT_CHUNK_MAX_CHARS } from './llm.constants';
import {
  AiChunkMapResponse,
  AiMaterialResponse,
  AiQuizQuestion,
  LlmProcessResult,
} from './llm.types';

const MATERIAL_CATEGORY_VALUES = new Set<string>(
  Object.values(MaterialCategory),
);

/**
 * Splits a long transcript into chunks suitable for MapReduce processing.
 */
export function chunkTranscript(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = findChunkEnd(text, start, maxChars);
    chunks.push(text.slice(start, end).trim());
    start = end;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}

/**
 * Maps Groq structured output to the internal material processing result.
 */
export function mapAiResponseToResult(
  response: AiMaterialResponse,
  hasQuiz: boolean,
): LlmProcessResult {
  return {
    title: response.title,
    content: response.processedText,
    category: response.category,
    quiz: hasQuiz ? mapQuizQuestions(response.quiz) : null,
  };
}

/**
 * Validates that parsed AI output conforms to the expected structured shape.
 */
export function validateAiMaterialResponse(
  value: unknown,
  settings: ProcessSettingsDto,
): value is AiMaterialResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.title) &&
    isMaterialCategory(value.category) &&
    isNonEmptyString(value.processedText) &&
    isValidQuizArray(value.quiz, settings)
  );
}

/**
 * Validates that a chunk map response conforms to the expected shape.
 */
export function validateAiChunkMapResponse(
  value: unknown,
): value is AiChunkMapResponse {
  return isRecord(value) && isNonEmptyString(value.processedText);
}

/**
 * Builds the system prompt for full material processing.
 */
export function buildMaterialSystemPrompt(
  settings: ProcessSettingsDto,
): string {
  const formatInstruction = buildFormatInstruction(settings);
  const languageInstruction = buildLanguageInstruction(settings.language);
  const quizInstruction = buildQuizInstruction(settings);

  return [
    'You are an educational content processor for EduTrack AI.',
    'Fix typos, punctuation, and transcription errors in the source transcript.',
    'Choose exactly one MaterialCategory that best matches the lecture topic.',
    formatInstruction,
    languageInstruction,
    quizInstruction,
    'Return only valid JSON matching the provided schema.',
  ].join(' ');
}

/**
 * Builds the user prompt for full material processing.
 */
export function buildMaterialUserPrompt(
  transcriptText: string,
  isReduceStep: boolean,
): string {
  if (isReduceStep) {
    return [
      'Combine the following partial lecture segments into one coherent material.',
      'Preserve factual accuracy and remove duplicate content between segments.',
      'Partial segments:',
      transcriptText,
    ].join('\n\n');
  }

  return ['Process the following video transcript:', transcriptText].join(
    '\n\n',
  );
}

/**
 * Builds prompts for mapping a single transcript chunk.
 */
export function buildChunkMapPrompts(
  chunkText: string,
  chunkIndex: number,
  totalChunks: number,
  settings: ProcessSettingsDto,
): { system: string; user: string } {
  const formatInstruction = buildFormatInstruction(settings);
  const languageInstruction = buildLanguageInstruction(settings.language);

  return {
    system: [
      'You are an educational content processor for EduTrack AI.',
      'Fix typos, punctuation, and transcription errors in this transcript chunk.',
      formatInstruction,
      languageInstruction,
      'Return only valid JSON with processedText for this chunk.',
    ].join(' '),
    user: [
      `Process transcript chunk ${chunkIndex + 1} of ${totalChunks}:`,
      chunkText,
    ].join('\n\n'),
  };
}

function findChunkEnd(text: string, start: number, maxChars: number): number {
  const hardEnd = Math.min(start + maxChars, text.length);
  if (hardEnd >= text.length) {
    return text.length;
  }

  const slice = text.slice(start, hardEnd);
  const breakAt = Math.max(
    slice.lastIndexOf('\n\n'),
    slice.lastIndexOf('. '),
    slice.lastIndexOf(' '),
  );

  if (breakAt > 0) {
    return start + breakAt + 1;
  }

  return hardEnd;
}

function mapQuizQuestions(questions: AiQuizQuestion[]) {
  return questions.map((question) => ({
    question: question.question,
    options: question.options,
    correctAnswerIndex: question.correctIndex,
  }));
}

function isValidQuizArray(
  value: unknown,
  settings: ProcessSettingsDto,
): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  if (!settings.hasQuiz) {
    return value.length === 0;
  }

  if (value.length !== settings.quizQuestionsCount) {
    return false;
  }

  return value.every((item) => isValidQuizQuestion(item, settings));
}

function isValidQuizQuestion(
  value: unknown,
  settings: ProcessSettingsDto,
): value is AiQuizQuestion {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.question) &&
    Array.isArray(value.options) &&
    value.options.length === settings.quizOptionsCount &&
    value.options.every((option) => typeof option === 'string') &&
    typeof value.correctIndex === 'number' &&
    Number.isInteger(value.correctIndex) &&
    value.correctIndex >= 0 &&
    value.correctIndex < settings.quizOptionsCount
  );
}

function buildFormatInstruction(settings: ProcessSettingsDto): string {
  if (settings.format === MaterialFormat.NARRATIVE) {
    return 'Produce a structured literary retelling in markdown.';
  }

  return `Produce a ${summaryLengthLabel(settings.summaryLength)} summary in markdown.`;
}

function buildLanguageInstruction(language: Language): string {
  if (language === Language.RU) {
    return 'Write the output in Russian.';
  }

  if (language === Language.EN) {
    return 'Write the output in English.';
  }

  return 'Write the output in the same language as the source transcript.';
}

function buildQuizInstruction(settings: ProcessSettingsDto): string {
  if (!settings.hasQuiz) {
    return 'Do not generate quiz questions; return an empty quiz array.';
  }

  return [
    `Generate exactly ${settings.quizQuestionsCount} quiz questions.`,
    `Each question must have exactly ${settings.quizOptionsCount} answer options.`,
    'Base questions on the processed material content.',
  ].join(' ');
}

function summaryLengthLabel(summaryLength: SummaryLength | null): string {
  if (summaryLength === SummaryLength.SHORT) {
    return 'short';
  }

  if (summaryLength === SummaryLength.LONG) {
    return 'long';
  }

  return 'medium';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isMaterialCategory(value: unknown): value is MaterialCategory {
  return typeof value === 'string' && MATERIAL_CATEGORY_VALUES.has(value);
}

/** Default chunk size used by the service when splitting transcripts. */
export const DEFAULT_TRANSCRIPT_CHUNK_SIZE = TRANSCRIPT_CHUNK_MAX_CHARS;
