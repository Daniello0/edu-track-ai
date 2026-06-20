import { MaterialFormat } from '../../common/enums/material-format.enum';
import { Language } from '../../common/enums/language.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import type { MainPageFormValues } from '../../common/types/app.types';

/** Placeholder for the YouTube URL input. */
export const URL_INPUT_PLACEHOLDER = 'Вставьте ссылку на YouTube видео…';

/** Primary action label on the main page. */
export const READ_ACTION_LABEL = 'Читать';

/** Default form values for the main page. */
export const DEFAULT_MAIN_PAGE_VALUES: MainPageFormValues = {
  videoUrl: '',
  format: MaterialFormat.NARRATIVE,
  summaryLength: SummaryLength.MEDIUM,
  language: Language.RU,
  hasQuiz: true,
  quizQuestionsCount: 5,
  quizOptionsCount: 4,
};

/** Loading step messages shown during processing. */
export const PROCESS_STEP_MESSAGES = {
  transcribing: 'Получаем транскрипт…',
  ai_processing: 'Обрабатываем материал…',
} as const;

/** Validation error when YouTube URL is invalid. */
export const INVALID_YOUTUBE_URL_MESSAGE =
  'Введите корректную ссылку на YouTube видео';
