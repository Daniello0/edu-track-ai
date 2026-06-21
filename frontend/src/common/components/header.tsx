import { BookOpen, ChevronDown, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  APP_NAME,
  APP_ROUTES,
  ICON_STROKE_WIDTH,
} from '../constants/app.constants';
import { ThemeToggle } from './theme-toggle';
import './header.styles.css';

/** Mock user email for authenticated UI state. */
const MOCK_USER_EMAIL = 'user@example.com';

/**
 * Global header: logo, theme toggle, and auth controls (mock).
 */
export function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = (): void => {
    setIsAuthenticated(true);
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate(APP_ROUTES.HOME);
  };

  return (
    <header className="header">
      <Link to={APP_ROUTES.HOME} className="header-logo">
        <BookOpen size={22} strokeWidth={ICON_STROKE_WIDTH} aria-hidden />
        <span>{APP_NAME}</span>
      </Link>

      <div className="header-actions">
        <ThemeToggle />

        {isAuthenticated ? (
          <div className="header-user-menu">
            <button
              type="button"
              className="header-user-trigger"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <User size={18} strokeWidth={ICON_STROKE_WIDTH} aria-hidden />
              <ChevronDown
                size={16}
                strokeWidth={ICON_STROKE_WIDTH}
                aria-hidden
              />
            </button>

            {isMenuOpen ? (
              <div className="header-dropdown" role="menu">
                <span className="header-dropdown-email">{MOCK_USER_EMAIL}</span>
                <Link
                  to={APP_ROUTES.PROFILE}
                  className="header-dropdown-item"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  type="button"
                  className="header-dropdown-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut
                    size={16}
                    strokeWidth={ICON_STROKE_WIDTH}
                    aria-hidden
                  />
                  Выйти
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="header-login-btn"
            onClick={handleLogin}
          >
            Войти
          </button>
        )}
      </div>
    </header>
  );
}
