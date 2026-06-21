import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import {
  CATEGORY_BADGE_BG,
  MATERIAL_CATEGORY_LABELS,
  MATERIAL_STATUS_CONFIG,
} from '../../common/constants/ui.constants';
import { LoadingIndicator } from '../../common/components/loading-indicator';
import { useAppStore } from '../../common/stores/app.store';
import { isAuthenticated } from '../auth/auth-flow.utils';
import { loadProfileLibraryData } from './profile-library.utils';
import { openReaderMaterialFromLibrary } from './profile-reader.utils';
import {
  PROFILE_EMPTY_LIBRARY_MESSAGE,
  PROFILE_EMPTY_STATS_PLACEHOLDER,
  PROFILE_LOADING_MESSAGE,
} from './profile.constants';
import type { LibraryItem, ProfileStats } from './profile.types';
import { formatLibraryItemDate } from './profile.utils';
import './profile.styles.css';

/**
 * Profile dashboard with library list loaded from the API.
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const accessToken = useAppStore((state) => state.auth.accessToken);
  const userId = useAppStore((state) => state.user.id);
  const setReaderMaterial = useAppStore((state) => state.setReaderMaterial);

  const [items, setItems] = useState<LibraryItem[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [continuingMaterialId, setContinuingMaterialId] = useState<
    string | null
  >(null);

  const isLoggedIn = isAuthenticated(userId, accessToken);

  useEffect(() => {
    if (!isLoggedIn || accessToken === null) {
      return;
    }

    void loadProfileLibraryData(accessToken, {
      setItems,
      setStats,
      setIsLoading,
      setError,
    });
  }, [accessToken, isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const favoriteCategoryLabel = stats?.favoriteCategory
    ? MATERIAL_CATEGORY_LABELS[stats.favoriteCategory]
    : PROFILE_EMPTY_STATS_PLACEHOLDER;

  const handleContinue = (materialId: string): void => {
    if (accessToken === null) {
      return;
    }

    setContinuingMaterialId(materialId);
    void openReaderMaterialFromLibrary(materialId, accessToken, {
      setReaderMaterial,
      navigateToReader: () => navigate(APP_ROUTES.READER),
      setError,
      setIsLoading: (loading) => {
        setContinuingMaterialId(loading ? materialId : null);
      },
    });
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Профиль</h1>

      {error ? <p className="profile-error">{error}</p> : null}

      <section className="profile-stats">
        <article className="profile-stat-card">
          <span className="profile-stat-value profile-stat-value--text">
            {PROFILE_EMPTY_STATS_PLACEHOLDER}
          </span>
          <span className="profile-stat-label">Изучено минут</span>
        </article>
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

      <section className="profile-library">
        <h2 className="profile-section-title">Мои материалы</h2>

        {isLoading ? (
          <LoadingIndicator message={PROFILE_LOADING_MESSAGE} />
        ) : null}

        {!isLoading && items.length === 0 ? (
          <p className="profile-empty-message">
            {PROFILE_EMPTY_LIBRARY_MESSAGE}
          </p>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <ul className="profile-material-grid">
            {items.map((item) => {
              const statusConfig = MATERIAL_STATUS_CONFIG[item.status];
              const isContinuing = continuingMaterialId === item.id;

              return (
                <li key={item.id} className="profile-material-card">
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
                      onClick={() => handleContinue(item.id)}
                    >
                      {isContinuing ? 'Открываем…' : 'Продолжить'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
