import type {
  ProcessRequest,
  ProcessResponse,
} from '../../common/types/app.types';
import { getApiClient } from '../axios/axios.client';

const apiClient = getApiClient();

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
