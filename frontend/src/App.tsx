import { useEffect } from 'react';
import { AppRoutes } from './app.routes';
import { useAppStore } from './common/stores/app.store';
import { applySystemThemeIfUnset } from './common/utils/theme.utils';

/**
 * Root application shell with theme initialization.
 */
export function App() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    applySystemThemeIfUnset(setTheme);
  }, [setTheme]);

  return <AppRoutes />;
}
