import { describe, expect, it } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import type { ReaderState } from '../../common/types/app.types';
import type { LibraryDetailResponse } from './reader.types';
import {
  hasQuizInReader,
  hasReadableContent,
  mapLibraryDetailToReaderState,
  validateReaderDisplay,
} from './reader.utils';

const baseReaderState: ReaderState = {
  materialId: '00000000-0000-4000-8000-000000000001',
  pendingId: null,
  videoId: 'dQw4w9WgXcQ',
  title: 'Test title',
  content: 'Test content',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  quiz: null,
  isPersisted: true,
};

const libraryDetail: LibraryDetailResponse = {
  id: '00000000-0000-4000-8000-000000000002',
  videoId: 'abc123xyz',
  title: 'Library material',
  content: '# Markdown content',
  category: MaterialCategory.SCIENCE,
  format: MaterialFormat.SUMMARY,
  summaryLength: null,
  language: Language.EN,
  status: MaterialStatus.READ,
  quiz: {
    id: '00000000-0000-4000-8000-000000000003',
    questions: [{ question: 'Q1', options: ['A', 'B'] }],
    bestScore: 0,
    attempts: [],
  },
  createdAt: '2026-06-11T10:00:00.000Z',
  lastViewedAt: '2026-06-11T12:00:00.000Z',
};

describe('reader.utils', () => {
  it('detects readable content when title and content are present', () => {
    expect(hasReadableContent(baseReaderState)).toBe(true);
  });

  it('detects missing readable content', () => {
    expect(hasReadableContent({ ...baseReaderState, title: '  ' })).toBe(false);
  });

  it('detects quiz availability in reader state', () => {
    expect(
      hasQuizInReader({
        ...baseReaderState,
        quiz: [{ question: 'Q', options: ['A'] }],
      }),
    ).toBe(true);
    expect(hasQuizInReader(baseReaderState)).toBe(false);
  });

  it('maps library detail response to reader state', () => {
    const reader = mapLibraryDetailToReaderState(libraryDetail);

    expect(reader.materialId).toBe(libraryDetail.id);
    expect(reader.title).toBe(libraryDetail.title);
    expect(reader.quiz).toEqual(libraryDetail.quiz?.questions ?? null);
    expect(reader.isPersisted).toBe(true);
  });

  it('validates reader display fields', async () => {
    expect(
      await validateReaderDisplay({ title: '', content: 'x' }),
    ).toBeTruthy();
    expect(
      await validateReaderDisplay({
        title: 'Title',
        content: 'Content',
      }),
    ).toBeNull();
  });
});
