import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import type { LibraryItem } from './profile.types';

const mockFetchLibraryList = vi.fn();

vi.mock('./profile.service', () => ({
  fetchLibraryList: (...args: unknown[]) => mockFetchLibraryList(...args),
}));

describe('profile-library.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and sorts library items for the profile dashboard', async () => {
    const items: LibraryItem[] = [
      {
        id: 'older',
        videoId: 'a',
        title: 'Older',
        category: MaterialCategory.SCIENCE,
        format: MaterialFormat.NARRATIVE,
        summaryLength: null,
        language: Language.RU,
        status: MaterialStatus.READ,
        bestScore: 0,
        createdAt: '2026-06-01T10:00:00.000Z',
        lastViewedAt: '2026-06-01T10:00:00.000Z',
      },
      {
        id: 'newer',
        videoId: 'b',
        title: 'Newer',
        category: MaterialCategory.PROGRAMMING,
        format: MaterialFormat.NARRATIVE,
        summaryLength: null,
        language: Language.RU,
        status: MaterialStatus.MASTERED,
        bestScore: 90,
        createdAt: '2026-06-10T10:00:00.000Z',
        lastViewedAt: '2026-06-20T10:00:00.000Z',
      },
    ];
    mockFetchLibraryList.mockResolvedValue({ items });

    const { loadProfileLibrary } = await import('./profile-library.utils');
    const result = await loadProfileLibrary('token');

    expect(result.items[0]?.id).toBe('newer');
    expect(result.stats.totalMaterials).toBe(2);
    expect(result.stats.quizzesCompleted).toBe(1);
  });
});
