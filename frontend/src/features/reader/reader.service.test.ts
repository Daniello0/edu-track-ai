import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { READER_API_ROUTES } from './reader.constants';
import type { LibraryDetailResponse } from './reader.types';

const mockGet = vi.fn();
const materialId = '00000000-0000-4000-8000-000000000001';
const accessToken = 'test-access-token';

const libraryDetail: LibraryDetailResponse = {
  id: materialId,
  videoId: 'abc123xyz',
  title: 'Library material',
  content: '# Markdown content',
  category: MaterialCategory.SCIENCE,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.EN,
  status: MaterialStatus.READ,
  quiz: null,
  createdAt: '2026-06-11T10:00:00.000Z',
  lastViewedAt: '2026-06-11T12:00:00.000Z',
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: (...args: unknown[]) => mockGet(...args),
    })),
  },
}));

describe('reader.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches library material detail with auth header', async () => {
    mockGet.mockResolvedValue({ data: libraryDetail });

    const { fetchLibraryMaterialDetail } = await import('./reader.service');
    const result = await fetchLibraryMaterialDetail(materialId, accessToken);

    expect(mockGet).toHaveBeenCalledWith(READER_API_ROUTES.DETAIL(materialId), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(result).toEqual(libraryDetail);
  });
});
