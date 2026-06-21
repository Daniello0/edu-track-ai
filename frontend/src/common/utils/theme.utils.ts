import { Theme } from '../enums/theme.enum';
import { THEME_STORAGE_KEY } from '../constants/ui.constants';

/**
 * Applies dark theme when no user preference is stored and OS prefers dark mode.
 */
export function applySystemThemeIfUnset(
  setTheme: (theme: Theme) => void,
): void {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!stored && prefersDark) {
    setTheme(Theme.DARK);
  }
}
