import { getApiClient } from '../axios/axios.client';
import { READER_API_ROUTES } from './reader.constants';
import type { LibraryDetailResponse } from './reader.types';

const apiClient = getApiClient();

/**
 * Fetches full material content and quiz for the reader screen.
 */
export async function fetchLibraryMaterialDetail(
  materialId: string,
  accessToken: string,
): Promise<LibraryDetailResponse> {
  const response = await apiClient.get<LibraryDetailResponse>(
    READER_API_ROUTES.DETAIL(materialId),
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
}
