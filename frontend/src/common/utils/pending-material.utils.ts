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

/**
 * Reads guest pending material from sessionStorage, if present.
 */
export function readPendingMaterial(): PendingMaterial | null {
  const raw = sessionStorage.getItem(PENDING_MATERIAL_STORAGE_KEY);
  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingMaterial;
  } catch {
    return null;
  }
}

/**
 * Removes guest pending material from sessionStorage.
 */
export function clearPendingMaterial(): void {
  sessionStorage.removeItem(PENDING_MATERIAL_STORAGE_KEY);
}
