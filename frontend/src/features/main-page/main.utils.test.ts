import { describe, expect, it } from 'vitest';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { Language } from '../../common/enums/language.enum';
import { ProcessStep } from '../../common/enums/process-step.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import {
  DEFAULT_MAIN_PAGE_VALUES,
  PROCESS_STEP_MESSAGES,
} from './main.constants';
import {
  buildProcessRequest,
  getProcessLoadingMessage,
  mapFormValuesToSettings,
  validateMainPageForm,
} from './main.utils';

describe('main.utils', () => {
  it('maps narrative form values to settings with null summaryLength', () => {
    const settings = mapFormValuesToSettings({
      ...DEFAULT_MAIN_PAGE_VALUES,
      format: MaterialFormat.NARRATIVE,
    });

    expect(settings.summaryLength).toBeNull();
    expect(settings.format).toBe(MaterialFormat.NARRATIVE);
  });

  it('maps summary form values to settings with summaryLength', () => {
    const settings = mapFormValuesToSettings({
      ...DEFAULT_MAIN_PAGE_VALUES,
      format: MaterialFormat.SUMMARY,
      summaryLength: SummaryLength.LONG,
    });

    expect(settings.summaryLength).toBe(SummaryLength.LONG);
  });

  it('builds process request payload for API', () => {
    const request = buildProcessRequest({
      ...DEFAULT_MAIN_PAGE_VALUES,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });

    expect(request.videoUrl).toBe(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );
    expect(request.settings.language).toBe(Language.RU);
    expect(request.settings.hasQuiz).toBe(true);
  });

  it('returns validation error for invalid YouTube URL', async () => {
    const error = await validateMainPageForm({
      ...DEFAULT_MAIN_PAGE_VALUES,
      videoUrl: 'https://example.com',
    });

    expect(error).toBeTruthy();
  });

  it('passes validation for supported YouTube URL', async () => {
    const error = await validateMainPageForm({
      ...DEFAULT_MAIN_PAGE_VALUES,
      videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
    });

    expect(error).toBeNull();
  });

  it('returns loading message for active process steps', () => {
    expect(getProcessLoadingMessage(ProcessStep.TRANSCRIBING)).toBe(
      PROCESS_STEP_MESSAGES.transcribing,
    );
    expect(getProcessLoadingMessage(ProcessStep.AI_PROCESSING)).toBe(
      PROCESS_STEP_MESSAGES.ai_processing,
    );
    expect(getProcessLoadingMessage(ProcessStep.IDLE)).toBeNull();
  });
});
