import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import {
  CATEGORY_BADGE_BG,
  MATERIAL_CATEGORY_LABELS,
} from '../../common/constants/ui.constants';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import { useAppStore } from '../../common/stores/app.store';
import { formatLongDate } from '../../common/utils/formatters.utils';
import { renderReaderContent } from './reader.utils';
import './reader.styles.css';

/**
 * Reading mode page with material from store.
 */
export function ReaderPage() {
  const navigate = useNavigate();
  const reader = useAppStore((state) => state.reader);
  const resetReader = useAppStore((state) => state.resetReader);
  const openAuthModal = useAppStore((state) => state.openAuthModal);

  if (!reader.title || !reader.content) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const categoryLabel = reader.category
    ? MATERIAL_CATEGORY_LABELS[reader.category]
    : null;
  const hasQuiz = Boolean(reader.quiz?.length);

  const handleDelete = (): void => {
    resetReader();
    navigate(APP_ROUTES.HOME);
  };

  const handleGoToQuiz = (): void => {
    navigate(APP_ROUTES.QUIZ);
  };

  const handleSave = (): void => {
    openAuthModal(AuthModalVariant.GUEST);
  };

  return (
    <div className="reader-page">
      <article className="reader-content">
        <header className="reader-header">
          <h1 className="reader-title">{reader.title}</h1>
          <div className="reader-meta">
            {categoryLabel ? (
              <span
                className="reader-category-badge"
                style={{ background: CATEGORY_BADGE_BG }}
              >
                {categoryLabel}
              </span>
            ) : null}
            <time className="reader-date" dateTime={new Date().toISOString()}>
              {formatLongDate(new Date().toISOString())}
            </time>
          </div>
        </header>

        <div className="reader-body">{renderReaderContent(reader.content)}</div>
      </article>

      <footer className="reader-action-bar">
        {reader.isPersisted ? (
          <span className="reader-library-badge">В библиотеке</span>
        ) : (
          <button
            type="button"
            className="reader-action-primary"
            onClick={handleSave}
          >
            Сохранить в библиотеку
          </button>
        )}

        {hasQuiz ? (
          <button
            type="button"
            className="reader-action-primary"
            onClick={handleGoToQuiz}
          >
            Перейти к тестам
          </button>
        ) : null}

        <button
          type="button"
          className="reader-action-secondary"
          onClick={handleDelete}
        >
          Удалить
        </button>
      </footer>
    </div>
  );
}
