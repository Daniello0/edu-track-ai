import { describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import {
  mapProcessResponseToPendingMaterial,
  mapProcessResponseToReaderState,
} from '../../common/utils/process-response.utils';
import type { ProcessResponse } from '../../common/types/app.types';

const baseResponse: ProcessResponse = {
  id: null,
  pendingId: 'pending-1',
  videoId: 'video-1',
  title: 'Sample',
  content: 'Content',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  quiz: null,
  isPersisted: false,
};

describe('process-response.utils', () => {
  it('maps process response to reader state', () => {
    const reader = mapProcessResponseToReaderState({
      ...baseResponse,
      id: 'material-1',
      isPersisted: true,
    });

    expect(reader.materialId).toBe('material-1');
    expect(reader.isPersisted).toBe(true);
    expect(reader.videoId).toBe('video-1');
  });

  it('maps guest response to pending material', () => {
    const pending = mapProcessResponseToPendingMaterial(baseResponse);

    expect(pending?.pendingId).toBe('pending-1');
    expect(pending?.title).toBe('Sample');
  });

  it('returns null pending material for persisted response', () => {
    expect(
      mapProcessResponseToPendingMaterial({
        ...baseResponse,
        isPersisted: true,
      }),
    ).toBeNull();
  });
});

describe('submitMainPageProcess', () => {
  it('sets field error when validation fails', async () => {
    const { submitMainPageProcess } = await import('./submit-process.utils');
    const setFieldError = vi.fn();

    await submitMainPageProcess(
      {
        videoUrl: 'invalid',
        format: MaterialFormat.NARRATIVE,
        summaryLength: SummaryLength.MEDIUM,
        language: Language.RU,
        hasQuiz: true,
        quizQuestionsCount: 5,
        quizOptionsCount: 4,
      },
      null,
      {
        setFieldError,
        setProcessLoading: vi.fn(),
        setProcessError: vi.fn(),
        setReaderMaterial: vi.fn(),
      },
    );

    expect(setFieldError).toHaveBeenCalled();
  });
});
