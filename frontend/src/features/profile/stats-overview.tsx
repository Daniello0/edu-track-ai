import { MATERIAL_CATEGORY_LABELS } from '../../common/constants/ui.constants';
import { PROFILE_EMPTY_STATS_PLACEHOLDER } from './profile.constants';
import type { ProfileStats } from './profile.types';

interface StatsOverviewProps {
  stats: ProfileStats | null;
}

/**
 * Profile dashboard stat tiles.
 */
export function StatsOverview({ stats }: StatsOverviewProps) {
  const favoriteCategoryLabel = stats?.favoriteCategory
    ? MATERIAL_CATEGORY_LABELS[stats.favoriteCategory]
    : PROFILE_EMPTY_STATS_PLACEHOLDER;

  return (
    <section className="profile-stats">
      <article className="profile-stat-card">
        <span className="profile-stat-value">
          {stats?.quizzesCompleted ?? 0}
        </span>
        <span className="profile-stat-label">Пройдено тестов</span>
      </article>
      <article className="profile-stat-card">
        <span className="profile-stat-value profile-stat-value--text">
          {favoriteCategoryLabel}
        </span>
        <span className="profile-stat-label">Любимая категория</span>
      </article>
    </section>
  );
}
