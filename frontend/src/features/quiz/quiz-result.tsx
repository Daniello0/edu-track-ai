import type { QuizQuestionPublic } from '../../common/types/app.types';
import { QUIZ_RESULT_MESSAGES } from './quiz.constants';
import type { GradedQuizAnswer } from './quiz.types';

interface QuizResultProps {
  displayScore: number;
  canSubmitToServer: boolean;
  incorrectAnswers: GradedQuizAnswer[];
  questions: QuizQuestionPublic[];
  onReturnToReader: () => void;
  onSaveToLibrary: () => void;
  onDeleteAndExit: () => void;
  onGoToProfile: () => void;
}

/**
 * Quiz completion screen with score, review, and final actions.
 */
export function QuizResult({
  displayScore,
  canSubmitToServer,
  incorrectAnswers,
  questions,
  onReturnToReader,
  onSaveToLibrary,
  onDeleteAndExit,
  onGoToProfile,
}: QuizResultProps) {
  return (
    <div className="quiz-result">
      <h1 className="quiz-result-title">Результат</h1>
      <p className="quiz-result-score">{displayScore}%</p>

      {!canSubmitToServer ? (
        <p className="quiz-result-note">{QUIZ_RESULT_MESSAGES.GUEST_NOTE}</p>
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
          onClick={onReturnToReader}
        >
          Вернуться к материалу
        </button>

        {!canSubmitToServer ? (
          <>
            <button
              type="button"
              className="quiz-btn-primary"
              onClick={onSaveToLibrary}
            >
              Сохранить в библиотеку
            </button>
            <button
              type="button"
              className="quiz-btn-secondary"
              onClick={onDeleteAndExit}
            >
              Удалить и выйти
            </button>
          </>
        ) : (
          <button
            type="button"
            className="quiz-btn-secondary"
            onClick={onGoToProfile}
          >
            В профиль
          </button>
        )}
      </div>
    </div>
  );
}
