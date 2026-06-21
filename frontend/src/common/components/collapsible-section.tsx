import { COLLAPSIBLE_TRANSITION_MS } from '../constants/ui.constants';
import './collapsible-section.styles.css';

interface CollapsibleSectionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Smooth height/opacity expand and collapse for conditional UI blocks.
 */
export function CollapsibleSection({
  isOpen,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const sectionClassName = [
    'collapsible-section',
    isOpen ? 'collapsible-section--open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={sectionClassName}
      aria-hidden={!isOpen}
      style={{ transitionDuration: `${COLLAPSIBLE_TRANSITION_MS}ms` }}
    >
      <div className="collapsible-section-inner">{children}</div>
    </div>
  );
}
