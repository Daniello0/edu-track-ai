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
 * Maps LLM structured output to the internal material processing result.
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
  return [
    buildCoreSystemPrompt(),
    buildTranscriptCleanupInstruction(settings),
    buildFormatInstruction(settings),
    buildLanguageInstruction(settings.language),
    buildCategoryInstruction(),
    'Create a concise, descriptive title that reflects the lecture subject.',
    buildQuizInstruction(settings),
    'Return only valid JSON matching the provided schema.',
    'The processedText field must be valid markdown.',
  ].join('\n');
}

/**
 * Builds the user prompt for full material processing.
 */
export function buildMaterialUserPrompt(
  transcriptText: string,
  isReduceStep: boolean,
  settings?: ProcessSettingsDto,
): string {
  if (isReduceStep) {
    return buildReduceUserPrompt(transcriptText, settings);
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
  return {
    system: [
      buildCoreSystemPrompt(),
      buildTranscriptCleanupInstruction(settings, 'chunk'),
      buildFormatInstruction(settings),
      buildLanguageInstruction(settings.language),
      'Return only valid JSON with processedText for this chunk.',
      'The processedText field must be valid markdown.',
    ].join('\n'),
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

function buildCoreSystemPrompt(): string {
  return [
    'You are an educational content processor for EduTrack AI.',
    'Transform raw YouTube lecture transcripts into high-quality study material.',
  ].join(' ');
}

function buildTranscriptCleanupInstruction(
  settings: ProcessSettingsDto,
  scope: 'full' | 'chunk' = 'full',
): string {
  const scopeLabel =
    scope === 'chunk' ? 'this transcript chunk' : 'the transcript';

  if (settings.format === MaterialFormat.NARRATIVE) {
    return [
      `Fix typos, punctuation, and transcription errors in ${scopeLabel}.`,
      'Remove filler words and verbal tics, but keep the original wording and meaning.',
      'Do not invent, omit, or paraphrase substantive content.',
    ].join(' ');
  }

  return [
    `Fix typos, punctuation, and transcription errors in ${scopeLabel}.`,
    'Remove filler words, repetitions, and off-topic digressions.',
    'Do not invent facts, examples, or details not present in the transcript.',
  ].join(' ');
}

function buildReduceUserPrompt(
  transcriptText: string,
  settings?: ProcessSettingsDto,
): string {
  if (settings?.format === MaterialFormat.NARRATIVE) {
    return [
      'Combine the following partial transcript segments into one continuous narrative.',
      'Keep almost identical wording and roughly the same total length as the subtitles.',
      'Remove only overlap between segments, ads, sponsorship segments, and paid integrations.',
      'Partial segments:',
      transcriptText,
    ].join('\n\n');
  }

  return [
    'Combine the following partial lecture segments into one coherent material.',
    'Preserve factual accuracy and remove duplicate content between segments.',
    'Partial segments:',
    transcriptText,
  ].join('\n\n');
}

function buildCategoryInstruction(): string {
  return [
    'Choose exactly one MaterialCategory that best matches the lecture topic:',
    '- programming: software development, coding, frameworks',
    '- mathematics: math theory, proofs, calculations',
    '- science: physics, chemistry, biology, natural sciences',
    '- humanities: history, philosophy, sociology, cultural studies',
    '- languages: language learning, linguistics, grammar',
    '- business: management, marketing, finance, economics',
    '- arts: film, music, visual arts, creative works analysis',
    '- health: medicine, wellness, nutrition',
    '- technology: gadgets, IT infrastructure, tech industry',
    '- other: topics that do not fit the categories above',
  ].join('\n');
}

function buildFormatInstruction(settings: ProcessSettingsDto): string {
  if (settings.format === MaterialFormat.NARRATIVE) {
    return [
      'Format: narrative — keep text almost identical to the video transcript.',
      'Polish it into literary prose: fix errors and remove filler words, but preserve the original meaning, structure, facts, and wording as closely as possible.',
      'Keep roughly the same length as the subtitles; do not shorten, condense, or summarize.',
      'Remove ads, sponsorship segments, and paid integrations entirely.',
      'Use markdown paragraph breaks between logical speech segments; do not add section headings.',
    ].join(' ');
  }

  return [
    `Produce a ${summaryLengthLabel(settings.summaryLength)} summary in markdown.`,
    'Include a brief introduction and bullet-point key takeaways.',
  ].join(' ');
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
    'Base every question only on facts explicitly stated in the transcript.',
    'Include one clearly correct answer and plausible distractors.',
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
