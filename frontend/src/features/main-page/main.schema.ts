import * as yup from 'yup';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { Language } from '../../common/enums/language.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import {
  QUIZ_OPTIONS_MAX,
  QUIZ_OPTIONS_MIN,
  QUIZ_QUESTIONS_MAX,
  QUIZ_QUESTIONS_MIN,
} from '../../common/constants/process.constants';
import { isValidYouTubeUrl } from '../../common/utils/youtube.utils';
import {
  INVALID_YOUTUBE_URL_MESSAGE,
  DEFAULT_MAIN_PAGE_VALUES,
} from './main.constants';

/**
 * Yup schema for main page form validation.
 */
export const mainPageFormSchema = yup
  .object({
    videoUrl: yup
      .string()
      .trim()
      .required(INVALID_YOUTUBE_URL_MESSAGE)
      .test('youtube-url', INVALID_YOUTUBE_URL_MESSAGE, (value) =>
        isValidYouTubeUrl(value ?? ''),
      ),
    format: yup
      .mixed<MaterialFormat>()
      .oneOf([MaterialFormat.NARRATIVE, MaterialFormat.SUMMARY])
      .required(),
    summaryLength: yup
      .mixed<SummaryLength>()
      .oneOf([SummaryLength.SHORT, SummaryLength.MEDIUM, SummaryLength.LONG])
      .required(),
    language: yup
      .mixed<Language>()
      .oneOf([Language.RU, Language.EN, Language.ORIGINAL])
      .required(),
    hasQuiz: yup.boolean().required(),
    quizQuestionsCount: yup.number().when('hasQuiz', {
      is: true,
      then: (schema) =>
        schema
          .integer()
          .min(QUIZ_QUESTIONS_MIN)
          .max(QUIZ_QUESTIONS_MAX)
          .required(),
      otherwise: (schema) =>
        schema.default(DEFAULT_MAIN_PAGE_VALUES.quizQuestionsCount),
    }),
    quizOptionsCount: yup.number().when('hasQuiz', {
      is: true,
      then: (schema) =>
        schema.integer().min(QUIZ_OPTIONS_MIN).max(QUIZ_OPTIONS_MAX).required(),
      otherwise: (schema) =>
        schema.default(DEFAULT_MAIN_PAGE_VALUES.quizOptionsCount),
    }),
  })
  .required();
