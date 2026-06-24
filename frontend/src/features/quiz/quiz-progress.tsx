interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

/**
 * Quiz navigation progress indicator.
 */
export function QuizProgress({
  currentIndex,
  totalQuestions,
}: QuizProgressProps) {
  return (
    <>
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
          style={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
          }}
        />
      </div>
    </>
  );
}
