/** Default locale for date formatting across the UI. */
const DATE_LOCALE = 'ru-RU';

/**
 * Formats an ISO date string with a long month name (e.g. «20 июня 2026 г.»).
 */
export function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate));
}
