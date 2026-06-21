import axios from 'axios';
import type { MaterialSummaryResponse } from '../library/library.types';
import { PROFILE_API_ROUTES } from './profile.constants';
import type {
  LibraryListResponse,
  UpdateMaterialStatusRequest,
} from './profile.types';

// FIXME: DRY and SRP violation - move axios creation to a separate file.
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches the authenticated user's saved materials.
 */
export async function fetchLibraryList(
  accessToken: string,
): Promise<LibraryListResponse> {
  const response = await apiClient.get<LibraryListResponse>(
    PROFILE_API_ROUTES.LIST,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
}

/**
 * Updates mastery status for a saved material.
 */
export async function updateMaterialStatus(
  materialId: string,
  payload: UpdateMaterialStatusRequest,
  accessToken: string,
): Promise<MaterialSummaryResponse> {
  const response = await apiClient.patch<MaterialSummaryResponse>(
    PROFILE_API_ROUTES.UPDATE_STATUS(materialId),
    payload,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
}

/**
 * Deletes a material from the user's library.
 */
export async function deleteMaterial(
  materialId: string,
  accessToken: string,
): Promise<void> {
  await apiClient.delete(PROFILE_API_ROUTES.DELETE(materialId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * Creates an axios client instance for API calls (used in tests).
 */
export function getProfileApiClient(): typeof apiClient {
  return apiClient;
}
