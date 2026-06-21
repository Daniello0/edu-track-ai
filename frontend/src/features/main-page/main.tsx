import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundShape } from '../../common/components/background-shape';
import { LoadingIndicator } from '../../common/components/loading-indicator';
import { MainActionButton } from '../../common/components/main-action-button';
import { ProcessingSettings } from '../../common/components/processing-settings';
import { UrlInput } from '../../common/components/url-input';
import { useAppStore } from '../../common/stores/app.store';
import type { MainPageFormValues } from '../../common/types/app.types';
import {
  DEFAULT_MAIN_PAGE_VALUES,
  READ_ACTION_LABEL,
  URL_INPUT_PLACEHOLDER,
} from './main.constants';
import {
  getMockLoadingMessage,
  mockNavigateToReader,
} from './main.mock-navigation.utils';
import './main.styles.css';

/**
 * Main page: URL input, processing settings, and mock navigation to reader.
 */
export function MainPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<MainPageFormValues>(
    DEFAULT_MAIN_PAGE_VALUES,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const isLoading = useAppStore((state) => state.currentProcess.isLoading);
  const processStep = useAppStore((state) => state.currentProcess.step);
  const setProcessLoading = useAppStore((state) => state.setProcessLoading);
  const setReaderMaterial = useAppStore((state) => state.setReaderMaterial);

  const loadingMessage = getMockLoadingMessage(processStep);

  const handleSubmit = (): void => {
    void mockNavigateToReader(formValues, {
      setFieldError,
      setProcessLoading,
      setReaderMaterial,
      navigate,
    });
  };

  return (
    <main className="main-page">
      <BackgroundShape />
      <div className="main-page-content">
        <header className="main-page-hero">
          <h1 className="main-page-heading">
            Превратите видео в учебный материал
          </h1>
          <p className="main-page-subheading">
            Вставьте ссылку на YouTube-лекцию и получите структурированный
            пересказ с проверочным тестом
          </p>
        </header>

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

        {isLoading && loadingMessage ? (
          <LoadingIndicator message={loadingMessage} />
        ) : null}
      </div>
    </main>
  );
}
