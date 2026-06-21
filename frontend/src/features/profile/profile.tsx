import {
  PROFILE_EMPTY_LIBRARY_MESSAGE,
  PROFILE_EMPTY_STATS_PLACEHOLDER,
  PROFILE_LIBRARY_PENDING_MESSAGE,
} from './profile.constants';
import './profile.styles.css';

/**
 * Profile dashboard placeholder until library data loading is wired to the UI.
 */
export function ProfilePage() {
  return (
    <div className="profile-page">
      <h1 className="profile-title">Профиль</h1>

      <section className="profile-stats">
        <article className="profile-stat-card">
          <span className="profile-stat-value">0</span>
          <span className="profile-stat-label">Материалов</span>
        </article>
        <article className="profile-stat-card">
          <span className="profile-stat-value">0</span>
          <span className="profile-stat-label">Пройдено тестов</span>
        </article>
        <article className="profile-stat-card">
          <span className="profile-stat-value profile-stat-value--text">
            {PROFILE_EMPTY_STATS_PLACEHOLDER}
          </span>
          <span className="profile-stat-label">Любимая категория</span>
        </article>
      </section>

      <section className="profile-library">
        <h2 className="profile-section-title">Мои материалы</h2>
        <p className="profile-empty-message">{PROFILE_EMPTY_LIBRARY_MESSAGE}</p>
        <p className="profile-empty-message profile-empty-message--muted">
          {PROFILE_LIBRARY_PENDING_MESSAGE}
        </p>
      </section>
    </div>
  );
}
