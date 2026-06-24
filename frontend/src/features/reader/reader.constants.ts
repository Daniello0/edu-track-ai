/** Reader API route paths (relative to /api). */
export const READER_API_ROUTES = {
  DETAIL: (materialId: string) => `/library/${materialId}`,
} as const;

/** Shown when reader state lacks title or content. */
export const READER_MISSING_CONTENT_MESSAGE =
  'Материал недоступен. Вернитесь на главную и обработайте видео заново.';
