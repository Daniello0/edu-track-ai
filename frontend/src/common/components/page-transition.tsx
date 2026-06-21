import { useLocation } from 'react-router-dom';
import { PAGE_TRANSITION_MS } from '../constants/ui.constants';
import './page-transition.styles.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps route content with fade-in transition on navigation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="page-transition"
      style={{ animationDuration: `${PAGE_TRANSITION_MS}ms` }}
    >
      {children}
    </div>
  );
}
