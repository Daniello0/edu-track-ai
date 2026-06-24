import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import { useAppStore } from '../../common/stores/app.store';
import { deleteReaderMaterial } from './reader-actions.utils';
import { ContentArea } from './content-area';
import { hasQuizInReader, hasReadableContent } from './reader.utils';
import { ReaderHeader } from './reader-header';
import { StickyActionBar } from './sticky-action-bar';
import './reader.styles.css';

/**
 * Reading mode page with material from store.
 */
export function ReaderPage() {
  const navigate = useNavigate();
  const reader = useAppStore((state) => state.reader);
  const accessToken = useAppStore((state) => state.auth.accessToken);
  const resetReader = useAppStore((state) => state.resetReader);
  const openAuthModal = useAppStore((state) => state.openAuthModal);

  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!hasReadableContent(reader)) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const hasQuiz = hasQuizInReader(reader);
  const processedAt = new Date().toISOString();

  const handleDelete = (): void => {
    void deleteReaderMaterial(reader, accessToken, {
      resetReader,
      navigateHome: () => navigate(APP_ROUTES.HOME),
      setError: setActionError,
      setIsDeleting,
    });
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
        <ReaderHeader
          title={reader.title!}
          category={reader.category}
          processedAt={processedAt}
        />

        {actionError ? (
          <p className="reader-action-error">{actionError}</p>
        ) : null}

        <ContentArea content={reader.content!} />
      </article>

      <StickyActionBar
        isPersisted={reader.isPersisted}
        hasQuiz={hasQuiz}
        isDeleting={isDeleting}
        onSave={handleSave}
        onGoToQuiz={handleGoToQuiz}
        onDelete={handleDelete}
      />
    </div>
  );
}
