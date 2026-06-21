import { useState } from 'react';
import { AuthMode } from '../../common/enums/auth-mode.enum';
import { useAppStore } from '../../common/stores/app.store';
import {
  authenticateWithEmail,
  authenticateWithGoogle,
} from './auth-flow.utils';
import { resolveAuthError } from './auth-error.utils';
import {
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_PASSWORD_PLACEHOLDER,
  DEFAULT_AUTH_FORM_VALUES,
  SIGN_IN_SUBMIT_LABEL,
  SIGN_UP_SUBMIT_LABEL,
  SWITCH_TO_SIGN_IN_LABEL,
  SWITCH_TO_SIGN_UP_LABEL,
} from './auth.constants';
import type { AuthFormValues } from './auth.types';
import { getGoogleAuthLabel, validateAuthForm } from './auth.utils';
import './auth-form.styles.css';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: () => void;
}

/**
 * Email/password and Google authentication form (Firebase + API session).
 */
export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const setAuthSession = useAppStore((state) => state.setAuthSession);
  const markReaderPersisted = useAppStore((state) => state.markReaderPersisted);

  const [values, setValues] = useState<AuthFormValues>(
    DEFAULT_AUTH_FORM_VALUES,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getHandlers = () => ({
    setAuthSession,
    clearAuth: useAppStore.getState().clearAuth,
    markReaderPersisted,
  });

  const runAuthAction = async (action: () => Promise<void>): Promise<void> => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await action();
      onSuccess();
    } catch (error) {
      setSubmitError(resolveAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (): void => {
    void (async () => {
      const validationError = await validateAuthForm(values, mode);
      if (validationError) {
        setFieldError(validationError);
        return;
      }

      setFieldError(null);
      await runAuthAction(() =>
        authenticateWithEmail(values, mode, getHandlers()),
      );
    })();
  };

  const handleGoogleSignIn = (): void => {
    void runAuthAction(() => authenticateWithGoogle(getHandlers()));
  };

  const toggleMode = (): void => {
    onModeChange(
      mode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN,
    );
    setFieldError(null);
    setSubmitError(null);
  };

  const submitLabel =
    mode === AuthMode.SIGN_IN ? SIGN_IN_SUBMIT_LABEL : SIGN_UP_SUBMIT_LABEL;
  const googleLabel = getGoogleAuthLabel(mode);

  return (
    <div className="auth-form">
      <button
        type="button"
        className="auth-form-google"
        disabled={isSubmitting}
        onClick={handleGoogleSignIn}
      >
        {googleLabel}
      </button>

      <div className="auth-form-divider">
        <span>или</span>
      </div>

      <label className="auth-form-field">
        <span className="auth-form-label">Email</span>
        <input
          type="email"
          className="auth-form-input"
          placeholder={AUTH_EMAIL_PLACEHOLDER}
          value={values.email}
          disabled={isSubmitting}
          autoComplete="email"
          onChange={(event) =>
            setValues({ ...values, email: event.target.value })
          }
        />
      </label>

      <label className="auth-form-field">
        <span className="auth-form-label">Пароль</span>
        <input
          type="password"
          className="auth-form-input"
          placeholder={AUTH_PASSWORD_PLACEHOLDER}
          value={values.password}
          disabled={isSubmitting}
          autoComplete={
            mode === AuthMode.SIGN_UP ? 'new-password' : 'current-password'
          }
          onChange={(event) =>
            setValues({ ...values, password: event.target.value })
          }
        />
      </label>

      {fieldError ? <p className="auth-form-error">{fieldError}</p> : null}
      {submitError ? <p className="auth-form-error">{submitError}</p> : null}

      <button
        type="button"
        className="auth-form-submit"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Загрузка…' : submitLabel}
      </button>

      <button
        type="button"
        className="auth-form-toggle"
        disabled={isSubmitting}
        onClick={toggleMode}
      >
        {mode === AuthMode.SIGN_IN
          ? SWITCH_TO_SIGN_UP_LABEL
          : SWITCH_TO_SIGN_IN_LABEL}
      </button>
    </div>
  );
}
