import {
  CATEGORY_BADGE_BG,
  MATERIAL_CATEGORY_LABELS,
  MATERIAL_STATUS_CONFIG,
} from '../../common/constants/ui.constants';
import type { LibraryItem } from './profile.types';
import { formatLibraryItemDate } from './profile.utils';

interface MaterialCardProps {
  item: LibraryItem;
  isContinuing: boolean;
  onContinue: (materialId: string) => void;
}

/**
 * Single library material card with preview and continue action.
 */
export function MaterialCard({
  item,
  isContinuing,
  onContinue,
}: MaterialCardProps) {
  const statusConfig = MATERIAL_STATUS_CONFIG[item.status];

  return (
    <li className="profile-material-card">
      <div
        className="profile-material-thumb"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg)`,
        }}
        role="img"
        aria-label={`Превью: ${item.title}`}
      />
      <div className="profile-material-body">
        <h3 className="profile-material-title">{item.title}</h3>
        <div className="profile-material-badges">
          <span
            className="profile-badge profile-badge--category"
            style={{ background: CATEGORY_BADGE_BG }}
          >
            {MATERIAL_CATEGORY_LABELS[item.category]}
          </span>
          <span
            className="profile-badge profile-badge--status"
            style={{ background: statusConfig.color }}
          >
            {statusConfig.label}
          </span>
        </div>
        <time className="profile-material-date">
          {formatLibraryItemDate(item.lastViewedAt)}
        </time>
        <button
          type="button"
          className="profile-continue-btn"
          disabled={isContinuing}
          onClick={() => onContinue(item.id)}
        >
          {isContinuing ? 'Открываем…' : 'Продолжить'}
        </button>
      </div>
    </li>
  );
}
