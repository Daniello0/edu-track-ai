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
