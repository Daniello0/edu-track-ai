import { MaterialFormat } from '../enums/material-format.enum';
import { Language } from '../enums/language.enum';
import { SummaryLength } from '../enums/summary-length.enum';
import {
  QUIZ_OPTIONS_MAX,
  QUIZ_OPTIONS_MIN,
  QUIZ_QUESTIONS_MAX,
  QUIZ_QUESTIONS_MIN,
} from './process.constants';

/** Format options for segmented control. */
export const FORMAT_OPTIONS = [
  { value: MaterialFormat.NARRATIVE, label: 'Рассказ' },
  { value: MaterialFormat.SUMMARY, label: 'Саммари' },
] as const;

/** Summary length options (visible when format is summary). */
export const SUMMARY_LENGTH_OPTIONS = [
  { value: SummaryLength.SHORT, label: 'Краткий' },
  { value: SummaryLength.MEDIUM, label: 'Средний' },
  { value: SummaryLength.LONG, label: 'Полный' },
] as const;

/** Language options for content output. */
export const LANGUAGE_OPTIONS = [
  { value: Language.RU, label: 'RU' },
  { value: Language.EN, label: 'EN' },
  { value: Language.ORIGINAL, label: 'Оригинал' },
] as const;

/** Quiz question count bounds exposed to the UI. */
export const QUIZ_QUESTIONS_RANGE = {
  min: QUIZ_QUESTIONS_MIN,
  max: QUIZ_QUESTIONS_MAX,
} as const;

/** Quiz options count bounds exposed to the UI. */
export const QUIZ_OPTIONS_RANGE = {
  min: QUIZ_OPTIONS_MIN,
  max: QUIZ_OPTIONS_MAX,
} as const;
