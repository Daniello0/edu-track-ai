import { isAxiosError } from 'axios';
import { API_FAILURE_MESSAGE } from '../constants/app.constants';

/**
 * Resolves a user-facing error message from a failed API request.
 */
export function resolveApiError(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message)) {
      return message.join(', ');
    }
  }

  return API_FAILURE_MESSAGE;
}
