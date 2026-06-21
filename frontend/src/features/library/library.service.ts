import axios from 'axios';
import { LIBRARY_API_ROUTES } from './library.constants';
import type {
  ClaimPendingRequest,
  MaterialSummaryResponse,
} from './library.types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Persists a guest-processed material after authentication.
 */
export async function claimPendingMaterial(
  pendingId: string,
  accessToken: string,
): Promise<MaterialSummaryResponse> {
  const payload: ClaimPendingRequest = { pendingId };
  const response = await apiClient.post<MaterialSummaryResponse>(
    LIBRARY_API_ROUTES.CLAIM_PENDING,
    payload,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
}
