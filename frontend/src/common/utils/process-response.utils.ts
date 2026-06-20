import type {
  MaterialPayload,
  PendingMaterial,
  ProcessResponse,
  ReaderState,
} from '../types/app.types';

/**
 * Maps shared material fields from a process API response.
 */
export function mapProcessResponseToMaterialPayload(
  response: ProcessResponse,
): MaterialPayload {
  return {
    videoId: response.videoId,
    title: response.title,
    content: response.content,
    category: response.category,
    format: response.format,
    summaryLength: response.summaryLength,
    language: response.language,
    quiz: response.quiz,
  };
}

/**
 * Maps a process API response to the reader slice in Zustand.
 */
export function mapProcessResponseToReaderState(
  response: ProcessResponse,
): ReaderState {
  return {
    ...mapProcessResponseToMaterialPayload(response),
    materialId: response.id,
    pendingId: response.pendingId ?? null,
    isPersisted: response.isPersisted,
  };
}

/**
 * Maps a guest process response to sessionStorage payload, if applicable.
 */
export function mapProcessResponseToPendingMaterial(
  response: ProcessResponse,
): PendingMaterial | null {
  if (response.isPersisted || !response.pendingId) {
    return null;
  }

  return {
    pendingId: response.pendingId,
    ...mapProcessResponseToMaterialPayload(response),
  };
}
