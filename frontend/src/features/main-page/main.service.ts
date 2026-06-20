import axios from 'axios';
import type {
  ProcessRequest,
  ProcessResponse,
} from '../../common/types/app.types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends a video processing request to the backend API.
 */
export async function processVideo(
  request: ProcessRequest,
  accessToken?: string | null,
): Promise<ProcessResponse> {
  const headers =
    accessToken !== undefined && accessToken !== null
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined;

  const response = await apiClient.post<ProcessResponse>('/process', request, {
    headers,
  });

  return response.data;
}

/**
 * Creates an axios client instance for API calls (used in tests).
 */
export function getApiClient(): typeof apiClient {
  return apiClient;
}
