import { X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { ICON_STROKE_WIDTH } from '../../common/constants/app.constants';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import { AuthMode } from '../../common/enums/auth-mode.enum';
import { GUEST_CALLOUT_MESSAGE } from './auth.constants';
import { AuthForm } from './auth-form';
import { getAuthModalTitle } from './auth.utils';
import './auth-modal.styles.css';

interface AuthModalProps {
  isOpen: boolean;
  variant: AuthModalVariant;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal shell for login and guest save flows.
 */
export function AuthModal({
  isOpen,
  variant,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState(AuthMode.SIGN_IN);

  const handleClose = useCallback((): void => {
    setMode(AuthMode.SIGN_IN);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  const title = getAuthModalTitle(variant, mode);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleSuccess = (): void => {
    setMode(AuthMode.SIGN_IN);
    onSuccess();
  };

  return (
    <div
      className="auth-modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="auth-modal-header">
          <h2 id="auth-modal-title" className="auth-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="auth-modal-close"
            aria-label="Закрыть"
            onClick={handleClose}
          >
            <X size={20} strokeWidth={ICON_STROKE_WIDTH} aria-hidden />
          </button>
        </div>

        {variant === AuthModalVariant.GUEST && mode === AuthMode.SIGN_IN ? (
          <p className="auth-modal-guest-callout">{GUEST_CALLOUT_MESSAGE}</p>
        ) : null}

        <AuthForm
          mode={mode}
          onModeChange={setMode}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
