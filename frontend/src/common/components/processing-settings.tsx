import { MaterialFormat } from '../enums/material-format.enum';
import type { MainPageFormValues } from '../types/app.types';
import {
  FORMAT_OPTIONS,
  LANGUAGE_OPTIONS,
  QUIZ_OPTIONS_RANGE,
  QUIZ_QUESTIONS_RANGE,
  SUMMARY_LENGTH_OPTIONS,
} from '../constants/process-ui.constants';
import './processing-settings.styles.css';

interface ProcessingSettingsProps {
  values: MainPageFormValues;
  disabled?: boolean;
  onChange: (values: MainPageFormValues) => void;
}

/**
 * Processing options: format, summary length, language, and quiz settings.
 */
export function ProcessingSettings({
  values,
  disabled = false,
  onChange,
}: ProcessingSettingsProps) {
  const showSummaryLength = values.format === MaterialFormat.SUMMARY;

  const updateField = <K extends keyof MainPageFormValues>(
    field: K,
    value: MainPageFormValues[K],
  ): void => {
    onChange({ ...values, [field]: value });
  };

  return (
    <fieldset className="processing-settings-fieldset" disabled={disabled}>
      <legend className="processing-settings-legend">
        Настройки обработки
      </legend>

      <div className="processing-settings-group">
        <span className="processing-settings-group-label">Формат</span>
        <div className="processing-settings-segmented">
          {FORMAT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="processing-settings-segment-option"
            >
              <input
                type="radio"
                name="format"
                value={option.value}
                checked={values.format === option.value}
                onChange={() => updateField('format', option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {showSummaryLength ? (
        <div className="processing-settings-group">
          <span className="processing-settings-group-label">Объём саммари</span>
          <div className="processing-settings-segmented">
            {SUMMARY_LENGTH_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="processing-settings-segment-option"
              >
                <input
                  type="radio"
                  name="summaryLength"
                  value={option.value}
                  checked={values.summaryLength === option.value}
                  onChange={() => updateField('summaryLength', option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="processing-settings-group">
        <label className="processing-settings-group-label" htmlFor="language">
          Язык
        </label>
        <select
          id="language"
          className="processing-settings-select"
          value={values.language}
          onChange={(event) =>
            updateField(
              'language',
              event.target.value as MainPageFormValues['language'],
            )
          }
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="processing-settings-group">
        <label className="processing-settings-toggle">
          <input
            type="checkbox"
            checked={values.hasQuiz}
            onChange={(event) => updateField('hasQuiz', event.target.checked)}
          />
          Тестирование
        </label>
      </div>

      {values.hasQuiz ? (
        <div className="processing-settings-quiz-row">
          <label className="processing-settings-number-field">
            Вопросов
            <input
              type="number"
              min={QUIZ_QUESTIONS_RANGE.min}
              max={QUIZ_QUESTIONS_RANGE.max}
              value={values.quizQuestionsCount}
              onChange={(event) =>
                updateField('quizQuestionsCount', Number(event.target.value))
              }
            />
          </label>
          <label className="processing-settings-number-field">
            Вариантов ответа
            <input
              type="number"
              min={QUIZ_OPTIONS_RANGE.min}
              max={QUIZ_OPTIONS_RANGE.max}
              value={values.quizOptionsCount}
              onChange={(event) =>
                updateField('quizOptionsCount', Number(event.target.value))
              }
            />
          </label>
        </div>
      ) : null}
    </fieldset>
  );
}
