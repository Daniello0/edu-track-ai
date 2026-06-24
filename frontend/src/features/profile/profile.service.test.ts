import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { PROFILE_API_ROUTES } from './profile.constants';
import type { LibraryListResponse } from './profile.types';

const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockDelete = vi.fn();
const materialId = '00000000-0000-4000-8000-000000000001';
const accessToken = 'test-access-token';

const libraryList: LibraryListResponse = {
  items: [
    {
      id: materialId,
      videoId: 'abc123xyz',
      title: 'Sample material',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      status: MaterialStatus.READ,
      bestScore: 60,
      createdAt: '2026-06-10T10:00:00.000Z',
      lastViewedAt: '2026-06-11T12:00:00.000Z',
    },
  ],
};

const statusResponse = {
  id: materialId,
  videoId: 'abc123xyz',
  title: 'Sample material',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.MASTERED,
  isPersisted: true,
};

vi.mock('../axios/axios.client', () => ({
  getApiClient: () => ({
    get: (...args: unknown[]) => mockGet(...args),
    patch: (...args: unknown[]) => mockPatch(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  }),
}));

describe('profile.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches library list with auth header', async () => {
    mockGet.mockResolvedValue({ data: libraryList });

    const { fetchLibraryList } = await import('./profile.service');
    const result = await fetchLibraryList(accessToken);

    expect(mockGet).toHaveBeenCalledWith(PROFILE_API_ROUTES.LIST, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(result).toEqual(libraryList);
  });

  it('updates material status with auth header', async () => {
    mockPatch.mockResolvedValue({ data: statusResponse });
    const payload = { status: MaterialStatus.MASTERED };

    const { updateMaterialStatus } = await import('./profile.service');
    const result = await updateMaterialStatus(materialId, payload, accessToken);

    expect(mockPatch).toHaveBeenCalledWith(
      PROFILE_API_ROUTES.UPDATE_STATUS(materialId),
      payload,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    expect(result).toEqual(statusResponse);
  });

  it('deletes material with auth header', async () => {
    mockDelete.mockResolvedValue({ data: undefined });

    const { deleteMaterial } = await import('./profile.service');
    await deleteMaterial(materialId, accessToken);

    expect(mockDelete).toHaveBeenCalledWith(
      PROFILE_API_ROUTES.DELETE(materialId),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  });
});
