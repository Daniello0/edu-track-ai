import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import {
  CATEGORY_BADGE_BG,
  MATERIAL_CATEGORY_LABELS,
  MATERIAL_STATUS_CONFIG,
} from '../../common/constants/ui.constants';
import {
  MOCK_LIBRARY_ITEMS,
  MOCK_PROFILE_STATS,
  MOCK_READER_STATE,
} from '../../common/mocks/material.mock';
import { useAppStore } from '../../common/stores/app.store';
import './profile.styles.css';

/**
 * Formats ISO date for library cards.
 */
function formatLastViewed(isoDate: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));
}

/**
 * Profile dashboard with mock stats and material library.
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const setReaderMaterial = useAppStore((state) => state.setReaderMaterial);

  const handleContinue = (materialId: string): void => {
    const item = MOCK_LIBRARY_ITEMS.find((entry) => entry.id === materialId);
    if (!item) {
      return;
    }

    setReaderMaterial({
      ...MOCK_READER_STATE,
      materialId: item.id,
      title: item.title,
      videoId: item.videoId,
      category: item.category,
    });
    navigate(APP_ROUTES.READER);
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Профиль</h1>

      <section className="profile-stats">
        <article className="profile-stat-card">
          <span className="profile-stat-value">
            {MOCK_PROFILE_STATS.minutesStudied}
          </span>
          <span className="profile-stat-label">Изучено минут</span>
        </article>
        <article className="profile-stat-card">
          <span className="profile-stat-value">
            {MOCK_PROFILE_STATS.quizzesCompleted}
          </span>
          <span className="profile-stat-label">Пройдено тестов</span>
        </article>
        <article className="profile-stat-card">
          <span className="profile-stat-value profile-stat-value--text">
            {MATERIAL_CATEGORY_LABELS[MOCK_PROFILE_STATS.favoriteCategory]}
          </span>
          <span className="profile-stat-label">Любимая категория</span>
        </article>
      </section>

      <section className="profile-library">
        <h2 className="profile-section-title">Мои материалы</h2>
        <ul className="profile-material-grid">
          {MOCK_LIBRARY_ITEMS.map((item) => {
            const statusConfig = MATERIAL_STATUS_CONFIG[item.status];

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
                    {formatLastViewed(item.lastViewedAt)}
                  </time>
                  <button
                    type="button"
                    className="profile-continue-btn"
                    onClick={() => handleContinue(item.id)}
                  >
                    Продолжить
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
