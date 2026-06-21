import { Sparkles } from 'lucide-react';
import { ICON_STROKE_WIDTH } from '../constants/app.constants';
import './loading-indicator.styles.css';

interface LoadingIndicatorProps {
  message: string;
}

/**
 * Pulsing AI icon with status message during processing.
 */
export function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className="loading-indicator" role="status">
      <div className="loading-indicator-icon-wrap">
        <Sparkles
          className="loading-indicator-icon"
          size={28}
          strokeWidth={ICON_STROKE_WIDTH}
          aria-hidden
        />
        <span className="loading-indicator-ai-label">AI</span>
      </div>
      <p className="loading-indicator-message">{message}</p>
    </div>
  );
}
