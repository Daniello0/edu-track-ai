import { ProcessStep } from '../../common/enums/process-step.enum';
import { storeGuestPendingMaterial } from '../../common/utils/pending-material.utils';
import { resolveProcessError } from '../../common/utils/process-error.utils';
import { mapProcessResponseToReaderState } from '../../common/utils/process-response.utils';
import type {
  MainPageFormValues,
  ProcessResponse,
  ReaderState,
} from '../../common/types/app.types';
import { processVideo } from './main.service';
import { buildProcessRequest, validateMainPageForm } from './main.utils';

/** Callbacks invoked during main page process submission. */
export interface ProcessSubmissionHandlers {
  setFieldError: (error: string | null) => void;
  setProcessLoading: (isLoading: boolean, step?: ProcessStep) => void;
  setProcessError: (error: string | null) => void;
  setReaderMaterial: (reader: ReaderState) => void;
  onProcessComplete?: () => void;
}

/**
 * Validates form values and returns the first validation error, if any.
 */
export async function validateProcessSubmission(
  formValues: MainPageFormValues,
): Promise<string | null> {
  return validateMainPageForm(formValues);
}

/**
 * Calls the process API and applies the response to app state.
 */
export async function executeVideoProcessing(
  formValues: MainPageFormValues,
  accessToken: string | null,
  handlers: ProcessSubmissionHandlers,
): Promise<void> {
  handlers.setProcessLoading(true, ProcessStep.TRANSCRIBING);

  try {
    handlers.setProcessLoading(true, ProcessStep.AI_PROCESSING);
    const response = await processVideo(
      buildProcessRequest(formValues),
      accessToken,
    );
    applyProcessResponse(response, handlers);
  } catch (error) {
    handlers.setProcessError(resolveProcessError(error));
  }
}

/**
 * Updates reader state and persists guest material when needed.
 */
export function applyProcessResponse(
  response: ProcessResponse,
  handlers: ProcessSubmissionHandlers,
): void {
  handlers.setReaderMaterial(mapProcessResponseToReaderState(response));
  storeGuestPendingMaterial(response);
  handlers.onProcessComplete?.();
}

/**
 * Orchestrates validation and video processing for the main page form.
 */
export async function submitMainPageProcess(
  formValues: MainPageFormValues,
  accessToken: string | null,
  handlers: ProcessSubmissionHandlers,
): Promise<void> {
  const validationError = await validateProcessSubmission(formValues);
  if (validationError) {
    handlers.setFieldError(validationError);
    return;
  }

  handlers.setFieldError(null);
  await executeVideoProcessing(formValues, accessToken, handlers);
}
