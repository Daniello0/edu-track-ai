import { useState } from 'react';
import { BackgroundShape } from '../../common/components/background-shape';
import { MainActionButton } from '../../common/components/main-action-button';
import { ProcessingSettings } from '../../common/components/processing-settings';
import { UrlInput } from '../../common/components/url-input';
import { APP_NAME } from '../../common/constants/app.constants';
import { ProcessStep } from '../../common/enums/process-step.enum';
import { useAppStore } from '../../common/stores/app.store';
import type { MainPageFormValues } from '../../common/types/app.types';
import {
  DEFAULT_MAIN_PAGE_VALUES,
  PROCESS_STEP_MESSAGES,
  READ_ACTION_LABEL,
  URL_INPUT_PLACEHOLDER,
} from './main.constants';
import './main.styles.css';
import { submitMainPageProcess } from './submit-process.utils';

/**
 * Main page: URL input, processing settings, and pipeline trigger.
 */
export function MainPage() {
  const [formValues, setFormValues] = useState<MainPageFormValues>(
    DEFAULT_MAIN_PAGE_VALUES,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const isLoading = useAppStore((state) => state.currentProcess.isLoading);
  const processStep = useAppStore((state) => state.currentProcess.step);
  const processError = useAppStore((state) => state.currentProcess.error);
  const accessToken = useAppStore((state) => state.auth.accessToken);
  const setProcessLoading = useAppStore((state) => state.setProcessLoading);
  const setProcessError = useAppStore((state) => state.setProcessError);
  const setReaderMaterial = useAppStore((state) => state.setReaderMaterial);

  const loadingMessage =
    processStep === ProcessStep.TRANSCRIBING
      ? PROCESS_STEP_MESSAGES.transcribing
      : PROCESS_STEP_MESSAGES.ai_processing;

  const handleSubmit = (): void => {
    void submitMainPageProcess(formValues, accessToken, {
      setFieldError,
      setProcessLoading,
      setProcessError,
      setReaderMaterial,
    });
  };

  return (
    <main className="main-page">
      <BackgroundShape />
      <div className="main-page-content">
        <h1 className="main-page-title">{APP_NAME}</h1>

        <UrlInput
          value={formValues.videoUrl}
          placeholder={URL_INPUT_PLACEHOLDER}
          error={fieldError}
          disabled={isLoading}
          onChange={(videoUrl) => setFormValues({ ...formValues, videoUrl })}
        />

        <ProcessingSettings
          values={formValues}
          disabled={isLoading}
          onChange={setFormValues}
        />

        <MainActionButton
          label={READ_ACTION_LABEL}
          isLoading={isLoading}
          onClick={handleSubmit}
        />

        {isLoading ? (
          <p className="main-page-status" role="status">
            {loadingMessage}
          </p>
        ) : null}

        {processError ? (
          <p className="main-page-error" role="alert">
            {processError}
          </p>
        ) : null}
      </div>
    </main>
  );
}
