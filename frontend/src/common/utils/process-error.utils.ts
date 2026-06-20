import { isAxiosError } from 'axios';
import { PROCESS_FAILURE_MESSAGE } from '../constants/app.constants';

/**
 * Resolves a user-facing error message from a failed process request.
 */
export function resolveProcessError(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message)) {
      return message.join(', ');
    }
  }

  return PROCESS_FAILURE_MESSAGE;
}
