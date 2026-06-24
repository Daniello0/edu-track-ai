import { describe, expect, it } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import type { LibraryItem } from './profile.types';
import {
  computeProfileStats,
  formatLibraryItemDate,
  sortLibraryItemsByLastViewed,
  validateUpdateMaterialStatus,
} from './profile.utils';

const createItem = (overrides: Partial<LibraryItem> = {}): LibraryItem => ({
  id: '00000000-0000-4000-8000-000000000001',
  videoId: 'video-a',
  title: 'Material A',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.READ,
  bestScore: 0,
  createdAt: '2026-06-10T10:00:00.000Z',
  lastViewedAt: '2026-06-10T10:00:00.000Z',
  ...overrides,
});

describe('profile.utils', () => {
  it('formats library item dates for the profile grid', () => {
    const formatted = formatLibraryItemDate('2026-06-20T14:30:00.000Z');

    expect(formatted).toContain('2026');
  });

  it('sorts library items by last viewed date descending', () => {
    const sorted = sortLibraryItemsByLastViewed([
      createItem({
        id: 'older',
        lastViewedAt: '2026-06-01T10:00:00.000Z',
      }),
      createItem({
        id: 'newer',
        lastViewedAt: '2026-06-20T10:00:00.000Z',
      }),
    ]);

    expect(sorted[0]?.id).toBe('newer');
  });

  it('computes profile stats from library items', () => {
    const stats = computeProfileStats([
      createItem({
        category: MaterialCategory.PROGRAMMING,
        status: MaterialStatus.MASTERED,
        bestScore: 90,
      }),
      createItem({
        id: '00000000-0000-4000-8000-000000000002',
        category: MaterialCategory.PROGRAMMING,
        status: MaterialStatus.READ,
        bestScore: 60,
      }),
      createItem({
        id: '00000000-0000-4000-8000-000000000003',
        category: MaterialCategory.SCIENCE,
        status: MaterialStatus.RETAKE,
        bestScore: 0,
      }),
    ]);

    expect(stats).toEqual({
      totalMaterials: 3,
      masteredCount: 1,
      quizzesCompleted: 2,
      favoriteCategory: MaterialCategory.PROGRAMMING,
    });
  });

  it('validates material status update payload', async () => {
    expect(
      await validateUpdateMaterialStatus({ status: MaterialStatus.MASTERED }),
    ).toBeNull();
    expect(
      await validateUpdateMaterialStatus({
        status: 'invalid' as MaterialStatus,
      }),
    ).toBeTruthy();
  });
});
