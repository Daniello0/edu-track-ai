import axios from 'axios';
import { READER_API_ROUTES } from './reader.constants';
import type { LibraryDetailResponse } from './reader.types';

// FIXME: DRY and SRP violation - move axios creation to a separate file.
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

/**
 * Creates an axios client instance for API calls (used in tests).
 */
export function getReaderApiClient(): typeof apiClient {
  return apiClient;
}
