import axios, { type AxiosInstance } from 'axios';
import { API_BASE_PATH, API_CLIENT_DEFAULT_HEADERS } from './axios.constants';

let apiClient: AxiosInstance | undefined;

/**
 * Returns the shared axios client for backend API calls.
 */
export function getApiClient(): AxiosInstance {
  if (apiClient === undefined) {
    apiClient = axios.create({
      baseURL: API_BASE_PATH,
      headers: API_CLIENT_DEFAULT_HEADERS,
    });
  }

  return apiClient;
}
