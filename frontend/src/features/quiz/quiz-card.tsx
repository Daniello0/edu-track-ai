import type { QuizQuestionPublic } from '../../common/types/app.types';
import { LoadingIndicator } from '../../common/components/loading-indicator';
import { QuizProgress } from './quiz-progress';

interface QuizCardProps {
  question: QuizQuestionPublic;
  currentIndex: number;
  totalQuestions: number;
  selectedIndex: number | undefined;
  submitError: string | null;
  isSubmitting: boolean;
  onSelect: (optionIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Single quiz question card with answer options and navigation.
 */
export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  selectedIndex,
  submitError,
  isSubmitting,
  onSelect,
  onPrev,
  onNext,
}: QuizCardProps) {
  return (
    <div className="quiz-card">
      {submitError ? <p className="quiz-error">{submitError}</p> : null}

      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
      />

      <h2 className="quiz-question">{question.question}</h2>

      <ul className="quiz-options">
        {question.options.map((option, optionIndex) => (
          <li key={optionIndex}>
            <button
              type="button"
              className={`quiz-option${selectedIndex === optionIndex ? ' quiz-option--selected' : ''}`}
              onClick={() => onSelect(optionIndex)}
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
          onClick={onPrev}
        >
          Назад
        </button>
        <button
          type="button"
          className="quiz-btn-primary"
          disabled={selectedIndex === undefined || isSubmitting}
          onClick={onNext}
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
  );
}
