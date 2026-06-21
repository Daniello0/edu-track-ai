import { Moon, Sun } from 'lucide-react';
import { ICON_STROKE_WIDTH } from '../constants/app.constants';
import { Theme } from '../enums/theme.enum';
import { useAppStore } from '../stores/app.store';
import './theme-toggle.styles.css';

/**
 * Light/dark theme switcher.
 */
export function ThemeToggle() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const isDark = theme === Theme.DARK;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      {isDark ? (
        <Sun size={20} strokeWidth={ICON_STROKE_WIDTH} />
      ) : (
        <Moon size={20} strokeWidth={ICON_STROKE_WIDTH} />
      )}
    </button>
  );
}
