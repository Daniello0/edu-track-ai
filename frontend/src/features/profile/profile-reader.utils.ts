import { resolveApiError } from '../../common/utils/api-error.utils';
import { fetchLibraryMaterialDetail } from '../reader/reader.service';
import { mapLibraryDetailToReaderState } from '../reader/reader.utils';
import type { ReaderState } from '../../common/types/app.types';

/** Callbacks invoked when opening a saved material in the reader. */
export interface OpenReaderMaterialHandlers {
  setReaderMaterial: (reader: ReaderState) => void;
  navigateToReader: () => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Loads a saved material from the library and opens the reader screen.
 */
export async function openReaderMaterialFromLibrary(
  materialId: string,
  accessToken: string,
  handlers: OpenReaderMaterialHandlers,
): Promise<void> {
  handlers.setIsLoading(true);
  handlers.setError(null);

  try {
    const detail = await fetchLibraryMaterialDetail(materialId, accessToken);
    handlers.setReaderMaterial(mapLibraryDetailToReaderState(detail));
    handlers.navigateToReader();
  } catch (error) {
    handlers.setError(resolveApiError(error));
  } finally {
    handlers.setIsLoading(false);
  }
}
