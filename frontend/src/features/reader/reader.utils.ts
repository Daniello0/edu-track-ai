import * as yup from 'yup';
import type { ReaderState } from '../../common/types/app.types';
import { readerDisplaySchema } from './reader.schema';
import type {
  LibraryDetailResponse,
  ReaderDisplayFields,
} from './reader.types';

/**
 * Returns true when reader state contains enough data to render the page.
 */
export function hasReadableContent(reader: ReaderState): boolean {
  return Boolean(reader.title?.trim() && reader.content?.trim());
}

/**
 * Returns true when reader state includes at least one quiz question.
 */
export function hasQuizInReader(reader: ReaderState): boolean {
  return Boolean(reader.quiz?.length);
}

/**
 * Maps GET /api/library/:id response to the reader slice in Zustand.
 */
export function mapLibraryDetailToReaderState(
  detail: LibraryDetailResponse,
): ReaderState {
  return {
    materialId: detail.id,
    pendingId: null,
    videoId: detail.videoId,
    title: detail.title,
    content: detail.content,
    category: detail.category,
    format: detail.format,
    summaryLength: detail.summaryLength,
    language: detail.language,
    quiz: detail.quiz?.questions ?? null,
    isPersisted: true,
  };
}

/**
 * Validates reader display fields and returns the first error message, if any.
 */
export async function validateReaderDisplay(
  fields: ReaderDisplayFields,
): Promise<string | null> {
  try {
    await readerDisplaySchema.validate(fields, { abortEarly: true });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }

    throw error;
  }
}
