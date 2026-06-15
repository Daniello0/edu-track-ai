import { createHash } from 'node:crypto';
import { Language } from '../enums/language.enum';
import { MaterialFormat } from '../enums/material-format.enum';
import { SummaryLength } from '../enums/summary-length.enum';

/** Input fields used to build the canonical settings hash payload. */
export interface SettingsHashInput {
  videoId: string;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: Language;
  hasQuiz: boolean;
  quizQuestionsCount: number;
  quizOptionsCount: number;
}

/**
 * Builds a SHA-256 hash from canonical processing settings JSON.
 */
export function computeSettingsHash(input: SettingsHashInput): string {
  const canonicalPayload = buildCanonicalPayload(input);
  const canonicalJson = JSON.stringify(canonicalPayload);

  return createHash('sha256').update(canonicalJson).digest('hex');
}

function buildCanonicalPayload(
  input: SettingsHashInput,
): Record<string, string | boolean | number | null> {
  return {
    format: input.format,
    hasQuiz: input.hasQuiz,
    language: input.language,
    quizOptionsCount: input.quizOptionsCount,
    quizQuestionsCount: input.quizQuestionsCount,
    summaryLength: input.summaryLength,
    videoId: input.videoId,
  };
}
