import { LoaderCircle } from 'lucide-react';
import { ICON_STROKE_WIDTH } from '../constants/app.constants';
import './main-action-button.styles.css';

interface MainActionButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * Primary action button with optional loading indicator.
 */
export function MainActionButton({
  label,
  isLoading = false,
  disabled = false,
  onClick,
}: MainActionButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      className="main-action-button"
      disabled={isDisabled}
      onClick={onClick}
    >
      {isLoading ? (
        <LoaderCircle
          className="main-action-button-spinner"
          size={18}
          strokeWidth={ICON_STROKE_WIDTH}
          aria-hidden
        />
      ) : null}
      {label}
    </button>
  );
}
