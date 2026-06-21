import { APP_ROUTES } from '../../common/constants/app.constants';
import { ProcessStep } from '../../common/enums/process-step.enum';
import { MOCK_READER_STATE } from '../../common/mocks/material.mock';
import type {
  MainPageFormValues,
  ReaderState,
} from '../../common/types/app.types';
import { PROCESS_STEP_MESSAGES } from './main.constants';
import { validateMainPageForm } from './main.utils';

/** Delay between mock processing steps (ms). */
const MOCK_STEP_DELAY_MS = 1200;

interface MockNavigationDeps {
  setFieldError: (error: string | null) => void;
  setProcessLoading: (isLoading: boolean, step?: ProcessStep) => void;
  setReaderMaterial: (reader: ReaderState) => void;
  navigate: (path: string) => void;
}

/**
 * Waits for a given duration (mock pipeline step).
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Simulates processing steps and navigates to reader with mock data.
 */
export async function mockNavigateToReader(
  formValues: MainPageFormValues,
  deps: MockNavigationDeps,
): Promise<void> {
  const validationError = await validateMainPageForm(formValues);
  if (validationError) {
    deps.setFieldError(validationError);
    return;
  }

  deps.setFieldError(null);
  deps.setProcessLoading(true, ProcessStep.TRANSCRIBING);
  await delay(MOCK_STEP_DELAY_MS);
  deps.setProcessLoading(true, ProcessStep.AI_PROCESSING);
  await delay(MOCK_STEP_DELAY_MS);
  deps.setReaderMaterial(MOCK_READER_STATE);
  deps.navigate(APP_ROUTES.READER);
}

/** Returns loading message for the current mock process step. */
export function getMockLoadingMessage(step: ProcessStep): string | null {
  if (step === ProcessStep.TRANSCRIBING) {
    return PROCESS_STEP_MESSAGES.transcribing;
  }

  if (step === ProcessStep.AI_PROCESSING) {
    return PROCESS_STEP_MESSAGES.ai_processing;
  }

  return null;
}
