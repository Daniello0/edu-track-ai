import * as yup from 'yup';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { ProcessStep } from '../../common/enums/process-step.enum';
import type {
  MainPageFormValues,
  ProcessRequest,
  ProcessSettings,
} from '../../common/types/app.types';
import { PROCESS_STEP_MESSAGES } from './main.constants';
import { mainPageFormSchema } from './main.schema';

/**
 * Returns loading message for the current process step.
 */
export function getProcessLoadingMessage(step: ProcessStep): string | null {
  if (step === ProcessStep.TRANSCRIBING) {
    return PROCESS_STEP_MESSAGES.transcribing;
  }

  if (step === ProcessStep.AI_PROCESSING) {
    return PROCESS_STEP_MESSAGES.ai_processing;
  }

  return null;
}

/**
 * Maps validated form values to API process settings.
 */
export function mapFormValuesToSettings(
  values: MainPageFormValues,
): ProcessSettings {
  const isSummary = values.format === MaterialFormat.SUMMARY;

  return {
    format: values.format,
    summaryLength: isSummary ? values.summaryLength : null,
    language: values.language,
    hasQuiz: values.hasQuiz,
    quizQuestionsCount: values.quizQuestionsCount,
    quizOptionsCount: values.quizOptionsCount,
  };
}

/**
 * Builds the POST /api/process request body from form values.
 */
export function buildProcessRequest(
  values: MainPageFormValues,
): ProcessRequest {
  return {
    videoUrl: values.videoUrl.trim(),
    settings: mapFormValuesToSettings(values),
  };
}

/**
 * Validates main page form values and returns the first error message, if any.
 */
export async function validateMainPageForm(
  values: MainPageFormValues,
): Promise<string | null> {
  try {
    await mainPageFormSchema.validate(values, { abortEarly: true });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }

    throw error;
  }
}
