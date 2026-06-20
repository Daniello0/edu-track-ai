import { PENDING_MATERIAL_STORAGE_KEY } from '../constants/app.constants';
import type { PendingMaterial, ProcessResponse } from '../types/app.types';
import { mapProcessResponseToPendingMaterial } from './process-response.utils';

/**
 * Persists guest material in sessionStorage for claim after auth.
 */
export function savePendingMaterial(pending: PendingMaterial): void {
  sessionStorage.setItem(PENDING_MATERIAL_STORAGE_KEY, JSON.stringify(pending));
}

/**
 * Saves guest pending material when the process response requires claim.
 */
export function storeGuestPendingMaterial(response: ProcessResponse): void {
  const pending = mapProcessResponseToPendingMaterial(response);
  if (pending) {
    savePendingMaterial(pending);
  }
}
