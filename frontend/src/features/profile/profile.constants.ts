/** Profile/library API route paths (relative to /api). */
export const PROFILE_API_ROUTES = {
  LIST: '/library',
  DETAIL: (materialId: string) => `/library/${materialId}`,
  UPDATE_STATUS: (materialId: string) => `/library/${materialId}/status`,
  DELETE: (materialId: string) => `/library/${materialId}`,
} as const;

/** Validation messages for profile/library forms. */
export const PROFILE_VALIDATION_MESSAGES = {
  INVALID_STATUS: 'Выберите корректный статус материала.',
} as const;

/** Locale used for profile date formatting. */
export const PROFILE_DATE_LOCALE = 'ru-RU';

/** Placeholder when profile stats are not loaded yet. */
export const PROFILE_EMPTY_STATS_PLACEHOLDER = '—';

/** Message shown when the library list is empty. */
export const PROFILE_EMPTY_LIBRARY_MESSAGE =
  'Здесь появятся сохранённые материалы после обработки видео.';

/** Loading message for profile library fetch. */
export const PROFILE_LOADING_MESSAGE = 'Загружаем библиотеку…';
