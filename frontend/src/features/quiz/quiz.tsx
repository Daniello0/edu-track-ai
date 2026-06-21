import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import { useAppStore } from '../../common/stores/app.store';
import { isAuthenticated } from '../auth/auth-flow.utils';
import './quiz.styles.css';

/**
 * Interactive quiz page (guest: local only; auth: server verification planned).
 */
export function QuizPage() {
  const navigate = useNavigate();
  const reader = useAppStore((state) => state.reader);
  const user = useAppStore((state) => state.user);
  const accessToken = useAppStore((state) => state.auth.accessToken);
  const resetReader = useAppStore((state) => state.resetReader);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const questions = reader.quiz ?? [];
  const isLoggedIn = isAuthenticated(user.id, accessToken);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isFinished, setIsFinished] = useState(false);

  if (!questions.length) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const selectedIndex = selectedAnswers[currentIndex];

  const handleSelect = (optionIndex: number): void => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optionIndex });
  };

  const handleNext = (): void => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }
    setIsFinished(true);
  };

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSaveToLibrary = (): void => {
    openAuthModal(AuthModalVariant.GUEST);
  };

  const handleDeleteAndExit = (): void => {
    resetReader();
    navigate(APP_ROUTES.HOME);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const mockScore = Math.round((answeredCount / totalQuestions) * 100);

  if (isFinished) {
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <h1 className="quiz-result-title">Результат</h1>
          <p className="quiz-result-score">{mockScore}%</p>
          {!isLoggedIn || !reader.isPersisted ? (
            <p className="quiz-result-note">
              Верифицированная оценка появится после сохранения материала в
              библиотеку.
            </p>
          ) : null}
          <div className="quiz-result-actions">
            <button
              type="button"
              className="quiz-btn-primary"
              onClick={() => navigate(APP_ROUTES.READER)}
            >
              Вернуться к материалу
            </button>

            {!isLoggedIn || !reader.isPersisted ? (
              <>
                <button
                  type="button"
                  className="quiz-btn-primary"
                  onClick={handleSaveToLibrary}
                >
                  Сохранить в библиотеку
                </button>
                <button
                  type="button"
                  className="quiz-btn-secondary"
                  onClick={handleDeleteAndExit}
                >
                  Удалить и выйти
                </button>
              </>
            ) : (
              <button
                type="button"
                className="quiz-btn-secondary"
                onClick={() => navigate(APP_ROUTES.PROFILE)}
              >
                В профиль
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-card">
        <p className="quiz-progress">
          Вопрос {currentIndex + 1} из {totalQuestions}
        </p>

        <div
          className="quiz-progress-bar"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
        >
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <h2 className="quiz-question">{currentQuestion.question}</h2>

        <ul className="quiz-options">
          {currentQuestion.options.map((option, optionIndex) => (
            <li key={optionIndex}>
              <button
                type="button"
                className={`quiz-option${selectedIndex === optionIndex ? ' quiz-option--selected' : ''}`}
                onClick={() => handleSelect(optionIndex)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>

        <div className="quiz-nav">
          <button
            type="button"
            className="quiz-btn-secondary"
            disabled={currentIndex === 0}
            onClick={handlePrev}
          >
            Назад
          </button>
          <button
            type="button"
            className="quiz-btn-primary"
            disabled={selectedIndex === undefined}
            onClick={handleNext}
          >
            {currentIndex === totalQuestions - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
}
