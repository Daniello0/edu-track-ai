import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import { LoadingIndicator } from '../../common/components/loading-indicator';
import { useAppStore } from '../../common/stores/app.store';
import { isAuthenticated } from '../auth/auth-flow.utils';
import { QUIZ_RESULT_MESSAGES } from './quiz.constants';
import {
  canSubmitQuizToServer,
  submitPersistedQuizAttempt,
} from './quiz-submit.utils';
import type { SubmitQuizAttemptResponse } from './quiz.types';
import './quiz.styles.css';

/**
 * Interactive quiz page with guest local flow and server grading for saved materials.
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
  const canSubmitToServer = canSubmitQuizToServer(
    isLoggedIn,
    reader.isPersisted,
    reader.materialId,
    accessToken,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gradedResult, setGradedResult] =
    useState<SubmitQuizAttemptResponse | null>(null);

  if (!questions.length) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const selectedIndex = selectedAnswers[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const guestScore = Math.round((answeredCount / totalQuestions) * 100);
  const displayScore = gradedResult?.score ?? guestScore;
  const incorrectAnswers =
    gradedResult?.answers.filter((answer) => !answer.isCorrect) ?? [];

  const handleSelect = (optionIndex: number): void => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optionIndex });
  };

  const finishGuestQuiz = (): void => {
    setIsFinished(true);
  };

  const handleNext = (): void => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    if (
      canSubmitToServer &&
      reader.materialId !== null &&
      accessToken !== null
    ) {
      void submitPersistedQuizAttempt(
        reader.materialId,
        selectedAnswers,
        totalQuestions,
        accessToken,
        {
          setIsSubmitting,
          setError: setSubmitError,
          onSuccess: (response) => {
            setGradedResult(response);
            setIsFinished(true);
          },
        },
      );
      return;
    }

    finishGuestQuiz();
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

  if (isFinished) {
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <h1 className="quiz-result-title">Результат</h1>
          <p className="quiz-result-score">{displayScore}%</p>

          {!canSubmitToServer ? (
            <p className="quiz-result-note">
              {QUIZ_RESULT_MESSAGES.GUEST_NOTE}
            </p>
          ) : null}

          {incorrectAnswers.length > 0 ? (
            <section className="quiz-result-review">
              <h2 className="quiz-result-review-title">
                {QUIZ_RESULT_MESSAGES.REVIEW_TITLE}
              </h2>
              <ul className="quiz-result-review-list">
                {incorrectAnswers.map((answer) => {
                  const question = questions[answer.questionIndex];
                  const selectedOption =
                    question?.options[answer.selectedAnswerIndex];

                  return (
                    <li
                      key={answer.questionIndex}
                      className="quiz-result-review-item"
                    >
                      <p className="quiz-result-review-question">
                        {question?.question}
                      </p>
                      {selectedOption ? (
                        <p className="quiz-result-review-answer">
                          {QUIZ_RESULT_MESSAGES.INCORRECT_ANSWER_PREFIX}{' '}
                          {selectedOption}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <div className="quiz-result-actions">
            <button
              type="button"
              className="quiz-btn-primary"
              onClick={() => navigate(APP_ROUTES.READER)}
            >
              Вернуться к материалу
            </button>

            {!canSubmitToServer ? (
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
        {submitError ? <p className="quiz-error">{submitError}</p> : null}

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
            disabled={currentIndex === 0 || isSubmitting}
            onClick={handlePrev}
          >
            Назад
          </button>
          <button
            type="button"
            className="quiz-btn-primary"
            disabled={selectedIndex === undefined || isSubmitting}
            onClick={handleNext}
          >
            {isSubmitting
              ? 'Отправляем…'
              : currentIndex === totalQuestions - 1
                ? 'Завершить'
                : 'Далее'}
          </button>
        </div>

        {isSubmitting ? <LoadingIndicator message="Проверяем ответы…" /> : null}
      </div>
    </div>
  );
}
