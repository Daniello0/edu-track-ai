import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { LIBRARY_API_ROUTES } from './library.constants';

const mockPost = vi.fn();
const pendingId = '00000000-0000-4000-8000-000000000001';
const accessToken = 'test-access-token';

const claimResponse = {
  id: '00000000-0000-4000-8000-000000000002',
  videoId: 'abc123xyz',
  title: 'Sample material',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.READ,
  isPersisted: true,
};

vi.mock('../axios/axios.client', () => ({
  getApiClient: () => ({
    post: (...args: unknown[]) => mockPost(...args),
  }),
}));

describe('library.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('claims pending material with auth header', async () => {
    mockPost.mockResolvedValue({ data: claimResponse });

    const { claimPendingMaterial } = await import('./library.service');
    const result = await claimPendingMaterial(pendingId, accessToken);

    expect(mockPost).toHaveBeenCalledWith(
      LIBRARY_API_ROUTES.CLAIM_PENDING,
      { pendingId },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    expect(result).toEqual(claimResponse);
  });
});
