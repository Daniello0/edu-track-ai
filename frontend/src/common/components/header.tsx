import { BookOpen, ChevronDown, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  APP_NAME,
  APP_ROUTES,
  ICON_STROKE_WIDTH,
} from '../constants/app.constants';
import { AuthModalVariant } from '../enums/auth-modal-variant.enum';
import { useAppStore } from '../stores/app.store';
import {
  isAuthenticated,
  performLogout,
} from '../../features/auth/auth-flow.utils';
import { ThemeToggle } from './theme-toggle';
import './header.styles.css';

/**
 * Global header: logo, theme toggle, and auth controls.
 */
export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useAppStore((state) => state.user);
  const auth = useAppStore((state) => state.auth);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const openAuthModal = useAppStore((state) => state.openAuthModal);

  const isLoggedIn = isAuthenticated(user.id, auth.accessToken);

  const handleLogin = (): void => {
    openAuthModal(AuthModalVariant.LOGIN);
  };

  const handleLogout = (): void => {
    void performLogout(auth.refreshToken, { clearAuth }).finally(() => {
      setIsMenuOpen(false);
      navigate(APP_ROUTES.HOME);
    });
  };

  return (
    <header className="header">
      <Link to={APP_ROUTES.HOME} className="header-logo">
        <BookOpen size={22} strokeWidth={ICON_STROKE_WIDTH} aria-hidden />
        <span>{APP_NAME}</span>
      </Link>

      <div className="header-actions">
        <ThemeToggle />

        {isLoggedIn ? (
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
                <span className="header-dropdown-email">{user.email}</span>
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
