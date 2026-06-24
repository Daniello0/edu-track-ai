import {
  CATEGORY_BADGE_BG,
  MATERIAL_CATEGORY_LABELS,
} from '../../common/constants/ui.constants';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { formatLongDate } from '../../common/utils/formatters.utils';

interface ReaderHeaderProps {
  title: string;
  category: MaterialCategory | null;
  processedAt: string;
}

/**
 * Reader page header with title, category badge, and date.
 */
export function ReaderHeader({
  title,
  category,
  processedAt,
}: ReaderHeaderProps) {
  const categoryLabel = category ? MATERIAL_CATEGORY_LABELS[category] : null;

  return (
    <header className="reader-header">
      <h1 className="reader-title">{title}</h1>
      <div className="reader-meta">
        {categoryLabel ? (
          <span
            className="reader-category-badge"
            style={{ background: CATEGORY_BADGE_BG }}
          >
            {categoryLabel}
          </span>
        ) : null}
        <time className="reader-date" dateTime={processedAt}>
          {formatLongDate(processedAt)}
        </time>
      </div>
    </header>
  );
}
