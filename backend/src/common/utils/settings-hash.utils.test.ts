import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Language } from '../enums/language.enum';
import { MaterialFormat } from '../enums/material-format.enum';
import { computeSettingsHash } from './settings-hash.utils';

const baseInput = {
  videoId: 'VIDEO_ID',
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  hasQuiz: true,
  quizQuestionsCount: 5,
  quizOptionsCount: 5,
} as const;

describe('computeSettingsHash', () => {
  it('returns deterministic SHA-256 hex for canonical JSON', () => {
    const canonicalJson = JSON.stringify({
      format: 'narrative',
      hasQuiz: true,
      language: 'ru',
      quizOptionsCount: 5,
      quizQuestionsCount: 5,
      summaryLength: null,
      videoId: 'VIDEO_ID',
    });
    const expected = createHash('sha256').update(canonicalJson).digest('hex');

    expect(computeSettingsHash(baseInput)).toBe(expected);
  });

  it('includes null summaryLength explicitly', () => {
    const withNull = computeSettingsHash(baseInput);
    const withUndefined = computeSettingsHash({
      ...baseInput,
      summaryLength: undefined as unknown as null,
    });

    expect(withNull).not.toBe(withUndefined);
  });

  it('changes hash when settings differ', () => {
    const first = computeSettingsHash(baseInput);
    const second = computeSettingsHash({
      ...baseInput,
      quizOptionsCount: 4,
    });

    expect(first).not.toBe(second);
  });
});
