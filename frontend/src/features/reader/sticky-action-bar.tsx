interface StickyActionBarProps {
  isPersisted: boolean;
  hasQuiz: boolean;
  isDeleting: boolean;
  onSave: () => void;
  onGoToQuiz: () => void;
  onDelete: () => void;
}

/**
 * Sticky reader footer with save, quiz, and delete actions.
 */
export function StickyActionBar({
  isPersisted,
  hasQuiz,
  isDeleting,
  onSave,
  onGoToQuiz,
  onDelete,
}: StickyActionBarProps) {
  return (
    <footer className="reader-action-bar">
      {isPersisted ? (
        <span className="reader-library-badge">В библиотеке</span>
      ) : (
        <button
          type="button"
          className="reader-action-primary"
          onClick={onSave}
        >
          Сохранить в библиотеку
        </button>
      )}

      {hasQuiz ? (
        <button
          type="button"
          className="reader-action-primary"
          onClick={onGoToQuiz}
        >
          Перейти к тестам
        </button>
      ) : null}

      <button
        type="button"
        className="reader-action-secondary"
        disabled={isDeleting}
        onClick={onDelete}
      >
        {isDeleting ? 'Удаляем…' : 'Удалить'}
      </button>
    </footer>
  );
}
