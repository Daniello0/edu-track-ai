import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import { AuthModalVariant } from '../../common/enums/auth-modal-variant.enum';
import { useAppStore } from '../../common/stores/app.store';
import { isAuthenticated } from '../auth/auth-flow.utils';
import {
  canSubmitQuizToServer,
  submitPersistedQuizAttempt,
} from './quiz-submit.utils';
import { QuizCard } from './quiz-card';
import { QuizResult } from './quiz-result';
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

  if (isFinished) {
    return (
      <div className="quiz-page">
        <QuizResult
          displayScore={displayScore}
          canSubmitToServer={canSubmitToServer}
          incorrectAnswers={incorrectAnswers}
          questions={questions}
          onReturnToReader={() => navigate(APP_ROUTES.READER)}
          onSaveToLibrary={() => openAuthModal(AuthModalVariant.GUEST)}
          onDeleteAndExit={() => {
            resetReader();
            navigate(APP_ROUTES.HOME);
          }}
          onGoToProfile={() => navigate(APP_ROUTES.PROFILE)}
        />
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <QuizCard
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        selectedIndex={selectedIndex}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onSelect={handleSelect}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
